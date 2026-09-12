import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { PlanCardViewModel } from '../strips-v2/models/card.model'
import { ContentApiService } from '../strips-v2/services/content-api.service'

/**
 * Card for a single CBP / APAR / AI-CBP training plan (CardType.PlanCard).
 *
 * A plan is not content, so this is a sibling of CardCourseV2Component rather than a mode of
 * it: there is no thumbnail to show (the media area is drawn from the theme's primary and
 * secondary colours), no rating, no duration and no provider org. What a plan does have —
 * year, due date, how many contents it holds, who created it — is what the card leads with.
 */
@Component({
  selector: 'sb-uic-card-plan-v2',
  templateUrl: './card-plan-v2.component.html',
  styleUrls: ['./card-plan-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DatePipe, MatIconModule, MatTooltipModule, TranslateModule],
})
export class CardPlanV2Component {

  // ── Signal inputs ──────────────────────────────────────────────────────────
  plan = input<PlanCardViewModel | null>(null)
  isLoading = input<boolean>(false)
  /**
   * 'portrait' is the 254px grid/carousel card; 'landscape' is the full-width row the
   * mobile listing uses. Same data either way — only the composition differs: landscape
   * moves the status out of the media area and into the footer beside the owner.
   */
  layout = input<'portrait' | 'landscape'>('portrait')
  /** The pill's contentConfig — read for `cardClickDetails` only. */
  config = input<any | null>(null)

  // ── Signal view queries ────────────────────────────────────────────────────
  private readonly titleElRef = viewChild<ElementRef<HTMLElement>>('titleEl')
  private readonly ownerElRef = viewChild<ElementRef<HTMLElement>>('ownerEl')

  // ── Injected services ──────────────────────────────────────────────────────
  private readonly router = inject(Router)
  private readonly configSvc = inject(ConfigurationsService)
  private readonly contentApiService = inject(ContentApiService)

  // ── Internal mutable state ─────────────────────────────────────────────────
  readonly isTitleTruncated = signal(false)
  readonly isOwnerTruncated = signal(false)
  /** Instance logo — stands in for the owning org, which the plan payload has no image for. */
  readonly defaultSLogo = signal('')

  // ── Computed values ────────────────────────────────────────────────────────
  /** Translation key for the media badge; `inProgress` has no V1 equivalent to reuse. */
  readonly statusLabelKey = computed(() => {
    switch (this.plan()?.planStatus) {
      case 'overdue': return 'cardcontentv2.overDue'
      case 'completed': return 'cardcontentv2.completed'
      default: return 'cardplanv2.inProgress'
    }
  })

  readonly contentCountLabelKey = computed(() =>
    this.plan()?.contentCount === 1 ? 'cardplanv2.course' : 'cardplanv2.courses'
  )

  /** Text of the plan-type chip. APAR and AI CBP are the two that carry an icon. */
  readonly planTypeLabel = computed(() => {
    switch (this.plan()?.planType) {
      case 'APAR': return 'APAR'
      case 'AICBP': return 'AI CBP'
      default: return 'CBP'
    }
  })

  readonly planTypeIcon = computed(() => {
    switch (this.plan()?.planType) {
      case 'APAR': return 'assets/icons/content/apar.svg'
      case 'AICBP': return 'assets/icons/content/Ai_CBP.svg'
      default: return ''
    }
  })

  constructor() {
    const cfg = this.configSvc.instanceConfig
    this.defaultSLogo.set(cfg?.logos?.defaultSourceLogo || '/assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg')

    // Truncation detection — runs once after the first render pass
    afterNextRender(() => this.checkTruncation())
  }

  // ── Event handlers ─────────────────────────────────────────────────────────
  /**
   * Same destination the Training Plans search results use: whoever can edit the plan lands
   * on the editor, everyone else on the read-only dashboard preview. Kept in step with
   * TrainingPlansCardComponent.routeTrainingPlanDetails in @sunbird-cb/search-listing so a
   * plan opens the same way from the home strip as it does from search.
   */
  onCardClick(): void {
    const plan = this.plan()
    if (!plan?.identifier) {
      return
    }
    this.emitDetails()

    const canEdit = (this.configSvc.userProfile?.firstName === plan.metadata?.['createdByName']
      || this.configSvc.userRoles?.has('mdo_leader'))
      && plan.status?.toLowerCase() !== 'retire'

    const url = canEdit
      ? `/app/training-plan/update-plan/${plan.identifier}`
      : `/app/training-plan/preview-plan-for-dashboard/${plan.identifier}`

    this.router.navigate([url])
  }

  emitDetails(): void {
    const cardClickDetails = this.config()?.cardClickDetails
    if (!cardClickDetails) {
      return
    }
    this.contentApiService.publishCardClickDetails({
      ...cardClickDetails,
      identifier: this.plan()?.identifier,
    })
  }

  // ── Private helpers ────────────────────────────────────────────────────────
  private checkTruncation(): void {
    const t = this.titleElRef()?.nativeElement
    const o = this.ownerElRef()?.nativeElement

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

    this.isOwnerTruncated.set(!!o && o.scrollWidth > o.clientWidth)
  }
}
