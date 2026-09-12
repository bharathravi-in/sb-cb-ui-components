import { Injectable } from '@angular/core'
import { CardType } from '../models/content-section.model'
import { CardViewModel, PlanCardViewModel, PlanStatus } from '../models/card.model'
import dayjs from 'dayjs'
import { NsCardContent } from '../../../_models/card-content-v2.model'

@Injectable({ providedIn: 'root' })
export class CardTransformerService {

  transformCards(response: unknown, cardType: CardType, apiDetailsKey?: string): any[] {
    if (!response) {
      return []
    }

    switch (cardType) {
      case CardType.CourseCard:
        return this.processCourseCards(response, apiDetailsKey)
      case CardType.AssessmentCard:
        return this.processAssessmentCards(response)
      case CardType.ProgramCard:
        return this.processProgramCards(response)
      case CardType.PlanCard:
        return this.processPlanCards(response, apiDetailsKey)
      default:
        return []
    }
  }

  processCourseCards(response: unknown, apiDetailsKey?: string): any[] {
    const data = this.extractResultArray(response)
    if (apiDetailsKey) {
      return this.mapTheData(data, apiDetailsKey)
    }
    return data.map((item: Record<string, unknown>) => ({
      identifier: (item?.['identifier'] as string) ?? '',
      title: (item?.['name'] as string) ?? '',
      image: (item?.['appIcon'] as string) ?? (item?.['posterImage'] as string) ?? '',
      tags: (item?.['tags'] as string[]) ?? [],
      duration: (item?.['duration'] as string) ?? '',
      status: (item?.['status'] as string) ?? '',
      rating: this.resolveRating(item),
      provider: this.resolveProvider(item),
      organisation: this.resolveOrganisation(item),
      creatorLogo: this.resolveCreatorLogo(item),
      sourceName: this.resolveSourceName(item),
      resourceType: this.resolveResourceType(item),
      languageMapV1: this.resolveLanguageMap(item),
      language: this.resolveLanguage(item),
      difficultyLevel: this.resolveDifficultyLevel(item),
      metadata: item ?? {}
    }))
  }

  mapTheData(data: any, apiDetailsKey?: string): CardViewModel[] {
    const mapedData: CardViewModel[] = []
    switch (apiDetailsKey) {
      case 'aparApi':
        const todayDate = dayjs().format('YYYY-MM-DD')
        const filteredData = data.filter((item: any) => item?.isApar === true)
        filteredData.forEach((item: any) => {
          const endDate = dayjs(item.endDate).format('YYYY-MM-DD')
          const daysCount = dayjs(endDate).diff(todayDate, 'day')
          item['planDuration'] = daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
            ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
          item['parentId'] = item.identifier
          item['planType'] = 'cbPlan'
          item['contentStatus'] = 0
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['tags'] as string[]) ?? [], // not found
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: this.resolveProvider(item),
            organisation: this.resolveOrganisation(item),
            creatorLogo: this.resolveCreatorLogo(item),
            sourceName: this.resolveSourceName(item),
            resourceType: this.resolveResourceType(item),
            languageMapV1: this.resolveLanguageMap(item),
            language: this.resolveLanguage(item),
            difficultyLevel: this.resolveDifficultyLevel(item),
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'] as string,
            primaryCategory: item['primaryCategory'] as string,
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      case 'trainingPlanApi':
        const todaysDate = dayjs().format('YYYY-MM-DD')
        data.forEach((item: any) => {
          if (item?.isApar === true || item?.planTypeV2 === 'AICBP') {
            return
          }
          const endDate = dayjs(item.endDate).format('YYYY-MM-DD')
          const daysCount = dayjs(endDate).diff(todaysDate, 'day')
          item['planDuration'] = daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
            ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
          item['parentId'] = item.identifier
          item['planType'] = 'cbPlan'
          item['contentStatus'] = 0
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['tags'] as string[]) ?? [], // not found
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: this.resolveProvider(item),
            organisation: this.resolveOrganisation(item),
            creatorLogo: this.resolveCreatorLogo(item),
            sourceName: this.resolveSourceName(item),
            resourceType: this.resolveResourceType(item),
            languageMapV1: this.resolveLanguageMap(item),
            language: this.resolveLanguage(item),
            difficultyLevel: this.resolveDifficultyLevel(item),
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'],
            primaryCategory: item['primaryCategory'],
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      case 'draftCBPplanApi':
        const draftCBPTodayDate = dayjs().format('YYYY-MM-DD')
        const draftCBPFilteredData = data.filter((item: any) => item?.isApar !== true && (item?.planTypeV2 === 'AICBP'))
        draftCBPFilteredData.forEach((item: any) => {
          const endDate = dayjs(item.endDate).format('YYYY-MM-DD')
          const daysCount = dayjs(endDate).diff(draftCBPTodayDate, 'day')
          item['planDuration'] = daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
            ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
          item['parentId'] = item.identifier
          item['planTypeV2'] = 'AICBP'
          item['contentStatus'] = 0
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['tags'] as string[]) ?? [], // not found
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: this.resolveProvider(item),
            organisation: this.resolveOrganisation(item),
            creatorLogo: this.resolveCreatorLogo(item),
            sourceName: this.resolveSourceName(item),
            resourceType: this.resolveResourceType(item),
            languageMapV1: this.resolveLanguageMap(item),
            language: this.resolveLanguage(item),
            difficultyLevel: this.resolveDifficultyLevel(item),
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'] as string,
            primaryCategory: item['primaryCategory'] as string,
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      case 'trendingOnIGOTApi':
        data.forEach((item: any) => {
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['appIcon'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['additionalTags'] as string[]) ?? [],
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: this.resolveProvider(item, true),
            organisation: this.resolveOrganisation(item),
            creatorLogo: this.resolveCreatorLogo(item),
            sourceName: this.resolveSourceName(item),
            resourceType: this.resolveResourceType(item),
            languageMapV1: this.resolveLanguageMap(item),
            language: this.resolveLanguage(item),
            difficultyLevel: this.resolveDifficultyLevel(item),
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'],
            primaryCategory: item['primaryCategory'],
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      case 'featuredAiCoursesApi':
        data.forEach((item: any) => {
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['tags'] as string[]) ?? [],
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: this.resolveProvider(item),
            organisation: this.resolveOrganisation(item),
            creatorLogo: this.resolveCreatorLogo(item),
            sourceName: this.resolveSourceName(item),
            resourceType: this.resolveResourceType(item),
            languageMapV1: this.resolveLanguageMap(item),
            language: this.resolveLanguage(item),
            difficultyLevel: this.resolveDifficultyLevel(item),
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'],
            primaryCategory: item['primaryCategory'],
            metadata: item ?? {}
          }
          mapedData.push(card)
        })
        break
      default:
        data.forEach((item: any) => {
          const card: CardViewModel = {
            identifier: (item?.['identifier'] as string) ?? '',
            title: (item?.['name'] as string) ?? '',
            image: (item?.['posterImage'] as string) ?? (item?.['posterImage'] as string) ?? '',
            additionalTags: (item?.['tags'] as string[]) ?? [],
            duration: (item?.['duration'] as string) ?? '',
            status: (item?.['status'] as string) ?? '',
            rating: this.resolveRating(item),
            provider: this.resolveProvider(item),
            organisation: this.resolveOrganisation(item),
            creatorLogo: this.resolveCreatorLogo(item),
            sourceName: this.resolveSourceName(item),
            resourceType: this.resolveResourceType(item),
            languageMapV1: this.resolveLanguageMap(item),
            language: this.resolveLanguage(item),
            difficultyLevel: this.resolveDifficultyLevel(item),
            planDuration: item['planDuration'],
            contentStatus: item['contentStatus'],
            courseCategory: item['courseCategory'],
            primaryCategory: item['primaryCategory'],
            metadata: item ?? {}
          }
          mapedData.push(card)
        })

    }
    return mapedData
  }

  processAssessmentCards(response: unknown): CardViewModel[] {
    const data = this.extractResultArray(response)
    return data.map((item: Record<string, unknown>) => ({
      identifier: (item?.['identifier'] as string) ?? '',
      title: (item?.['name'] as string) ?? '',
      image: (item?.['appIcon'] as string) ?? '',
      additionalTags: (item?.['tags'] as string[]) ?? [],
      duration: (item?.['expectedDuration'] as string) ?? '',
      status: (item?.['assessmentStatus'] as string) ?? '',
      rating: this.resolveRating(item),
      provider: this.resolveProvider(item),
      organisation: this.resolveOrganisation(item),
      creatorLogo: this.resolveCreatorLogo(item),
      sourceName: this.resolveSourceName(item),
      resourceType: this.resolveResourceType(item),
      languageMapV1: this.resolveLanguageMap(item),
      language: this.resolveLanguage(item),
      difficultyLevel: this.resolveDifficultyLevel(item),
      planDuration: (item?.['planDuration'] as string) ?? '',
      contentStatus: (item?.['contentStatus'] as number) ?? 0,
      courseCategory: item['courseCategory'] as string,
      primaryCategory: item['primaryCategory'] as string,
      metadata: item ?? {}
    }))
  }

  processProgramCards(response: unknown): CardViewModel[] {
    const data = this.extractResultArray(response)
    return data.map((item: Record<string, unknown>) => ({
      identifier: (item?.['identifier'] as string) ?? '',
      title: (item?.['name'] as string) ?? '',
      image: (item?.['appIcon'] as string) ?? '',
      additionalTags: (item?.['tags'] as string[]) ?? [],
      duration: (item?.['duration'] as string) ?? '',
      status: (item?.['programStatus'] as string) ?? '',
      rating: this.resolveRating(item),
      provider: this.resolveProvider(item),
      organisation: this.resolveOrganisation(item),
      creatorLogo: this.resolveCreatorLogo(item),
      sourceName: this.resolveSourceName(item),
      resourceType: this.resolveResourceType(item),
      languageMapV1: this.resolveLanguageMap(item),
      language: this.resolveLanguage(item),
      difficultyLevel: this.resolveDifficultyLevel(item),
      planDuration: (item?.['planDuration'] as string) ?? '',
      contentStatus: (item?.['contentStatus'] as number) ?? 0,
      courseCategory: item['courseCategory'] as string,
      primaryCategory: item['primaryCategory'] as string,
      metadata: item ?? {}
    }))
  }

  /**
   * Plan-level cards: one card per CBP / APAR / AI-CBP training plan.
   *
   * Fed by the plan-level list (POST /cbplan/v2/search -> result.result.data[]), NOT by the
   * CBPlan V3 dictionary keys the courseCard path uses — those flatten every plan down to one
   * item per content id, so the plan itself (its name, year, content count) is already gone by
   * the time the transformer sees them.
   *
   * The plan list is shared by all three plan pills, so each `apiDetailsKey` narrows it to the
   * plans that pill owns — mirroring the aparApi / trainingPlanApi / draftCBPplanApi split above.
   */
  processPlanCards(response: unknown, apiDetailsKey?: string): PlanCardViewModel[] {
    const data = this.extractResultArray(response)

    return data
      .filter((item) => this.belongsToPlanPill(item, apiDetailsKey))
      .map((item) => this.toPlanCard(item))
  }

  private belongsToPlanPill(item: Record<string, unknown>, apiDetailsKey?: string): boolean {
    const planType = this.resolvePlanType(item)
    switch (apiDetailsKey) {
      case 'aparPlanListApi':
        return planType === 'APAR'
      case 'draftCBPplanListApi':
        return planType === 'AICBP'
      case 'trainingPlanListApi':
        return planType === 'CBP'
      // An unrecognised key must not silently empty the strip — show every plan.
      default:
        return true
    }
  }

  private toPlanCard(item: Record<string, unknown>): PlanCardViewModel {
    const contentList = item?.['contentList']

    return {
      // The plan list sends the plan id as `id`; `identifier` is only present on content.
      identifier: this.firstString([item?.['id'], item?.['identifier']]),
      title: this.firstString([item?.['name'], item?.['planName']]),
      planYear: this.firstString([item?.['planYear']]),
      endDate: this.firstString([item?.['endDate']]),
      contentCount: Array.isArray(contentList) ? contentList.length : 0,
      contentType: this.firstString([item?.['contentType']]),
      // Falls back to the creator's name until the plan list carries an org name — the
      // response only identifies the owning org by id (`orgIdList`).
      createdByName: this.firstString([
        item?.['orgName'],
        item?.['organisationName'],
        this.resolveOrganisation(item)[0],
        item?.['createdByName'],
      ]),
      status: this.firstString([item?.['status']]),
      planType: this.resolvePlanType(item),
      planStatus: this.resolvePlanStatus(item),
      metadata: item ?? {},
    }
  }

  /** APAR wins over AI-CBP, matching the MAX(endDate) tie-break used for content cards. */
  private resolvePlanType(item: Record<string, unknown>): PlanCardViewModel['planType'] {
    if (item?.['isApar'] === true) {
      return 'APAR'
    }
    // `planType` is the plan-level field; `planTypeV2` is the name it carries once flattened
    // onto content, and plan payloads have been seen with either.
    const type = this.firstString([item?.['planType'], item?.['planTypeV2']]).toUpperCase()
    return type === 'AICBP' ? 'AICBP' : 'CBP'
  }

  /**
   * Badge state on the card's media area.
   *
   * The plan list carries no per-user progress, so completion is only claimed when the
   * response actually reports it; otherwise the state is date-derived — past its end date is
   * Overdue, anything else is In Progress.
   */
  private resolvePlanStatus(item: Record<string, unknown>): PlanStatus {
    const progress = Number(item?.['progress'] ?? item?.['completionPercentage'])
    const isCompleted = progress === 100
      || item?.['contentStatus'] === 2
      || this.firstString([item?.['planStatus']]).toLowerCase() === 'completed'
    if (isCompleted) {
      return 'completed'
    }

    const endDate = this.firstString([item?.['endDate']])
    if (endDate && dayjs(dayjs(endDate).format('YYYY-MM-DD')).diff(dayjs().format('YYYY-MM-DD'), 'day') < 0) {
      return 'overdue'
    }
    return 'inProgress'
  }

  private firstString(values: unknown[]): string {
    const match = values.find((value): value is string => typeof value === 'string' && !!value.trim())
    return match ?? ''
  }

  /**
   * Level shown on the card chip. Content publishes it as `difficultyLevel`; `complexityLevel` is
   * the authoring-side name and `knowledgeLevel` the legacy one, so accept whichever is present.
   * Reading only `complexityLevel` left the chip blank on every cbplan / search-backed section.
   */
  private resolveDifficultyLevel(item: Record<string, unknown>): string {
    const level = [
      item?.['difficultyLevel'],
      item?.['complexityLevel'],
      item?.['knowledgeLevel'],
    ].find((value): value is string => typeof value === 'string' && !!value.trim())

    return level ?? ''
  }

  private resolveRating(item: Record<string, unknown>): number {
    const raw = item?.['avgRating'] ?? item?.['averageRating']
    const rating = Number(raw)
    return Number.isFinite(rating) ? rating : 0
  }

  /**
   * Provider org names, e.g. ['Ministry of Coal'] — the card footer renders organisation[0].
   * `organisation` is what search / cbplan / enrolment content carries; the rest are the
   * single-name shapes used by the trending, playlist and external (CIOS) responses.
   */
  private resolveOrganisation(item: Record<string, unknown>): string[] {
    const orgs = item?.['organisation']
    if (Array.isArray(orgs)) {
      const names = orgs.filter((org): org is string => typeof org === 'string' && !!org.trim())
      if (names.length) {
        return names
      }
    } else if (typeof orgs === 'string' && orgs.trim()) {
      return [orgs]
    }

    const partner = item?.['contentPartner'] as Record<string, unknown> | undefined
    const name = [
      item?.['orgName'],
      item?.['orgname'],
      item?.['sourceName'],
      item?.['source'],
      partner?.['contentPartnerName'],
      item?.['channelName'],
    ].find((value): value is string => typeof value === 'string' && !!value.trim())

    return name ? [name] : []
  }

  /** Org logo shown next to the org name. `contentPartner.link` is the external-content variant. */
  private resolveCreatorLogo(item: Record<string, unknown>): string {
    const partner = item?.['contentPartner'] as Record<string, unknown> | undefined
    const logo = [
      item?.['creatorLogo'],
      item?.['orgLogo'],
      item?.['sourceIconUrl'],
      partner?.['link'],
    ].find((value): value is string => typeof value === 'string' && !!value.trim())

    return logo ?? ''
  }

  /** Display provider — the org name wins when the source fields are absent. */
  private resolveProvider(item: Record<string, unknown>, preferSource = false): string {
    const sources = preferSource
      ? [item?.['source'], item?.['sourceName']]
      : [item?.['sourceName'], item?.['source']]
    const source = sources.find((value): value is string => typeof value === 'string' && !!value.trim())
    return source ?? this.resolveOrganisation(item)[0] ?? ''
  }

  private resolveSourceName(item: Record<string, unknown>): string {
    const sourceName = item?.['sourceName']
    return typeof sourceName === 'string' ? sourceName : ''
  }

  private resolveResourceType(item: Record<string, unknown>): string {
    const resourceType = item?.['resourceType']
    return typeof resourceType === 'string' ? resourceType : ''
  }

  /** Per-language translation map ({ hindi: { id, status, isBaseLang } }) — drives the language pill. */
  private resolveLanguageMap(item: Record<string, unknown>): Record<string, any> {
    const map = item?.['languageMapV1']
    return map && typeof map === 'object' && !Array.isArray(map) ? map as Record<string, any> : {}
  }

  /** Fallback for content published before languageMapV1 existed. */
  private resolveLanguage(item: Record<string, unknown>): string[] {
    const language = item?.['language']
    if (Array.isArray(language)) {
      return language.filter((lang): lang is string => typeof lang === 'string' && !!lang.trim())
    }
    return typeof language === 'string' && language.trim() ? [language] : []
  }

  private extractResultArray(response: unknown): Record<string, unknown>[] {
    if (Array.isArray(response)) {
      return response
    }
    const res = response as Record<string, unknown> | null
    if (res?.['result'] && Array.isArray(res['result'])) {
      return res['result'] as Record<string, unknown>[]
    }
    if (res?.['result'] && typeof res['result'] === 'object') {
      const result = res['result'] as Record<string, unknown>
      if (result?.['content'] && Array.isArray(result['content'])) {
        return result['content'] as Record<string, unknown>[]
      }
      if (result?.['data'] && Array.isArray(result['data'])) {
        return result['data'] as Record<string, unknown>[]
      }
      // Plan search (POST /cbplan/v2/search) nests one level deeper:
      // { result: { result: { data: [...], totalCount, facets } } }.
      if (result?.['result'] && typeof result['result'] === 'object') {
        const inner = result['result'] as Record<string, unknown>
        if (Array.isArray(inner?.['data'])) {
          return inner['data'] as Record<string, unknown>[]
        }
        if (Array.isArray(inner?.['content'])) {
          return inner['content'] as Record<string, unknown>[]
        }
      }
    }
    if (res?.['data'] && Array.isArray(res['data'])) {
      return res['data'] as Record<string, unknown>[]
    }
    if (res?.['response'] && typeof res['response'] === 'object') {
      const responseObj = res?.['response'] as Record<string, unknown> | undefined
      if (responseObj?.['courses'] && Array.isArray(responseObj['courses'])) {
        return responseObj['courses'] as Record<string, unknown>[]
      } else if (responseObj?.['under_30_mins'] && Array.isArray(responseObj['under_30_mins'])) {
        return responseObj['under_30_mins'] as Record<string, unknown>[]
      }
    }
    return []
  }
}
