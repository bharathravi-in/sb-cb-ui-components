import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core'
import { DatePipe, LowerCasePipe, NgClass } from '@angular/common'
import { Router } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ConfigurationsService, DomainConfService, EventService, PipePublicURLModule, WsEvents } from '@sunbird-cb/utils-v2'
import { NsContent } from '../../_models/widget-content.model'
import { ContentLanguageService } from '../../_services/content-language.service'
import { CommonMethodsService } from '../../_services/common-methods.service'
import { WidgetContentLibService } from '../../_services/widget-content-lib.service'
import { ContentApiService } from '../strips-v2/services/content-api.service'
import { DefaultThumbnailModule } from '../../_directives/default-thumbnail/default-thumbnail.module'
import { PipeDurationTransformModule } from '../../_pipes/pipe-duration-transform/pipe-duration-transform.module'
import { DisplayContentTypeLibModule } from '../display-content-type-lib/display-content-type-lib.module'
import { VIEWER_ROUTE_FROM_MIME } from '../../_services/viewer-route-util'

@Component({
  selector: 'sb-uic-card-course-v2',
  templateUrl: './card-course-v2.component.html',
  styleUrls: ['./card-course-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    LowerCasePipe,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    DefaultThumbnailModule,
    PipeDurationTransformModule,
    PipePublicURLModule,
    DisplayContentTypeLibModule,
  ],
})
export class CardCourseV2Component {

  // ── Signal inputs ──────────────────────────────────────────────────────────
  content = input<NsContent.IContent | null>(null)
  // A parent binding an as-yet-unloaded value passes `undefined`, which overrides
  // the default, so normalise it here rather than relying on the default alone.
  cbPlanMapData = input<Record<string, any>, Record<string, any> | null | undefined>(
    {}, { transform: (value) => value ?? {} }
  )
  isiGOTSpecialization = input<boolean>(false)
  isLoading = input<boolean>(false)
  isLiveOrMarkForDeletion = input<boolean>(true)
  config = input<any | null>(null)

  // ── Output ─────────────────────────────────────────────────────────────────
  contentData = output<NsContent.IContent>()

  // ── Signal view queries ────────────────────────────────────────────────────
  private readonly titleElRef = viewChild<ElementRef<HTMLElement>>('titleEl')
  private readonly orgElRef = viewChild<ElementRef<HTMLElement>>('orgEl')

  // ── Injected services ──────────────────────────────────────────────────────
  private readonly router = inject(Router)
  private readonly configSvc = inject(ConfigurationsService)
  private readonly events = inject(EventService)
  private readonly contentLangSvc = inject(ContentLanguageService)
  private readonly commonSvc = inject(CommonMethodsService)
  private readonly contSvc = inject(WidgetContentLibService)
  private readonly contentApiService = inject(ContentApiService)
  private readonly domainConfSvc = inject(DomainConfService)

  // ── Internal mutable state ─────────────────────────────────────────────────
  readonly defaultThumbnail = signal('')
  readonly defaultSLogo = signal('')
  readonly isTitleTruncated = signal(false)
  readonly isOrgTruncated = signal(false)
  private readonly caCourseUnitIds = signal<string[]>([])

  // ── Computed values ────────────────────────────────────────────────────────
  readonly languageCount = computed(() => {
    const c = this.content() as any
    if (!c) { return 0 }
    // The language service reads `languageMapV1` / `language`. A strip view model keeps the raw
    // API item on `metadata`, so fall back to it when the wrapper was built without those fields.
    const hasLangData = (source: any) =>
      !!source && (Object.keys(source.languageMapV1 ?? {}).length > 0 || (source.language?.length ?? 0) > 0)
    const source = hasLangData(c) ? c : (c.metadata ?? c)
    return this.contentLangSvc.getAllContentLanguages(source).length
  })

  readonly thumbnailUrl = computed(() => {
    const c = this.content()
    return c?.metadata?.posterImage || c?.metadata?.appIcon || this.defaultThumbnail()
  })

  readonly displayType = computed<NsContent.EDisplayContentTypes>(() =>
    (this.content()?.courseCategory || this.content()?.metadata?.courseCategory || this.content()?.primaryCategory || this.content()?.metadata?.primaryCategory ||
      'Course') as NsContent.EDisplayContentTypes
  )

  readonly ratingValue = computed(() => {
    const c = this.content() as any
    // First rated value wins: a CardViewModel always carries `rating`, defaulted to 0,
    // so unrated placeholders must fall through to the raw item instead of stopping here.
    const rating = [c?.avgRating, c?.rating, c?.metadata?.avgRating, c?.metadata?.averageRating]
      .map(Number)
      .find((value: number) => Number.isFinite(value) && value > 0)
    return rating ? rating.toFixed(1) : ''
  })

  // `organisation` is the platform-wide "Content Provider" field; `provider`/`sourceName` are the
  // single-name shapes. `metadata` holds the raw API item, so it still has the org fields when the
  // view model that wrapped it was built without them.
  readonly orgName = computed(() => {
    const c = this.content() as any
    return this.firstString([
      this.firstOrg(c?.organisation),
      this.firstOrg(c?.metadata?.organisation),
      c?.provider,
      c?.sourceName,
      c?.metadata?.sourceName,
    ]) || 'Karmayogi Bharat'
  })

  readonly orgLogo = computed(() => {
    const c = this.content() as any
    return this.firstString([
      c?.creatorLogo,
      c?.metadata?.creatorLogo,
      c?.metadata?.contentPartner?.link,
      c?.metadata?.sourceIconUrl,
    ])
  })

  readonly difficultyLevel = computed(() => {
    const c = this.content() as any
    return this.firstString([
      c?.difficultyLevel,
      c?.complexityLevel,
      c?.knowledgeLevel,
      c?.metadata?.difficultyLevel,
      c?.metadata?.complexityLevel,
      c?.metadata?.knowledgeLevel,
    ])
  })

  readonly isPopular = computed(() => (this.content()?.additionalTags ?? []).includes('Most popular'))
  readonly isMostEnrolled = computed(() => (this.content()?.additionalTags ?? []).includes('mostEnrolled'))
  readonly isMostTrending = computed(() => (this.content()?.additionalTags ?? []).includes('mostTrending'))

  readonly isIgotSpecialization = computed(() =>
    this.isiGOTSpecialization() &&
    (this.content()?.additionalTags ?? []).includes('iGOT Specialization')
  )

  readonly isApar = computed(() => !!(this.content() as any)?.isApar || (this.content()?.metadata?.isApar as boolean) || false)
  readonly isAiCBP = computed(() => (this.content() as any)?.metadata?.planTypeV2 === 'AICBP')

  readonly isCa = computed(() =>
    this.caCourseUnitIds().includes(this.content()?.identifier ?? '') ||
    !!(this.content() as any)?.isCA
  )

  /** The CB plan entry for this content, if the parent supplied one. */
  private readonly cbPlan = computed<any | null>(() => {
    const id = this.content()?.identifier
    return id ? this.cbPlanMapData()?.[id] ?? null : null
  })

  readonly cbpStatus = computed<'Completed' | 'Overdue' | 'Upcoming' | null>(() => {
    const plan = this.cbPlan()
    console.log('cbpStatus plan', plan)
    if (!plan) { return null }
    if (plan.contentStatus === 2) { return 'Completed' }
    console.log('plan.planDuration', plan.planDuration)
    if (plan.planDuration === 'overdue') { return 'Overdue' }
    if (plan.planDuration === 'upcoming') { return 'Upcoming' }
    return null
  })
  /**
   * Label for the 'Upcoming' state. Like the V1 cards an upcoming plan shows its
   * end date rather than a word, so there is no translation key to resolve.
   */
  readonly cbpEndDate = computed<string | number | null>(() => this.cbPlan()?.endDate ?? null)

  readonly durationSeconds = computed(() =>
    this.content()?.programDuration ? 0 : (this.content()?.duration || 0)
  )

  readonly programDurationDays = computed(() => this.content()?.programDuration || 0)

  constructor() {
    // One-time initialisation from config
    const cfg = this.configSvc.instanceConfig
    if (cfg) {
      this.defaultThumbnail.set(cfg.logos.defaultContent || '')
      this.defaultSLogo.set(cfg.logos.defaultSourceLogo || '')
    } else {
      this.defaultThumbnail.set('/assets/instances/eagle/app_logos/default.png')
      this.defaultSLogo.set('/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg')
    }
    this.caCourseUnitIds.set(JSON.parse(this.commonSvc.getCourseUnitIds() || '[]'))

    // Truncation detection — runs once after the first render pass
    afterNextRender(() => this.checkTruncation())
  }

  // ── Event handlers ─────────────────────────────────────────────────────────
  async onCardClick(): Promise<void> {
    this.emitDetails()
    if (this.content()) {
      if (this.content()?.primaryCategory === NsContent.EPrimaryCategory.RESOURCE && this.content() && this.content()?.mimeType) {
        let url = `app/amrit-gyaan-kosh/player/${VIEWER_ROUTE_FROM_MIME(this.content().mimeType)}/${this.content()?.identifier}`
        let queryParams = {
          primaryCategory: this.content()?.primaryCategory
        }
        this.router.navigate([url], { queryParams })
      } else if (this.content()?.externalId) {
        this.router.navigate(
          [`app/toc/ext/${this.content()?.contentId}`])
      } else {
        let urlData: any = await this.contSvc.getResourseLink(this.content()?.metadata)
        const queryParams = {
          ...urlData.queryParams
        }
        this.router.navigate(
          [urlData.url],
          // { queryParams: urlData.queryParams }
          { queryParams }
        )
      }

    }
  }

  emitDetails(): void {
    if (this.content() && this.config() && this.config()?.cardClickDetails) {
      const cardClickDetails = {
        ...this.config()?.cardClickDetails,
        identifier: this.content()?.identifier,
        primaryCategory: this.content()?.primaryCategory,
      }
      this.contentApiService.publishCardClickDetails(cardClickDetails)
    }
  }

  isCardElementEnabled(key: string): boolean {
    return this.domainConfSvc.isConfigEnabled('components.cards', key)
  }

  // ── Private helpers ────────────────────────────────────────────────────────
  private firstString(values: unknown[]): string {
    const match = values.find((value): value is string => typeof value === 'string' && !!value.trim())
    return match ?? ''
  }

  /** `organisation` is normally an array of names, but some responses send a bare string. */
  private firstOrg(orgs: unknown): string {
    return Array.isArray(orgs) ? this.firstString(orgs) : this.firstString([orgs])
  }

  private checkTruncation(): void {
    const t = this.titleElRef()?.nativeElement
    const o = this.orgElRef()?.nativeElement

    if (t) {
      const clampedHeight = t.clientHeight
      if (clampedHeight > 0) {
        t.style.setProperty('-webkit-line-clamp', 'none')
        t.style.display = 'block'
        const naturalHeight = t.scrollHeight
        t.style.removeProperty('-webkit-line-clamp')
        t.style.display = ''
        this.isTitleTruncated.set(naturalHeight > clampedHeight)
      } else {
        this.isTitleTruncated.set(false)
      }
    }

    this.isOrgTruncated.set(!!o && o.scrollWidth > o.clientWidth)
  }

  private raiseTelemetry(): void {
    const c = this.content()
    this.events.raiseInteractTelemetry(
      { type: WsEvents.EnumInteractTypes.CLICK, subType: 'course-card', id: 'card-content' },
      { id: c?.identifier, type: c?.primaryCategory },
      { module: WsEvents.EnumTelemetrymodules.HOME },
    )
  }

  private navigate(): void {
    const id = this.content()?.identifier
    if (!id) { return }

    if (id.startsWith('ext_')) {
      this.router.navigateByUrl(`/app/toc/ext/${id}`)
      return
    }

    const category = this.content()?.primaryCategory || ''
    if (category === 'Offline Session') {
      this.router.navigate([`/app/event-hub/home/${id}`])
      return
    }

    this.router.navigate(['/app/toc', id, 'overview'])
  }
}
