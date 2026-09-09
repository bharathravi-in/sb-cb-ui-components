import { Inject, Injectable } from '@angular/core';
import { ConfigurationsService } from './configurations.service'

// ─── Interfaces (single source of truth) ─────────────────────────────────────

export interface ITenantFeatures {
  /** Optional per-route overrides: { discuss: false } disables only the route guard */
  routes?: { [feature: string]: boolean }
  [feature: string]: boolean | { [feature: string]: boolean } | undefined
}

export interface ITenantConfig {
  type: 'core' | 'internal' | 'external'
  layout: string
  features: ITenantFeatures
  logo?: string
  redirectPath?: string
  cdnContentHost?: string
  azureHost?: string
  sitePath?: string
  karmayogiBharatLink?: string
}

/** Per-domain data as stored in application.config.json → domainList[subdomain] */
export interface IDomainData {
  logo?: string
  redirectPath?: string
  cdnContentHost?: string
  azureHost?: string
  sitePath?: string
  karmayogiBharatLink?: string
}

/**
 * global-config.json → applicationConfig.
 *
 * `tenants` is the tenant registry: one entry per tenant key, keyed exactly as
 * resolveTenant() resolves it from the hostname — '{tenant}-portal' for a tenant
 * host, 'localhost' for local development. A key with no entry is not an error:
 * every accessor then falls back to the environment values, so an unregistered
 * host keeps behaving like the main portal.
 */
export interface IApplicationConfig {
  tenants?: { [tenant: string]: Partial<ITenantConfig> }
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * DomainConfService  (single source of truth)
 *
 * Combines three responsibilities that used to live in separate files:
 *
 *  1. Tenant resolution  – resolves the tenant key from the current hostname
 *
 *  2. Tenant config      – holds the per-tenant feature flags / layout / type
 *     (defaults; extend getTenantConfig() to source these per tenant)
 *
 *  3. Domain data        – convenience accessors for CDN host, logo, redirect
 *     path, site path etc. read from application.config.json → domainList
 *     keyed by the resolved subdomain, falling back to environment values
 *
 * Inject this service directly anywhere you need tenant or domain information.
 * Interfaces ITenantConfig, IDomainData, ITenantFeatures are exported
 * from this file and re-exported from the package public-api.
 */
@Injectable({
  providedIn: 'root',
})
export class DomainConfService {

  // ── hostname / tenant ──────────────────────────────────────────────────────

  readonly currentHostname: string = window.location.hostname

  /**
   * Resolved tenant key derived from the current hostname — see resolveTenant().
   *
   * A getter, not a constructor-assigned field: resolution consults the tenant
   * registry in globalConfig, which InitService loads during APP_INITIALIZER, while
   * this service is constructed as soon as anything injects it (AuthKeycloakService
   * does, during that same init). Resolving once in the constructor would freeze the
   * answer to whatever was known before the config arrived.
   */
  get subdomain(): string {
    if (this.memoTenant !== null) { return this.memoTenant }
    const tenant = this.resolveTenant(this.currentHostname)
    // Only cache once the registry has loaded: until then 'portal.{tenant}.*' cannot
    // be told apart from the main portal, so the answer is a best-effort guess that
    // has to be re-evaluated on the next read.
    if (this.hasTenantRegistry) { this.memoTenant = tenant }
    return tenant
  }

  /** Alias: `tenant` is the same as `subdomain`, provided for readability. */
  get tenant(): string { return this.subdomain }

  environment: any

  /** Cached tenant key; null until the tenant registry is available. */
  private memoTenant: string | null = null

  // ── tenant config state ────────────────────────────────────────────────────

  defaultLogo = '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo_Horizontal.svg'
  defaultRedirectPath = '/page/home'
  constructor(
    private configSvc: ConfigurationsService,
    @Inject('environment') environment: any,
  ) {
    this.environment = environment
  }

  // ── default config (lazy getter so env values are resolved after injection) ─

  private get defaultConfig(): ITenantConfig {
    return {
      type: 'core',
      layout: 'default',
      logo: this.environment?.logo || this.defaultLogo,
      redirectPath: this.environment?.redirectPath || '/page/home',
      cdnContentHost: this.environment?.cdnContentHost || 'https://portal.igotkarmayogi.gov.in/',
      azureHost: this.environment?.azureHost || '',
      sitePath: this.environment?.sitePath || 'portal.igotkarmayogi.gov.in',
      karmayogiBharatLink: this.environment?.karmayogiBharatLink || 'https://igotkarmayogi.gov.in/',
      features: {
        discussion: true,
        network: true,
        events: true,
        leaderboard: true,
        marketplace: true,
        chatbot: true,
        tour: true,
        bottomNav: true,
      },
    }
  }

  // ── 1. Tenant resolution ───────────────────────────────────────────────────

  /**
   * Resolves the tenant key for a hostname. The hostname is the only input — there
   * is no default tenant, so a host is never silently served another tenant's brand.
   *
   * Resolution order:
   *  1. dev host     localhost / 127.0.0.1        → 'localhost'
   *  2. Tenant host  {tenant}-portal.x.y[.z]      → '{tenant}-portal'
   *  3. Legacy       portal.{tenant}.x.y[.z]      → '{tenant}', registered tenants only
   *  4. Default                                   → 'portal'
   *
   * A key with no registry entry is normal, not an error: getTenantConfig() and the
   * domain accessors fall back to the environment values, which is what keeps the
   * main portal and any unregistered host on the standard branding.
   *
   * Step 3 checks the registry instead of counting labels. Label count cannot tell a
   * tenant apart from the base domain — 'portal.mauritius.karmayogibharat.net' and
   * 'portal.igotkarmayogi.gov.in' both have four labels, but the first is tenant
   * 'mauritius' and the second is the main portal. The old `parts.length >= 4` rule
   * therefore resolved the live prod portal to tenant 'igotkarmayogi', which made
   * isExternalTenantHost() true on the main portal and only avoided visible damage
   * because no domainList entry existed under that key to be picked up.
   */
  resolveTenant(hostname: string): string {
    if (!hostname) { return 'portal' }
    // Local development has its own key: configure applicationConfig.tenants.localhost
    // to reproduce a tenant locally, or leave it out to run on the environment values.
    if (this.isDevHost(hostname)) { return 'localhost' }
    const parts = hostname.split('.')
    if (parts[0].includes('-portal')) { return parts[0] }
    if (parts[0] === 'portal') {
      return this.isRegisteredTenant(parts[1]) ? parts[1] : 'portal'
    }
    return parts[0] || 'portal'
  }

  /** True for a local development host, where no tenant is served by hostname. */
  isDevHost(hostname: string = this.currentHostname): boolean {
    return hostname.includes('localhost') || hostname === '127.0.0.1'
  }

  /** True when the resolved tenant is not the main portal */
  isExternalTenantHost(): boolean {
    return this.subdomain !== 'portal' && this.subdomain !== 'localhost'
  }

  // ── 2. Tenant config ───────────────────────────────────────────────────────

  /** global-config.json → applicationConfig */
  get applicationConfig(): IApplicationConfig {
    return this.getGlobalConfig()?.applicationConfig || {}
  }

  /** applicationConfig.tenants — the tenant registry */
  private get tenantRegistry(): { [tenant: string]: Partial<ITenantConfig> } {
    return this.applicationConfig.tenants || {}
  }

  private get hasTenantRegistry(): boolean {
    return Object.keys(this.tenantRegistry).length > 0
  }

  /**
   * True when `key` names a tenant in either config source. The legacy
   * instanceConfig.domainList is included so hostnames that already resolved
   * through it keep resolving the same way before applicationConfig.tenants is
   * populated for an environment.
   */
  private isRegisteredTenant(key: string): boolean {
    if (!key) { return false }
    return Boolean(this.tenantRegistry[key])
      || Boolean(this.configSvc?.instanceConfig?.domainList?.[key])
  }

  /**
   * Returns the full tenant configuration for the current tenant: the built-in
   * defaults with the registry entry (applicationConfig.tenants[tenant], falling
   * back to the legacy domainList entry) layered over them. `features` is merged a
   * level deeper so a tenant that switches off two flags does not lose the rest.
   */
  getTenantConfig(): ITenantConfig {
    const base = this.defaultConfig
    const entry = this.tenantEntry
    if (!Object.keys(entry).length) { return base }
    const { features, ...rest } = entry
    const merged: any = { ...base }
    // An empty / missing value in the registry must not blank out the default: a
    // tenant entry that omits cdnContentHost still needs the environment's host.
    Object.keys(rest).forEach((key: string) => {
      const value = (rest as any)[key]
      if (value !== undefined && value !== null && value !== '') {
        merged[key] = value
      }
    })
    merged.features = { ...base.features, ...(features || {}) }
    return merged as ITenantConfig
  }

  /**
   * The current tenant's registry entry. applicationConfig.tenants wins over the
   * legacy domainList so an environment can move a tenant to global-config without
   * having to delete the old entry first.
   */
  private get tenantEntry(): Partial<ITenantConfig> {
    const key = this.subdomain
    const legacy = this.configSvc?.instanceConfig?.domainList?.[key] || {}
    return { ...legacy, ...(this.tenantRegistry[key] || {}) }
  }

  /** Returns the layout identifier ('default', 'tenant-layout-v1', …) */
  getLayout(): string {
    return this.getTenantConfig().layout || 'default'
  }

  /** Returns the tenant type: 'core' | 'internal' | 'external' */
  getTenantType(): string {
    return this.getTenantConfig().type || 'core'
  }

  /** True when the tenant config declares type = 'external' */
  isExternalTenant(): boolean {
    return this.getTenantType() === 'external'
  }

  /** True when the tenant uses a non-default layout */
  hasTenantLayout(): boolean {
    return this.getLayout() !== 'default'
  }

  /**
   * Checks if a top-level feature flag is enabled for the current tenant.
   * Defaults to true when no config entry exists (safe for existing portal users).
   */
  isFeatureEnabled(feature: string): boolean {
    const config = this.getTenantConfig()
    if (!config.features) { return true }
    const flag = config.features[feature]
    return typeof flag === 'boolean' ? flag : true
  }

  /**
   * Checks the route-level feature flag (features.routes.<feature>).
   * Defaults to true when not specified.
   */
  isFeatureRoutesEnabled(feature: string): boolean {
    const config = this.getTenantConfig()
    if (!config?.features?.routes) { return true }
    return config.features.routes[feature] ?? true
  }

  isFeatureByPageEnabled(pageName: string, feature: string): boolean {
    const config = this.getTenantConfig()
    const pageFeatures = config?.features?.[pageName]
    if (!pageFeatures || typeof pageFeatures !== 'object') {
      return true
    }
    return (pageFeatures as { [feature: string]: boolean })[feature] ?? true
  }

  /** Returns all feature flags for the current tenant */
  getFeatures(): ITenantFeatures {
    return this.getTenantConfig().features || {}
  }

  // ── 3. Domain data accessors ───────────────────────────────────────────────
  //
  // Domain data is read from application.config.json → domainList, keyed by the
  // resolved subdomain. When the subdomain has no entry, every accessor falls
  // back to the corresponding environment value (see defaults in each getter).

  /**
   * The registry entry for the current tenant — applicationConfig.tenants layered
   * over the legacy domainList entry — or an empty object when the tenant has no
   * entry in either (accessors then fall back to environment).
   */
  private get domainEntry(): IDomainData {
    return this.tenantEntry as IDomainData
  }

  getDomainCDNHost(): string {
    return this.domainEntry.cdnContentHost || this.environment?.cdnContentHost
  }

  /**
   * Host that serves uploaded content (the azureHost the generateUrl helpers rewrite
   * artifact URLs onto). The tenant entry comes first: a tenant portal serves its content
   * from its own host, while environment.azureHost is a single build-time value shared by
   * every host the bundle is served from, so reading it directly sent tenant content
   * through the main portal. Falls back to the environment for the main portal and for a
   * tenant with no entry.
   */
  getDomainAzureHost(): string {
    return this.domainEntry?.azureHost || this.environment?.azureHost || ''
  }

  /**
   * Logo precedence: the tenant's own logo, then the instance app logo, then the
   * environment, then the built-in default. environment.logo was missing from this
   * chain, so a deployment with no domainList entry and no instanceConfig.logos.app
   * fell through to the hard-coded Karmayogi Bharat logo instead of its own.
   */
  getDomainAppLogo(): string {
    return this.domainEntry.logo
      || this.configSvc?.instanceConfig?.logos?.app
      || this.environment?.logo
      || this.defaultLogo
  }

  getDomainRedirectPath(): string {
    return this.domainEntry.redirectPath || this.environment?.redirectPath || this.defaultRedirectPath
  }

  getDomainSitePath(): string {
    return this.domainEntry.sitePath || this.environment?.sitePath
  }

  /** True when the current domain is the main KB portal (not a tenant portal) */
  isKbPortal(): boolean {
    return this.environment?.sitePath === this.getDomainSitePath()
  }

  /**
   * Origin that owns the current session, for /apis/reset on logout.
   *
   * Always the host the app is actually served from. The session cookie belongs to
   * that host and nowhere else, so a reset sent to a hostname read out of config
   * leaves the user logged in — which is what happened on a tenant host: the tenant
   * entry carried another environment's sitePath, and a tenant with no entry at all
   * fell back to environment.sitePath, i.e. the main portal.
   *
   * A dev host is the one exception: there is no backend on localhost, so fall back
   * to the configured site path there.
   */
  getSessionOrigin(): string {
    if (this.isDevHost()) {
      const configured = this.getDomainSitePath()
      return configured ? `https://${configured}` : window.location.origin
    }
    return window.location.origin
  }

  getNonLoggedInPageUrl(): string {
    return this.domainEntry.karmayogiBharatLink
      || this.environment?.karmayogiBharatLink
      || 'https://igotkarmayogi.gov.in/'
  }

  /** Returns the resolved tenant config data (logo, redirectPath, cdnContentHost, etc.) */
  getDomainData(): any {
    return this.getTenantConfig()
  }

  // ── 4. Global config accessors (from assets/configurations/global-config.json) ─
  //
  // These read from configSvc.globalConfig which is loaded by InitService
  // at startup from the static JSON file.

  /** Returns the entire globalConfig object */
  getGlobalConfig(): any {
    return this.configSvc.globalConfig || {}
  }

  /**
   * Single method to check if a specific element is enabled in a given section of globalConfig.
   *
   * Usage:
   *   domainConfSvc.isConfigEnabled('components.header', 'notification')
   *   domainConfSvc.isConfigEnabled('components.footer', 'downloadApp')
   *   domainConfSvc.isConfigEnabled('featureFlags', 'chatbot')
   *
   * @param sectionKey - dot-notation path to the section (e.g. 'components.header', 'featureFlags')
   * @param elementKey - the property name within that section (e.g. 'notification', 'language')
   * @returns true if the value is not explicitly false; defaults to true when not specified
   */
  isConfigEnabled(sectionKey: string, elementKey: string): boolean {
    const config = this.getGlobalConfig()
    const section = sectionKey.split('.').reduce((obj: any, key: string) => obj?.[key], config)
    if (!section || section[elementKey] === undefined) { return true }
    return section[elementKey] !== false
  }

  // ── 5. Search Categories config ────────────────────────────────────────────

  /**
   * Returns the searchCategories config from globalConfig.components.searchCategories.
   * Returns null if not configured.
   */
  getSearchCategoriesConfig(): any {
    return this.getGlobalConfig()?.components?.searchCategories || null
  }

  /**
   * Checks if the search categories feature is enabled overall.
   * Defaults to true when not configured.
   */
  isSearchCategoriesEnabled(): boolean {
    const config = this.getSearchCategoriesConfig()
    if (!config) { return true }
    return config.enabled !== false
  }

  /**
   * Checks if a specific search category is enabled.
   * Defaults to true when not configured or when the category key is not specified.
   *
   * @param categoryValue - the category value (e.g. 'courses', 'events', 'peoples', 'all')
   */
  isSearchCategoryEnabled(categoryValue: string): boolean {
    const config = this.getSearchCategoriesConfig()
    if (!config) { return true }
    const key = categoryValue || 'all'
    return config[key] !== false
  }

  // ── 6. Feature API config accessors ────────────────────────────────────────

  /**
   * Generic method to get an API URL from globalConfig.apis section.
   * Returns the configured URL only if enabled is true.
   * Returns empty string if the API is disabled (enabled: false).
   * Falls back to defaultUrl if not configured in global-config.json.
   *
   * Usage:
   *   domainConfSvc.getApiUrl('search', 'searchV4', '/apis/proxies/v8/sunbirdigot/v4/search')
   *   domainConfSvc.getApiUrl('search', 'volunteerSearch', '/apis/proxies/v8/sunbirdigot/v4/search')
   *   domainConfSvc.getApiUrl('user', 'profile', '/apis/proxies/v8/api/user/v2/read')
   *   domainConfSvc.getApiUrl('content', 'explore', '/api/course/v1/explore')
   *
   * @param service - the service group key (e.g. 'search', 'user', 'content')
   * @param apiKey - the specific API key within the service group
   * @param defaultUrl - fallback URL if not found in config
   * @returns API URL if enabled, empty string if disabled, defaultUrl if not configured
   */
  getApiUrl(service: string, apiKey: string, defaultUrl: string = ''): string {
    const apis = this.getGlobalConfig()?.apis
    const apiConfig = apis?.[service]?.[apiKey]
    
    // If not configured in global-config.json, return defaultUrl
    if (!apiConfig) { return defaultUrl }
    
    // Legacy support: if apiConfig is a string, return it directly
    if (typeof apiConfig === 'string') { return apiConfig }
    
    // New format: check enabled flag
    // If enabled is false, return empty string (API is disabled)
    if (apiConfig.enabled === false) { return '' }
    
    // If enabled is true or not specified, return the URL
    return apiConfig.url || defaultUrl
  }

  /**
   * Checks if a specific API is enabled in globalConfig.apis.
   * Returns true if the API is enabled or not configured.
   * Returns false if explicitly disabled (enabled: false).
   *
   * @param service - the service group key (e.g. 'search', 'user', 'content')
   * @param apiKey - the specific API key within the service group
   * @returns true if enabled, false if disabled
   */
  isApiEnabled(service: string, apiKey: string): boolean {
    const apis = this.getGlobalConfig()?.apis
    const apiConfig = apis?.[service]?.[apiKey]
    
    // If not configured, assume enabled
    if (!apiConfig) { return true }
    
    // Legacy support: if apiConfig is a string, it's enabled
    if (typeof apiConfig === 'string') { return true }
    
    // New format: check enabled flag (default to true if not specified)
    return apiConfig.enabled !== false
  }

  /**
   * Generic accessor for any feature config under globalConfig.features.
   * @param featureKey - the key under features (e.g. 'volunteerSearch', 'home', 'explore')
   */
  getFeatureConfig(featureKey: string): any {
    return this.getGlobalConfig()?.features?.[featureKey] || null
  }

  /**
   * Checks if a feature is enabled in globalConfig.features.<featureKey>.enabled.
   * Defaults to true when not configured.
   */
  isGlobalFeatureEnabled(featureKey: string): boolean {
    const config = this.getFeatureConfig(featureKey)
    if (!config) { return true }
    return config.enabled !== false
  }

}
