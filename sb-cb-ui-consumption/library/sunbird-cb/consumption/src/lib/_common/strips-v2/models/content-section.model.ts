export enum VisibilityMode {
  Visible = 'visible',
  Hidden = 'hidden',
  Disabled = 'disabled'
}

export enum DisplayType {
  Tabs = 'tabs',
  Pills = 'pills',
  Cards = 'cards',
  Spotlight = 'spotlight',
  Banner = 'banner',
  WelcomeGreeting = 'welcomeGreeting',
  LearningProgress = 'learningProgress'
}

export enum CardType {
  CourseCard = 'courseCard',
  AssessmentCard = 'assessmentCard',
  ProgramCard = 'programCard'
}

export enum ApiMethod {
  Get = 'GET',
  Post = 'POST'
}

export interface ContentConfig {
  apiDetailsKey?: string
  contentIds?: string[]
  showNoData?: boolean
  noDataMessage?: string
  cardType: CardType
  maxCardsToShow: number
  cardClickDetails: {
    courseCategory: string
  }
  viewMoreUrl: {
    path: string
    queryParams?: Record<string, any>
    f?: any
  },
  showViewAll: boolean
}

export interface SpotlightConfig {
  iconUrl: string
  label: string
  redirectionUrl: string
  enabled?: boolean
  // CSS variable (`--x` / `var(--x)`) used for both themes, or plain colours as `light,dark`.
  // See NsSpotlightCardsV2.ISpotlightCard.cardBackgroundColor for the full contract.
  cardBackgroundColor?: string
}

export interface ToggleableElement {
  enabled: boolean
}

export interface LearningProgressConfig {
  viewAll?: ToggleableElement
  inProgress?: ToggleableElement
  weeklyClaps?: ToggleableElement
}

export interface PillConfig {
  pillKey: string
  pillLabel: string
  translateLabel: boolean
  visibilityMode: VisibilityMode
  contentConfig: ContentConfig
  pillDescription?: string[]
  pillImageUrl?: string
}

export interface TabConfig {
  tabKey: string
  tabLabel: string
  translateLabel: boolean
  visibilityMode: VisibilityMode
  hasPills: boolean
  defaultPillKey?: string
  pills?: PillConfig[]
  contentConfig?: ContentConfig
}

export interface ContentSectionConfig {
  sectionKey: string
  headersubLableTeme?: string
  headerSubLabel?: string
  showHeaderSubLabel?: boolean
  header: string
  translateHeader: boolean
  visibilityMode: VisibilityMode
  displayType: DisplayType
  addToAccordian?: boolean
  hideAccordianToggel?: boolean
  defaultTabKey?: string
  tabs?: TabConfig[]
  defaultPillKey?: string
  pills?: PillConfig[]
  contentConfig?: ContentConfig
  spotlightConfig?: SpotlightConfig[]
  pillEnlarged?: boolean
  learningProgressConfig?: LearningProgressConfig,
  canShowScrollArrow?: boolean
  // true while a section's data (e.g. pill visibility counts) is still being fetched — see ContentApiService.updateSection
  sectionLoading?: boolean
}

export interface DynamicTab {
  key: string
  label: string
  translateLabel: boolean
  context: TabConfig
}

export interface ChainedApiConfig {
  endpoint: string
  method: ApiMethod
  queryParams?: Record<string, string>
  headers?: Record<string, string>
  addUserId?: boolean
  // 'filterEnrolled' (default): filter the first response's source list down to items the
  // second call reports as enrolled. 'mergeIndependent': always call the second endpoint
  // (independent of the first response) and concatenate both lists.
  mode?: 'filterEnrolled' | 'mergeIndependent'
  // Dot-notation path in first response to extract the source list (e.g., 'result.content')
  sourceListPath: string
  // Field in each source item to collect as identifiers (e.g., 'identifier') — filterEnrolled mode only
  identifierField?: string
  // Builds the request body for the second API using collected identifiers
  buildBody: (ids: string[]) => Record<string, unknown>
  // Dot-notation path in second response to get the enrolled/second list (e.g., 'result.courses')
  enrolledListPath: string
  // Field in each enrolled item to match against source identifiers (e.g., 'courseId') — filterEnrolled mode only
  enrolledMatchField?: string
}

export interface ApiRegistryEntry {
  endpoint: string
  method: ApiMethod
  queryParams?: Record<string, string>
  body?: Record<string, unknown>
  headers?: Record<string, string>
  addUserId?: boolean
  chainedApi?: ChainedApiConfig
}

export interface ApiRegistryConfig {
  [key: string]: ApiRegistryEntry
}
