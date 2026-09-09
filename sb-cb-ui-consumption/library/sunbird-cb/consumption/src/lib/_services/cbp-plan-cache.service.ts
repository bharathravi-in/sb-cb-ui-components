import { Injectable } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { from, merge, Observable, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

/**
 * Year-scoped IndexedDB cache for CBP/CVP plan data.
 *
 * Deliberately a SEPARATE database from the content dictionary (`iGotAppDB` v1, store
 * `dictionary`). Adding a store there would require a version bump, and ContentDictionaryService
 * still opens that database at version 1 — the two would race into a VersionError.
 *
 * These are also different responsibilities: the dictionary answers "what is content X?",
 * this cache answers "what does this user's plan look like for year Y?".
 */

const DB_NAME = 'iGotCbpDB'
const DB_VERSION = 1
const STORE_NAME = 'cbpPlans'

/** Default cache lifetime in seconds, matching ContentDictionaryService's fallback. */
const DEFAULT_EXPIRY_SECONDS = 300

/** Upper bound on any single IndexedDB operation, in ms. */
const DB_TIMEOUT_MS = 2000

export interface ICbpCacheEntry {
  planYear: string
  cachedAt: number
  data: any[]
}

@Injectable({
  providedIn: 'root',
})
export class CbpPlanCacheService {
  private dbPromise: Promise<IDBDatabase> | null = null

  /** Emits whenever a plan year's cache is written, so subscribers refresh without polling. */
  private planMapUpdates = new Subject<{ planYear: string, map: Record<string, any> }>()

  constructor(private configSvc: ConfigurationsService) {}

  // ── Financial year helpers ─────────────────────────────────────────────────

  /**
   * Financial year runs April -> March, formatted as YYYY-YY.
   * e.g. Aug 2026 -> '2026-27', Feb 2027 -> '2026-27'.
   */
  getCurrentFinancialYear(date: Date = new Date()): string {
    const month = date.getMonth() // 0 = January
    const year = date.getFullYear()
    const startYear = month >= 3 ? year : year - 1
    const endYear = (startYear + 1) % 100
    return `${startYear}-${`0${endYear}`.slice(-2)}`
  }

  // ── IndexedDB helpers ──────────────────────────────────────────────────────

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise
    }
    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
      // A pending deleteDatabase(), or another tab holding this database open across a
      // version change, leaves the open request queued: neither onsuccess nor onerror
      // ever fires. Without this the promise never settles and every caller awaiting
      // the cache hangs with it — silently, with nothing logged.
      req.onblocked = () => reject(new Error(`${DB_NAME}: open blocked by another connection`))
    }).catch((err: any) => {
      // Never keep a rejected promise cached, or the first failure would disable the
      // cache for the lifetime of the page.
      this.dbPromise = null
      throw err
    })
    return this.dbPromise
  }

  /**
   * Bounds every IndexedDB await. The cache is an optimisation, so a database that is
   * slow, blocked or unavailable must degrade to a miss rather than stall the caller —
   * `fetchCbpPlanListV3Async` awaits getEntry() before it issues the API request.
   */
  private withTimeout<T>(operation: Promise<T>, label: string): Promise<T | undefined> {
    return new Promise<T | undefined>(resolve => {
      let settled = false
      const finish = (value: T | undefined) => {
        if (!settled) {
          settled = true
          clearTimeout(timer)
          resolve(value)
        }
      }
      const timer = setTimeout(() => {
        if (!settled) {
          console.warn(`CbpPlanCacheService: ${label} timed out after ${DB_TIMEOUT_MS}ms`)
          finish(undefined)
        }
      },                       DB_TIMEOUT_MS)
      operation.then(finish, (err: any) => {
        console.warn(`CbpPlanCacheService: ${label} failed`, err)
        finish(undefined)
      })
    })
  }

  private async dbGet<T>(key: string): Promise<T | undefined> {
    const db = await this.openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(key)
      req.onsuccess = () => resolve(req.result as T)
      req.onerror = () => reject(req.error)
    })
  }

  private async dbPut(key: string, value: any): Promise<void> {
    const db = await this.openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const req = tx.objectStore(STORE_NAME).put(value, key)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  private async dbDelete(key: string): Promise<void> {
    const db = await this.openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const req = tx.objectStore(STORE_NAME).delete(key)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  get expirySeconds(): number {
    return this.configSvc.globalConfig?.apicache?.cbpTime ?? DEFAULT_EXPIRY_SECONDS
  }

  isEntryValid(entry: ICbpCacheEntry | undefined): boolean {
    if (!entry || !entry.cachedAt) {
      return false
    }
    return (Date.now() - entry.cachedAt) / 1000 < this.expirySeconds
  }

  /**
   * Returns the raw cache entry for a plan year, fresh or stale.
   * Callers use isEntryValid() to decide, so a stale entry can still serve as an
   * API-failure fallback rather than being silently discarded.
   */
  async getEntry(planYear: string): Promise<ICbpCacheEntry | undefined> {
    if (!planYear) {
      return undefined
    }
    return this.withTimeout(this.dbGet<ICbpCacheEntry>(planYear), `read for ${planYear}`)
  }

  async setEntry(planYear: string, data: any[]): Promise<void> {
    if (!planYear) {
      return
    }
    const entry: ICbpCacheEntry = { planYear, cachedAt: Date.now(), data: data || [] }
    await this.withTimeout(this.dbPut(planYear, entry), `write for ${planYear}`)
    this.planMapUpdates.next({ planYear, map: this.toPlanMap(entry.data) })
  }

  // ── Plan map (identifier -> CBP item) ──────────────────────────────────────
  //
  // Card/TOC components only need "is this content in my plan, and when is it due".
  // They used to poll localStorage['cbpData'] on a setInterval; they now read this
  // cache instead, and watchPlanMap() pushes updates so the polling can go away.

  private toPlanMap(data?: any[]): Record<string, any> {
    const planMap: Record<string, any> = {}
    ;(data || []).forEach((item: any) => {
      if (item && item.identifier) {
        planMap[item.identifier] = item
      }
    })
    return planMap
  }

  /** One-shot read of the cached plan map for a year. Resolves to {} on a miss. */
  async getPlanMap(planYear?: string): Promise<Record<string, any>> {
    const year = planYear || this.getCurrentFinancialYear()
    const entry = await this.getEntry(year)
    return this.toPlanMap(entry && entry.data)
  }

  /**
   * Emits the cached plan map for a year immediately, then again each time that
   * year's cache is rewritten. Replaces the old setInterval polling of cbpData.
   */
  watchPlanMap(planYear?: string): Observable<Record<string, any>> {
    const year = planYear || this.getCurrentFinancialYear()
    return merge(
      from(this.getPlanMap(year)),
      this.planMapUpdates.pipe(
        filter((update: any) => update.planYear === year),
        map((update: any) => update.map),
      ),
    )
  }

  /** Clears one plan year, or every plan year when called with no argument. */
  async clear(planYear?: string): Promise<void> {
    try {
      if (planYear) {
        await this.dbDelete(planYear)
        return
      }
      const db = await this.openDB()
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const req = tx.objectStore(STORE_NAME).clear()
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      })
    } catch (err) {
      console.warn('CbpPlanCacheService: clear failed', err)
    }
  }
}
