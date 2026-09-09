import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { NsCardContent } from '../../../_models/card-content.model'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationsService, DomainConfService, EventService } from '@sunbird-cb/utils-v2'
import * as _ from "lodash"
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '../../../_services/multilingual-translations.service'

// Platform-wide enrolment vocabulary, carried on content.completionStatus: 2 is completed, while
// 0 (not started) and 1 (started) both read as in progress.
const COMPLETION_STATUS_COMPLETED = 2

@Component({
    selector: 'sb-uic-card-landscape',
    templateUrl: './card-landscape.component.html',
    styleUrls: ['./card-landscape.component.scss'],
    standalone: false
})
export class CardLandscapeComponent implements OnInit {

  @Input() widgetData!: NsCardContent.ICard
  @Input() isLiveOrMarkForDeletion: any
  @Input() showIntranetContent: any
  @Input() isIntranetAllowedSettings: any
  @Input() isCardLoading: boolean = false
  @Output() contentData = new EventEmitter<any>()
  @Output() triggerTelemetry = new EventEmitter<any>()
  @Input() cbPlanMapData: any
  /**
   * Opt in to the enrolment status pill. Off by default so existing usages are unchanged - any
   * card whose content already carries completionStatus would otherwise start showing one.
   */
  @Input() showEnrolmentStatus: boolean = false
  isCardFlipped: boolean = false
  defaultThumbnail: any
  acbpConstants = NsCardContent.ACBPConst
  sourceLogos: any
  defaultSLogo: any
  showFlip = false
  widgetType: any = 'df'
  widgetSubType: any = 'sdf'
  cbPlanInterval: any

  constructor(
    private snackBar: MatSnackBar,
    private events: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private configSvc: ConfigurationsService,
    private domainConfSvc: DomainConfService,) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  isCardElementEnabled(key: string): boolean {
    return this.domainConfSvc.isConfigEnabled('components.cards', key)
  }

  /**
   * Enrolment status pill, read off content.completionStatus so any caller that already has
   * enrolment data on the content gets it for free.
   *
   * Returns null when the caller has not opted in, when config has switched the element off, or
   * when the content carries no status at all - the last case being content the user is not
   * enrolled in, which must render exactly as before.
   */
  get enrolmentStatusPill(): { label: string, cssClass: string } | null {
    if (!this.showEnrolmentStatus || !this.isCardElementEnabled('enrolmentStatus')) {
      return null
    }
    const status = _.get(this.widgetData, 'content.completionStatus')
    if (status === undefined || status === null || status === '') {
      return null
    }
    return Number(status) === COMPLETION_STATUS_COMPLETED
      ? { label: 'Completed', cssClass: 'enrolment-status-completed' }
      : { label: 'In Progress', cssClass: 'enrolment-status-in-progress' }
  }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
      this.sourceLogos = instanceConfig.sources
      this.defaultSLogo = instanceConfig.logos.defaultSourceLogo || ''
    } else {
      this.defaultThumbnail = '/assets/instances/eagle/app_logos/default.png'
      this.defaultSLogo = '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
    }
    this.defaultSLogo = this.widgetData?.content?.contentPartner?.contentPartnerName ? '/assets/icons/content/provider.svg' : this.defaultSLogo

  }

  showSnackbar() {
    if (this.showIntranetContent) {
      this.snackBar.open('Content is only available in intranet', 'X', { duration: 2000 })
    } else if (!this.isLiveOrMarkForDeletion) {
      this.snackBar.open('Content may be expired or deleted', 'X', { duration: 2000 })
    }
  }
  getRedirectUrlData(contentData: any) {
    this.contentData.emit(contentData)
  }
  raiseTelemetry(content: any) {
    this.triggerTelemetry.emit(content)
  }


  /**
   * cbPlanMapData is an @Input here — the parent strip supplies it, so this component
   * never needed its own copy (the assignment has long been commented out). It used to
   * poll localStorage['cbpData'] every second purely to clear that timer; CBP plan data
   * now lives in IndexedDB, so the polling is gone.
   */
  getCbPlanData() {
    if (this.cbPlanInterval) {
      clearInterval(this.cbPlanInterval)
      this.cbPlanInterval = null
    }
  }

  getProviderNames(providers: any[]): string {
    if (!providers || !providers.length) {
      return ''
    }
    return providers.map(p => p?.name).join(', ')
  }

}
