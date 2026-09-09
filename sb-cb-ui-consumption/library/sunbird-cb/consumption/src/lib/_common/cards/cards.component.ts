import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver-v2'
import { NsCardContent } from '../../_models/card-content.model'
import { NsContent, UtilityService } from '@sunbird-cb/utils-v2'
import { WidgetContentLibService } from '../../_services/widget-content-lib.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { VIEWER_ROUTE_FROM_MIME } from '../../_services/viewer-route-util'
import { CbpPlanCacheService } from '../../_services/cbp-plan-cache.service'

@Component({
    selector: 'sb-uic-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss'],
    standalone: false
})
export class CardsComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<NsCardContent.ICard> {

  @Input() widgetData!: NsCardContent.ICard
  @Output() triggerTelemetry = new EventEmitter<any>()
  isIntranetAllowedSettings = false
  cbPlanMapData: any
  cbPlanSubscription: Subscription | null = null
  constructor(private utilitySvc: UtilityService,
    private contSvc: WidgetContentLibService,
    private cbpCacheSvc: CbpPlanCacheService,
    public router: Router
  ) {
    super()
  }

  ngOnInit() {
    // Was a 1s setInterval polling localStorage['cbpData']. CBP plan data now lives in
    // IndexedDB and the cache pushes an update when it is written, so no polling.
    this.cbPlanSubscription = this.cbpCacheSvc.watchPlanMap()
      .subscribe((planMap: Record<string, any>) => this.cbPlanMapData = planMap)
  }

  ngOnDestroy() {
    if (this.cbPlanSubscription) {
      this.cbPlanSubscription.unsubscribe()
    }
  }

  get isLiveOrMarkForDeletion() {
    if (
      !this.widgetData.content.status ||
      this.widgetData.content.status === 'Live' ||
      this.widgetData.content.status === 'MarkedForDeletion'
    ) {
      return true
    }
    return false
  }

  get showIntranetContent() {
    if (this.widgetData.content.isInIntranet && this.utilitySvc.isMobile) {
      return !this.isIntranetAllowedSettings
    }
    return false
  }
  async getRedirectUrlData(content: any) {
    if (content?.primaryCategory === NsContent.EPrimaryCategory.RESOURCE) {
      let url = `app/amrit-gyaan-kosh/player/${VIEWER_ROUTE_FROM_MIME(content?.mimeType)}/${content?.identifier}`
      let queryParams = {
        primaryCategory: content?.primaryCategory
      }
      this.router.navigate([url], { queryParams })
    } else if (content.externalId) {
      this.router.navigate(
        [`app/toc/ext/${content.contentId}`])
    } else {
      let urlData = await this.contSvc.getResourseLink(content)
      const queryParams = {
        ...urlData.queryParams,
        ...(this.widgetData?.sakshamAIGenerated ? { recommendationId: this.widgetData?.sakshamAIGenerated } : {})
      }
      this.router.navigate(
        [urlData.url],
        // { queryParams: urlData.queryParams }
        { queryParams }
      )
    }

  }
  /** @deprecated CBP plan data now arrives via CbpPlanCacheService.watchPlanMap(). */
  getCbPlanData() {
    this.cbpCacheSvc.getPlanMap().then((planMap: Record<string, any>) => {
      this.cbPlanMapData = planMap
    })
  }



  raiseCardClick(data: any) {
    this.triggerTelemetry.emit(data)
  }

  redirectToNewVersion(identifier: any) {
    this.router.navigate(['app/toc', identifier, 'overview'])
  }
}
