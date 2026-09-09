import { Inject, Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError, of, from } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { IUserGroupDetails } from '../_models/widget-user.model'
import { NsContent } from '../_models/widget-content.model'
import dayjs from 'dayjs'
// const dayjs = dayjs_
// import { environment } from 'src/environments/environment'
import { NsCardContent } from '../_models/card-content-v2.model'
import * as lodash from 'lodash'
import { WidgetEnrollService, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { ContentDictionaryService } from './content-dictionary.service'
import { CbpPlanCacheService } from './cbp-plan-cache.service'


const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  FETCH_EXTERNAL_ENROLLMENT_LIST: 'apis/proxies/v8/cios-enroll/v1/courselist/byuserid',
  FETCH_EVENTS_ENROLLMENT_LIST: (userId: string) => `apis/proxies/v8/user/events/list/${userId}`,
  FETCH_USER_GROUPS: (userId: string) =>
    `${PROTECTED_SLAG_V8}/user/group/fetchUserGroup?userId=${userId}`,
  FETCH_CBP_PLAN_USER_DICTIONARY: `/apis/proxies/v8/cbplan/v3/user/dictionary`,
  FETCH_USER_ENROLLMENT_LIST: (userId: string | undefined, competencyKey: string) =>
    // tslint:disable-next-line: max-line-length
    `/apis/proxies/v8/learner/course/v2/user/enrollment/list/${userId}?orgdetails=orgName,email&licenseDetails=name,description,url&fields=contentType,primaryCategory,courseCategory,topic,name,channel,mimeType,appIcon,gradeLevel,resourceType,identifier,medium,pkgVersion,board,subject,trackable,posterImage,duration,creatorLogo,license,version,versionKey,avgRating,additionalTags,${competencyKey}&batchDetails=name,endDate,startDate,status,enrollmentType,createdBy,certificates,batchAttributes`,
  FETCH_USER_ENROLLMENT_LIST_PROFILE: (userId: string | undefined, competencyKey: string) =>
    // tslint:disable-next-line: max-line-length
    `/apis/proxies/v8/learner/course/v2/user/enrollment/list/${userId}?orgdetails=orgName,email&licenseDetails=name,description,url&fields=contentType,primaryCategory,courseCategory,topic,name,channel,mimeType,appIcon,gradeLevel,resourceType,identifier,medium,pkgVersion,board,subject,trackable,posterImage,duration,creatorLogo,license,version,versionKey,avgRating,additionalTags,${competencyKey}&batchDetails=name,endDate,startDate,status,enrollmentType,createdBy,certificates,batchAttributes&retiredCoursesEnabled=true`,
  // tslint:disable-next-line: max-line-length
  FETCH_USER_ENROLLMENT_LIST_V2: (userId: string | undefined, orgdetails: string, licenseDetails: string, fields: string, batchDetails: string, competencyKey: string) =>
    // tslint:disable-next-line: max-line-length
    `apis/proxies/v8/learner/course/v2/user/enrollment/list/${userId}?orgdetails=${orgdetails}&licenseDetails=${licenseDetails}&fields=${fields},courseCategory,${competencyKey}&batchDetails=${batchDetails}`,
  FETCH_DESIGNATION_COURSES: `/apis/proxies/v8/courseRecommend/v1/courses`,
  GET_RECOMMENDED_COURSES_WITH_FEEDBACK: (userId: string) => `/apis/proxies/v8/courseRecommendation/read/${userId}`,
  ORG_READ: '/api/org/v1/read',
}

@Injectable({
  providedIn: 'root',
})
export class WidgetUserServiceLib {
  environment: any
  enrollmentDataIds: any = []
  constructor(
    @Inject('environment') environment: any,
    private enrollSvc: WidgetEnrollService,
    private configSvc: ConfigurationsService,
    private contentDictSvc: ContentDictionaryService,
    private cbpCacheSvc: CbpPlanCacheService,
    private http: HttpClient) {
    this.environment = environment
  }

  handleError(error: ErrorEvent) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    }
    return throwError(errorMessage)
  }

  handleError1(error: ErrorEvent) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    }
    return throwError('')
  }

  fetchUserGroupDetails(userId: string): Observable<IUserGroupDetails[]> {
    return this.http
      .get<IUserGroupDetails[]>(API_END_POINTS.FETCH_USER_GROUPS(userId))
      .pipe(catchError(this.handleError))
  }
  // tslint:disable-next-line: max-line-length
  fetchUserBatchList(userId: string | undefined, queryParams?: { orgdetails: any, licenseDetails: any, fields: any, batchDetails: any }): Observable<NsContent.ICourse[]> {
    let path = ''
    if (queryParams) {
      // tslint:disable-next-line: max-line-length
      path = API_END_POINTS.FETCH_USER_ENROLLMENT_LIST_V2(userId, queryParams.orgdetails, queryParams.licenseDetails, queryParams.fields, queryParams.batchDetails, this.environment.compentencyVersionKey)
    } else {
      path = API_END_POINTS.FETCH_USER_ENROLLMENT_LIST(userId, this.environment.compentencyVersionKey)
    }
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    })
    const result: any = this.http.get(path, { headers }).pipe(catchError(this.handleError), map(
      (data: any) => {
        const coursesData: any = []
        if (data && data.result && data.result.courses) {
          data.result.courses.forEach((content: any) => {
            if (content.contentStatus) {
              delete content.contentStatus
            }
            this.enrollmentDataIds.push(content.contentId)
            coursesData.push(content)
          })
          // this.storeUserEnrollmentInfo(data.result.userCourseEnrolmentInfo,
          //                              data.result.courses.length)
          data.result.courses = coursesData
        }
        return data.result
      }
    )
    )
    return result
  }

  // tslint:disable-next-line: max-line-length
  fetchProfileUserBatchList(userId: string | undefined, queryParams?: { orgdetails: any, licenseDetails: any, fields: any, batchDetails: any }): Observable<NsContent.ICourse[]> {
    let path = ''
    if (queryParams) {
      // tslint:disable-next-line: max-line-length
      path = API_END_POINTS.FETCH_USER_ENROLLMENT_LIST_V2(userId, queryParams.orgdetails, queryParams.licenseDetails, queryParams.fields, queryParams.batchDetails, this.environment.compentencyVersionKey)
    } else {
      path = API_END_POINTS.FETCH_USER_ENROLLMENT_LIST_PROFILE(userId, this.environment.compentencyVersionKey)
    }
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    })
    return this.http
      .get(path, { headers })
      .pipe(
        catchError(this.handleError),
        map(
          (data: any) => data.result
        )
      )
  }

  checkStorageData(key: any, dataKey: any) {
    const checkTime = localStorage.getItem('timeCheck')
    if (checkTime) {
      const parsedData = JSON.parse(checkTime)
      if (parsedData[key]) {
        const date = dayjs()
        const diffMin = date.diff(parsedData[key], 'minute')
        const timeCheck = this.environment.apiCache || 0
        if (diffMin >= timeCheck) {
          return true
        }
        return localStorage.getItem(dataKey) ? false : true
      }
      return true
    }
    return true
  }

  getData(key: any): Observable<any> {
    return of(JSON.parse(localStorage.getItem(key) || '{}'))
  }

  /**
   * CBP plan data for a plan year, read from IndexedDB (iGotCbpDB/cbpPlans).
   *
   * Previously read localStorage['cbpData'], which no longer holds CBP plan data.
   * The legacy 'cbpData' argument is tolerated and treated as "current plan year"
   * so existing callers keep working.
   */
  getCBPData(planYear?: string): Observable<any[]> {
    const year = (!planYear || planYear === 'cbpData')
      ? this.cbpCacheSvc.getCurrentFinancialYear()
      : planYear
    return from(
      this.cbpCacheSvc.getEntry(year).then((entry: any) => (entry && entry.data) || [])
    )
  }
  getSavedData(key: any): Observable<any> {
    return JSON.parse(localStorage.getItem(key) || '')
  }

  setTime(key: any) {
    const checkTime = localStorage.getItem('timeCheck')
    if (checkTime) {
      const parsedData = JSON.parse(checkTime)
      parsedData[key] = new Date().getTime()
      localStorage.setItem('timeCheck', JSON.stringify(parsedData))
    } else {
      const data: any = {}
      data[key] = new Date().getTime()
      localStorage.setItem('timeCheck', JSON.stringify(data))
    }
  }

  resetTime(key: any) {
    const checkTime = localStorage.getItem('timeCheck')
    if (checkTime) {
      const parsedData = JSON.parse(checkTime)
      if (parsedData[key]) {
        delete parsedData[key]
        localStorage.setItem('timeCheck', JSON.stringify(parsedData))
      }
    }
  }

  /**
   * @deprecated CBP retrieval moved to CBPlan V3. Kept only so existing callers keep
   * compiling; it now delegates to fetchCbpPlanListV3 and never issues the old
   * GET /apis/proxies/v8/user/v1/cbplan request. Call fetchCbpPlanListV3(planYear) directly
   * so the selected plan year is honoured — this shim always resolves the current one.
   */
  fetchCbpPlanList(_userId?: string, _callApi?: boolean): Observable<any[]> {
    return this.fetchCbpPlanListV3()
  }

  // ── CBPlan V3 ────────────────────────────────────────────────────────────────

  /**
   * Year-scoped CBP/CVP plan list backed by POST /apis/proxies/v8/cbplan/v3/user/dictionary.
   *
   * Replaces the V1 GET flow for the CBP strips. V3 returns only content ids + plan
   * associations, so metadata comes from the content dictionary and enrolment status
   * still comes from the existing enrolment API.
   *
   * @param planYear financial year as YYYY-YY; defaults to the current one
   * @param forceRefresh bypass the IndexedDB cache
   */
  fetchCbpPlanListV3(planYear?: string, forceRefresh = false): Observable<any[]> {
    return from(this.fetchCbpPlanListV3Async(planYear, forceRefresh))
  }

  /** Current financial year (April -> March) as YYYY-YY, e.g. '2026-27'. */
  getCurrentFinancialYear(): string {
    return this.cbpCacheSvc.getCurrentFinancialYear()
  }

  /** Clears the cached CBP data for one plan year, or all years when omitted. */
  clearCbpPlanCache(planYear?: string): Promise<void> {
    return this.cbpCacheSvc.clear(planYear)
  }

  private async fetchCbpPlanListV3Async(planYear?: string, forceRefresh = false): Promise<any[]> {
    const year = planYear || this.cbpCacheSvc.getCurrentFinancialYear()
    const cached = await this.cbpCacheSvc.getEntry(year)

    if (!forceRefresh && cached && this.cbpCacheSvc.isEntryValid(cached)) {
      return cached.data
    }

    try {
      const payload = {
        request: {
          planYear: year,
          enrichment: true,
        },
      }

      const res: any = await this.http.post(
        API_END_POINTS.FETCH_CBP_PLAN_USER_DICTIONARY,
        payload,
        { withCredentials: true },
      ).toPromise()

      const associations = this.resolveCbpAssociations(res && res.result)
      const enriched = await this.enrichCbpWithDictionary(associations)
      const enrollmentData = await this.fetchCbpEnrollmentData(enriched.map((c: any) => c.identifier))

      const mapped: any = await this.mapCbpData(enriched, enrollmentData, true)
      const reduced = this.toReducedCbpData(mapped)

      // An empty list is deliberately not cached. A proxy rejection (the API whitelist
      // 403, an expired session) can come back as a 200 with no `result`, and caching
      // that would stop the request being made at all until the TTL expires.
      if (reduced.length) {
        await this.cbpCacheSvc.setEntry(year, reduced)
      }
      return reduced
    } catch (err) {
      // Fall back to a stale cache rather than emptying a working strip.
      if (cached && cached.data) {
        console.warn('CBP V3 fetch failed, serving stale cache for', year, err)
        return cached.data
      }
      console.warn('CBP V3 fetch failed and no cache is available for', year, err)
      return []
    }
  }

  /**
   * Flattens a CBP plan response into one association per content id.
   *
   * Handles both response shapes the endpoint returns:
   *  - result.content[]      — plan-centric: { id, endDate, isApar, contentList[] }
   *  - result.aparContentList / result.nonAparContentList
   *                          — content-centric maps of contentId -> [{ endDate, planId }]
   *
   * Either way the same rule applies: when a content id appears in several plans the one
   * with MAX(endDate) wins, APAR breaking a tie, so the UI never renders the same course
   * twice.
   */
  resolveCbpAssociations(result: any): any[] {
    const byContentId = new Map<string, any>()

    const collect = (contentList: any, isApar: boolean) => {
      if (!contentList) {
        return
      }
      Object.keys(contentList).forEach((contentId: string) => {
        const associations = contentList[contentId]
        if (!Array.isArray(associations) || !associations.length) {
          return
        }

        let latest: any = null
        let latestTime = Number.NEGATIVE_INFINITY
        associations.forEach((association: any) => {
          if (!association) {
            return
          }
          const time = new Date(association.endDate).getTime()
          if (isNaN(time)) {
            return
          }
          if (time > latestTime) {
            latestTime = time
            latest = association
          }
        })
        if (!latest) {
          return
        }

        const existing = byContentId.get(contentId)
        if (existing) {
          const existingTime = new Date(existing.endDate).getTime()
          const keepExisting = existingTime > latestTime
            || (existingTime === latestTime && existing.isApar)
          if (keepExisting) {
            return
          }
        }

        byContentId.set(contentId, {
          identifier: contentId,
          contentId,
          planId: latest.planId,
          parentId: latest.planId,
          endDate: latest.endDate,
          isApar,
          planType: 'cbPlan',
          contentStatus: 0,
          planDuration: this.getPlanDuration(latest.endDate),
        })
      })
    }

    /**
     * Plan-centric variant: result.content[] of { id, endDate, isApar, contentList[] },
     * where contentList holds whole content objects rather than id -> association maps.
     *
     * Collapsed on the SAME rule as the map form — one card per content id, the plan with
     * MAX(endDate) winning and APAR breaking a tie — so a course sitting in several plans
     * is never rendered twice. Plan fields are applied OVER the content metadata so the
     * plan's endDate always wins.
     */
    const collectPlans = (plans: any[]) => {
      plans.forEach((plan: any) => {
        if (!plan || !Array.isArray(plan.contentList) || !plan.contentList.length) {
          return
        }
        const planTime = new Date(plan.endDate).getTime()
        if (isNaN(planTime)) {
          return
        }
        const isApar = !!plan.isApar

        plan.contentList.forEach((content: any) => {
          const contentId = content && content.identifier
          if (!contentId) {
            return
          }

          const existing = byContentId.get(contentId)
          if (existing) {
            const existingTime = new Date(existing.endDate).getTime()
            const keepExisting = existingTime > planTime
              || (existingTime === planTime && existing.isApar)
            if (keepExisting) {
              return
            }
          }

          byContentId.set(contentId, {
            ...content,
            identifier: contentId,
            contentId,
            planId: plan.id,
            parentId: plan.id,
            endDate: plan.endDate,
            isApar,
            planType: 'cbPlan',
            contentStatus: 0,
            planDuration: this.getPlanDuration(plan.endDate),
          })
        })
      })
    }

    if (result && Array.isArray(result.content)) {
      collectPlans(result.content)
    } else {
      collect(result && result.aparContentList, true)
      collect(result && result.nonAparContentList, false)
    }

    return Array.from(byContentId.values())
  }

  /** Same overdue/upcoming/success bucketing the V1 flow applied. */
  private getPlanDuration(endDate: string): string {
    const todayDate = dayjs().format('YYYY-MM-DD')
    const daysCount = dayjs(dayjs(endDate).format('YYYY-MM-DD')).diff(todayDate, 'day')
    return daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
      ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
  }

  /**
   * Adds content metadata to each plan association.
   * Dictionary values are merged UNDER the CBP fields so plan data always wins.
   */
  private async enrichCbpWithDictionary(associations: any[]): Promise<any[]> {
    if (!associations || !associations.length) {
      return []
    }
    const identifiers = associations.map((c: any) => c.identifier)
    let dictionary: Record<string, any> = {}
    try {
      dictionary = (await this.contentDictSvc.getContents(identifiers).toPromise()) || {}
    } catch (err) {
      console.warn('CBP V3: content dictionary enrichment failed', err)
    }

    return associations.map((association: any) => {
      const metadata = dictionary[association.identifier]
      return metadata ? { ...metadata, ...association } : association
    })
  }

  private async fetchCbpEnrollmentData(contentIds: string[]): Promise<any> {
    if (!contentIds || !contentIds.length) {
      return {}
    }
    const request = { request: { courseId: contentIds } }
    return this.enrollSvc.fetchEnrollContentData(request).toPromise().then((res: any) => {
      const enrollData: any = {}
      if (res && res.result && res.result.courses && res.result.courses.length) {
        res.result.courses.forEach((course: any) => {
          enrollData[course.collectionId] = course
        })
      }
      return enrollData
    }).catch((_err: any) => {
      return {}
    })
  }

  // storeUserEnrollmentInfo(enrollmentData: any, enrolledCourseCount: number) {
  //   const userData = {
  //     enrolledCourseCount,
  //     userCourseEnrolmentInfo: enrollmentData,
  //   }
  //   localStorage.removeItem('userEnrollmentCount')
  //   localStorage.setItem('userEnrollmentCount', JSON.stringify(userData))
  // }


  fetchEnrollmentDataByContentId(userId, contentdata) {
    let path = API_END_POINTS.FETCH_USER_ENROLLMENT_LIST(userId, this.environment.compentencyVersionKey)
    path = `${path}&courseIds=${contentdata}&cache=true'`
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      Pragma: 'no-cache',
      Expires: '0',
    })
    return this.http
      .get(path, { headers })
      .pipe(
        catchError(this.handleError),
        map(
          (data: any) => data.result
        )
      )
  }

  getCbpFormatedData(cbpContent: any) {
    let cbpContentData = []
    let contentIds = []
    const todayDate = dayjs().format('YYYY-MM-DD')
    cbpContent.forEach((c: any) => {
      c.contentList.forEach((childData: any) => {
        const endDate = dayjs(c.endDate).format('YYYY-MM-DD')
        const daysCount = dayjs(endDate).diff(todayDate, 'day')
        childData['planDuration'] = daysCount < 0 ? NsCardContent.ACBPConst.OVERDUE : daysCount > 29
          ? NsCardContent.ACBPConst.SUCCESS : NsCardContent.ACBPConst.UPCOMING
        childData['endDate'] = c.endDate
        childData['parentId'] = c.id
        childData['planType'] = 'cbPlan'
        childData['planTypeV2'] = c['planType'] || ''
        childData['contentStatus'] = 0
        childData['isApar'] = c.isApar
        childData['sourceName'] = c.organisation ? c.organisation[0] : ''
        contentIds.push(childData.identifier)
        if (childData.status !== NsCardContent.IGOTConst.RETIRED) {
          cbpContentData.push(childData)
        }
      })
    })
    return { cbpContentData, contentIds }
  }
  async mapCbpData(cbpContent: any, enrollmentData: any, fullMeta: boolean = false) {
    let cbpFilteredContent: any = []
    if (cbpContent && cbpContent.length) {
      if (Object.keys(enrollmentData).length) {
        cbpContent.forEach((cbp: any) => {
          const childEnrollData = enrollmentData[cbp.identifier]

          const competencyArea: any = []
          const competencyTheme: any = []
          const competencyThemeType: any = []
          const competencySubTheme: any = []
          const competencyAreaId: any = []
          const competencyThemeId: any = []
          const competencySubThemeId: any = []
          cbp['contentStatus'] = 0
          if (childEnrollData) {
            cbp['contentStatus'] = childEnrollData.status
          }
          if (cbp[this.environment.compentencyVersionKey] && cbp[this.environment.compentencyVersionKey].length) {
            cbp[this.environment.compentencyVersionKey].forEach((element: any) => {
              if (!competencyArea.includes(element.competencyArea)) {
                competencyArea.push(element.competencyArea)
                competencyAreaId.push(element.competencyAreaId)
              }
              if (!competencyTheme.includes(element.competencyTheme)) {
                competencyTheme.push(element.competencyTheme)
                competencyThemeId.push(element.competencyThemeId)
              }
              if (!competencyThemeType.includes(element.competencyThemeType)) {
                competencyThemeType.push(element.competencyThemeType)
              }
              if (!competencySubTheme.includes(element.competencySubTheme)) {
                competencySubTheme.push(element.competencySubTheme)
                competencySubThemeId.push(element.competencySubThemeId)
              }
            })
          }

          cbp['competencyArea'] = competencyArea
          cbp['competencyTheme'] = competencyTheme
          cbp['competencyThemeType'] = competencyThemeType
          cbp['competencySubTheme'] = competencySubTheme
          cbp['competencyAreaId'] = competencyAreaId
          cbp['competencyThemeId'] = competencyThemeId
          cbp['competencySubThemeId'] = competencySubThemeId
          if (cbp.status !== NsCardContent.IGOTConst.RETIRED) {
            cbpFilteredContent.push(cbp)
          } else {
            if (childEnrollData && childEnrollData.status === 2) {
              cbpFilteredContent.push(cbp)
            }
          }
        })
        if (cbpFilteredContent.length > 1) {
          const sortedData: any = cbpFilteredContent.sort((a: any, b: any) => {
            const firstDate: any = new Date(a.endDate)
            const secondDate: any = new Date(b.endDate)

            return secondDate > firstDate ? 1 : -1
          })
          const uniqueUsersByID = lodash.uniqBy(sortedData, 'identifier')
          const sortedByEndDate = lodash.orderBy(uniqueUsersByID, ['endDate'], ['asc'])
          const sortedByStatus = lodash.orderBy(sortedByEndDate, ['contentStatus'], ['asc'])
          if (fullMeta) {
            return sortedByStatus
          }
          let cbpContentSorted = this.requiredCBPData(sortedByStatus)
          return cbpContentSorted
        }
        if (fullMeta) {
          return cbpFilteredContent
        }
        let cbpContentFiltered = this.requiredCBPData(cbpFilteredContent)
        return cbpContentFiltered
      }
      if (fullMeta) {
        return cbpContent
      }
      let cbpContentAll = this.requiredCBPData(cbpContent)
      return cbpContentAll
    }
    if (fullMeta) {
      return []
    }
    let cbpContentEmpty = this.requiredCBPData([])
    return cbpContentEmpty
  }

  /**
   * CBP plan data is no longer mirrored to localStorage['cbpData'] — IndexedDB
   * (CbpPlanCacheService, iGotCbpDB/cbpPlans) is the only CBP cache.
   */
  requiredCBPData(cbpData: any) {
    return this.toReducedCbpData(cbpData)
  }

  /** Reduces CBP items to the fields the cards and tab logic need. Pure — no persistence. */
  toReducedCbpData(cbpData: any) {
    const requiredCbpData: any[] = []
    if (cbpData?.length) {
      cbpData.forEach((cbp: any) => {
        const cbpObj: any = {}
        // Always include identifier
        cbpObj.identifier = cbp.identifier
        // Common display fields
        if (cbp.name) {
          cbpObj.name = cbp.name
        }
        // normalize download URL (handle both downloadUrl and downloaUrl)
        const download = cbp.downloaUrl || cbp.downloadUrl || (cbp.variants && cbp.variants.spine && cbp.variants.spine.ecarUrl) || (cbp.variants && cbp.variants.online && cbp.variants.online.ecarUrl)
        if (download) {
          cbpObj.downloaUrl = download
        }
        // scheduling / plan fields + the provider fields cards need for the org name and logo
        // + the multilingual fields the "available in N languages" pill is derived from
        // parentId/planId identify the plan a card belongs to — both parsers set them
        // (getCbpFormatedData from `content[].id`, resolveCbpAssociations from the
        // association's planId), so the cards can attribute a due date to its plan.
        ;['endDate', 'planDuration', 'appIcon', 'difficultyLevel', 'avgRating', 'posterImage', 'duration', 'primaryCategory', 'courseCategory', 'planType', 'planTypeV2', 'contentStatus', 'status', 'isApar', 'organisation', 'creatorLogo', 'sourceName', 'resourceType', 'languageMapV1', 'language', 'parentId', 'planId'].forEach((k: string) => {
          if (cbp[k] !== undefined) {
            cbpObj[k] = cbp[k]
          }
        })
        // competency related fields (already computed in mapCbpData)
        // ;['competencies_v5', 'competencyArea', 'competencyTheme', 'competencyThemeType', 'competencySubTheme', 'competencyAreaId', 'competencyThemeId', 'competencySubThemeId'].forEach((k: string) => {
        //   if (cbp[k] !== undefined) {
        //     cbpObj[k] = cbp[k]
        //   }
        // })
        requiredCbpData.push(cbpObj)
      })
    }
    return requiredCbpData
  }
  mapEnrollmentData(courseData: any) {
    const enrollData: any = {}
    if (courseData && courseData.courses.length) {
      courseData.courses.forEach((data: any) => {
        enrollData[data.collectionId] = data
      })
    }
    return enrollData
  }

  fetchExtEnrollData() {
    const cfg = this.configSvc.globalConfig?.apis?.user?.externalEnrollment
    // explicitly disabled via global-config => skip the call (absent entry stays backward-compatible)
    if (cfg && !cfg.enabled) {
      return of(null)
    }
    const extUrl = (cfg?.enabled && cfg?.url) ? cfg.url : API_END_POINTS.FETCH_EXTERNAL_ENROLLMENT_LIST
    return this.http.get(extUrl).pipe(map((extRes: any) => {
      if (extRes && extRes.result && extRes.result.courses) {
        extRes.result.courses.forEach((ele: any) => {
          ele['completionPercentage'] = ele['completionpercentage']
          // ele['content']['appIcon'] = ele['completionpercentage']
          ele['lastContentAccessTime'] = ele.content && ele.content.lastUpdatedOn ? new Date(ele.content.lastUpdatedOn).getTime() : ''
          if (ele.content) {
            ele['content']['organisation'] = ele.content && ele.content.contentPartner && ele.content.contentPartner.contentPartnerName ? [ele.content.contentPartner.contentPartnerName] : []
            ele['content']['completionStatus'] = ele['completionpercentage'] < 100 ? 1 : 2
            ele['content']['creatorLogo'] = ele['content']['contentPartner']['link']

          }
        })
      }
      return extRes
    }))
  }

  fetchEventEnrollData(userId: any) {
    return this.http.get(API_END_POINTS.FETCH_EVENTS_ENROLLMENT_LIST(userId)).pipe(map((eventRes: any) => {
      if (eventRes && eventRes.result && eventRes.result.events) {
        eventRes.result.events.forEach((ele: any) => {
          ele['event']['eventId'] = ele.contentId
          ele['completionPercentage'] = ele['completionpercentage'] > 50 ? 100 : ele['completionpercentage']
        })
      }
      return eventRes
    }))
  }
  fetchDesignationsData() {
    const result: any = this.http.get(API_END_POINTS.FETCH_DESIGNATION_COURSES).pipe(catchError(this.handleError1), map(
      async (data: any) => {
        if (data.result && data.result.courseList) {
          return data.result.courseList
        }
        return ''
      })
    )
    return result
  }
  generateCoursesSakshamAI(apiEndpoint: string, requestBody: any) {
    const result: any = this.http.post(apiEndpoint, requestBody).pipe(catchError(this.handleError1), map(
      async (data: any) => {
        return data
      })
    )
    return result
  }

  getRecommendedCoursesSakshamAI(userId: string) {
    const result: any = this.http.get(API_END_POINTS.GET_RECOMMENDED_COURSES_WITH_FEEDBACK(userId)).pipe(catchError(this.handleError1), map(
      async (data: any) => {
        return data
      })
    )
    return result
  }

  getOrgReadData(organisationId: string): Observable<any> {
    const request = {
      request: {
        organisationId,
      },
    }
    return this.http.post<any>(API_END_POINTS.ORG_READ, request).pipe(
      map((res: any) => {
        return lodash.get(res, 'result.response')
      })
    )
  }

}
