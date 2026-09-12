export interface CardViewModel {
  identifier: string
  title: string
  image: string
  additionalTags: string[]
  duration: string
  status: string
  rating: number
  provider: string
  // Provider org names as the content APIs return them; the card footer shows organisation[0].
  organisation: string[]
  creatorLogo: string
  sourceName: string
  resourceType: string
  // Multilingual data the "available in N languages" pill is derived from.
  languageMapV1: Record<string, any>
  language: string[]
  difficultyLevel: string
  planDuration: string
  contentStatus: number
  metadata: Record<string, unknown>
  courseCategory: string
  primaryCategory: string
}

/** Status shown on a plan card's media badge. */
export type PlanStatus = 'overdue' | 'inProgress' | 'completed'

/**
 * One CBP / APAR / AI-CBP training plan, as rendered by CardType.PlanCard.
 *
 * Deliberately NOT a CardViewModel: a plan is not a piece of content — it has no
 * thumbnail (the card draws a themed one), no rating, no duration and no provider org.
 * `metadata` keeps the raw plan so navigation and future fields need no remapping.
 */
export interface PlanCardViewModel {
  /** Plan id — the CBPlan API sends it as `id`, not `identifier`. */
  identifier: string
  title: string
  /** Financial year the plan belongs to, e.g. '2026-27'. */
  planYear: string
  endDate: string
  /** Number of entries in the plan's contentList. */
  contentCount: number
  /** 'Course', 'Blended program', … — the plan's declared content type. */
  contentType: string
  /** Display name for the "Created By" row. */
  createdByName: string
  /** Plan lifecycle status as the API reports it: draft / live / retire. */
  status: string
  planType: 'APAR' | 'AICBP' | 'CBP'
  planStatus: PlanStatus
  metadata: Record<string, unknown>
}
