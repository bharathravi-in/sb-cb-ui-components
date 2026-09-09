import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Observable, from } from 'rxjs'

const API_ENDPOINTS = {
  DICTIONARY: '/apis/proxies/v8/content/v5/dictionary',
  CONTENT_READ: (doId: string) => `/apis/proxies/v8/content/v2/read/${doId}`,
}

const DB_NAME = 'iGotAppDB'
const DB_VERSION = 1
const STORE_NAME = 'dictionary'
const TIME_CHECK_KEY = 'timeCheck'
const SERVICE_KEY = 'dictionaryService'
const DICT_DB_KEY = 'all'

@Injectable({
  providedIn: 'root',
})
export class ContentDictionaryService {
  private dbPromise: Promise<IDBDatabase> | null = null

  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService,
  ) {}

  // ── IndexedDB helpers ──────────────────────────────────────────────────────

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise
    }
    this.dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    return this.dbPromise
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

  // ── Cache validity ─────────────────────────────────────────────────────────

  private isCacheValid(): boolean {
    const expirySeconds: number = this.configSvc.globalConfig?.apicache?.dictionaryTime ?? 300
    const raw = localStorage.getItem(TIME_CHECK_KEY)
    if (!raw) {
      return false
    }
    try {
      const timeCheck = JSON.parse(raw)
      const savedAt: number = timeCheck[SERVICE_KEY]
      if (!savedAt) {
        return false
      }
      return (Date.now() - savedAt) / 1000 < expirySeconds
    } catch {
      return false
    }
  }

  private saveCacheTimestamp(): void {
    let timeCheck: Record<string, number> = {}
    try {
      const raw = localStorage.getItem(TIME_CHECK_KEY)
      if (raw) {
        timeCheck = JSON.parse(raw)
      }
    } catch { /* ignore malformed value */ }
    timeCheck[SERVICE_KEY] = Date.now()
    localStorage.setItem(TIME_CHECK_KEY, JSON.stringify(timeCheck))
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Returns the full dictionary (keyed by do_id).
   * Serves from IndexedDB when the cache is still valid, otherwise fetches from the API.
   * @param forceRefresh bypass cache and always call the API
   */
  getDictionary(forceRefresh = false): Observable<Record<string, any>> {
    return from(this.getDictionaryAsync(forceRefresh))
  }

  private async getDictionaryAsync(forceRefresh: boolean): Promise<Record<string, any>> {
    if (!forceRefresh && this.isCacheValid()) {
      const cached = await this.dbGet<Record<string, any>>(DICT_DB_KEY)
      if (cached) {
        return cached
      }
    }
    return this.fetchAndCacheDictionary()
  }

  private async fetchAndCacheDictionary(): Promise<Record<string, any>> {
    const res: any = await this.http.get<any>(API_ENDPOINTS.DICTIONARY).toPromise()
    const dictionary: Record<string, any> = res?.result ?? {}
    await this.dbPut(DICT_DB_KEY, dictionary)
    this.saveCacheTimestamp()
    return dictionary
  }

  /**
   * Returns a single content item by do_id.
   * Lookup order: dictionary cache → individual IndexedDB entry → content read API.
   * When fetched from the API the result is saved to IndexedDB and merged into the dictionary.
   */
  getContent(doId: string): Observable<any> {
    return from(this.getContentAsync(doId))
  }

  private async getContentAsync(doId: string): Promise<any> {
    // 1. Check the full dictionary cache
    const dictionary = await this.dbGet<Record<string, any>>(DICT_DB_KEY)
    if (dictionary && dictionary[doId]) {
      return dictionary[doId]
    }

    // 2. Check individual entry stored from a previous content read call
    const cached = await this.dbGet<any>(doId)
    if (cached) {
      return cached
    }

    // 3. Fetch from content read API, update IndexedDB
    let content: any = null
    try {
      const res: any = await this.http.get<any>(API_ENDPOINTS.CONTENT_READ(doId)).toPromise()
      content = res?.result?.content ?? null
    } catch (err) {
      console.warn('ContentDictionaryService: content read API failed for', doId, err)
    }

    if (content) {
      await this.dbPut(doId, content)
      // Merge into the dictionary so subsequent getDictionary() calls include it
      const dict: Record<string, any> = (await this.dbGet<Record<string, any>>(DICT_DB_KEY)) ?? {}
      dict[doId] = content
      await this.dbPut(DICT_DB_KEY, dict)
    }

    return content
  }

  /**
   * Bulk variant of getContent(). Resolves many do_ids with at most ONE dictionary
   * fetch instead of one lookup per id.
   *
   * Prefer this over forkJoin(ids.map(id => getContent(id))): getContent() re-reads the
   * whole dictionary blob per id, and on a cold cache each miss issues its own content-read
   * plus a read-modify-write of the shared blob, so concurrent misses overwrite each other.
   * Misses are resolved sequentially here for that reason.
   *
   * @returns map of do_id -> content metadata; ids that cannot be resolved are omitted.
   */
  getContents(doIds: string[]): Observable<Record<string, any>> {
    return from(this.getContentsAsync(doIds))
  }

  private async getContentsAsync(doIds: string[]): Promise<Record<string, any>> {
    const resolved: Record<string, any> = {}
    const uniqueIds = Array.from(new Set((doIds || []).filter(Boolean)))
    if (!uniqueIds.length) {
      return resolved
    }

    let dictionary: Record<string, any> = {}
    try {
      dictionary = await this.getDictionaryAsync(false)
    } catch (err) {
      console.warn('ContentDictionaryService: dictionary lookup failed, falling back per content', err)
    }

    const missing: string[] = []
    uniqueIds.forEach((id: string) => {
      if (dictionary && dictionary[id]) {
        resolved[id] = dictionary[id]
      } else {
        missing.push(id)
      }
    })

    // Sequential: getContentAsync() read-modify-writes the shared dictionary blob.
    for (const id of missing) {
      try {
        const content = await this.getContentAsync(id)
        if (content) {
          resolved[id] = content
        }
      } catch (err) {
        console.warn('ContentDictionaryService: unable to resolve content', id, err)
      }
    }

    return resolved
  }

  /** Clears IndexedDB store and resets the cache timestamp. */
  clearCache(): Observable<void> {
    return from(this.clearCacheAsync())
  }

  private async clearCacheAsync(): Promise<void> {
    const db = await this.openDB()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const req = tx.objectStore(STORE_NAME).clear()
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
    try {
      const raw = localStorage.getItem(TIME_CHECK_KEY)
      if (raw) {
        const timeCheck = JSON.parse(raw)
        delete timeCheck[SERVICE_KEY]
        localStorage.setItem(TIME_CHECK_KEY, JSON.stringify(timeCheck))
      }
    } catch { /* ignore */ }
  }

  /** Returns diagnostic information about the current cache state. */
  async getCacheStats(): Promise<{ itemCount: number; lastUpdate: string | null; cacheAge: number; expiryTime: number }> {
    const expiryTime: number = this.configSvc.globalConfig?.apicache?.dictionaryTime ?? 300
    let savedAt: number | null = null
    try {
      const raw = localStorage.getItem(TIME_CHECK_KEY)
      if (raw) {
        savedAt = JSON.parse(raw)[SERVICE_KEY] ?? null
      }
    } catch { /* ignore */ }

    const dictionary = await this.dbGet<Record<string, any>>(DICT_DB_KEY)
    const itemCount = dictionary ? Object.keys(dictionary).length : 0
    const cacheAge = savedAt ? Math.floor((Date.now() - savedAt) / 1000) : -1
    const lastUpdate = savedAt ? new Date(savedAt).toISOString() : null

    return { itemCount, lastUpdate, cacheAge, expiryTime }
  }
}
