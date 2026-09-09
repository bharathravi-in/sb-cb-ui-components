import { Component, ChangeDetectionStrategy, computed, signal, Output, EventEmitter, inject, DestroyRef, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ContentSectionConfig, DisplayType } from '../models/content-section.model'
import { filterVisibleSections } from '../utils/visibility.util'
import { AccordionComponent } from '../accordion/accordion.component'
import { ContentStripWithTabsPillsV2Component } from '../content-strip-with-tabs-pills/content-strip-with-tabs-pills.component'
import { ContentStripWithPillsComponent } from '../content-strip-with-pills/content-strip-with-pills.component'
import { ContentStripsComponent } from '../content-strips/content-strips.component'
import { SbUicSpotlightCardsV2Component } from '../../spotlight-cards-v2/spotlight-cards-v2.component'
import { SbUicCarouselBannerV2Component } from '../../carousel-banner-v2/carousel-banner-v2.component'
import { NsCarouselBannerV2 } from '../../carousel-banner-v2/carousel-banner-v2.model'
import { WelcomeGreetingV2Component } from '../../welcome-greeting-v2/welcome-greeting-v2.component'
import { ContinueLearningV2Component } from '../../continue-learning-v2/continue-learning-v2.component'
import { ContentApiService } from '../services/content-api.service'
import { ActivatedRoute } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils-v2'

interface ISliderDataItem {
  active: boolean
  banners: {
    l: string
    m: string
    s: string
    xl: string
    xs: string
    xxl: string
  }
  redirectUrl: string
  openInNewTab?: boolean
  queryParams?: Record<string, any>
  title: string
}

@Component({
  selector: 'sb-uic-contetn-sections',
  standalone: true,
  imports: [
    CommonModule,
    AccordionComponent,
    ContentStripWithTabsPillsV2Component,
    ContentStripWithPillsComponent,
    ContentStripsComponent,
    SbUicSpotlightCardsV2Component,
    SbUicCarouselBannerV2Component,
    WelcomeGreetingV2Component,
    ContinueLearningV2Component
  ],
  templateUrl: './contetn-sections.component.html',
  styleUrls: ['./contetn-sections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContetnSectionsComponent implements OnDestroy {
  @Output() cardClicked = new EventEmitter<{ cardClickDetails: any }>();

  private readonly contentApiService = inject(ContentApiService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly valueSvc = inject(ValueService)

  private emptySectionKeys = signal<string[]>([]);
  private isMobile = signal(false);

  private readonly sections = signal<ContentSectionConfig[]>(
    this.activatedRoute.snapshot.data?.home?.data?.homeSection || []
  )

  // Desktop/tablet section order (list of sectionKey, in display order)
  private readonly order: string[] = this.activatedRoute.snapshot.data?.home?.data?.order || []
  // Mobile-web section order (list of sectionKey, in display order)
  private readonly mWebOrder: string[] = this.activatedRoute.snapshot.data?.home?.data?.mWebOrder || []

  visibleSections = computed(() => {
    const sections = filterVisibleSections(this.sections())
    const emptyKeys = this.emptySectionKeys()
    const filtered = sections.filter(section => !emptyKeys.includes(section.sectionKey))

    const orderList = this.isMobile() ? this.mWebOrder : this.order
    if (!orderList.length) {
      return filtered
    }

    return [...filtered].sort((a, b) => {
      const indexA = orderList.indexOf(a.sectionKey)
      const indexB = orderList.indexOf(b.sectionKey)
      const rankA = indexA === -1 ? orderList.length : indexA
      const rankB = indexB === -1 ? orderList.length : indexB
      return rankA - rankB
    })
  });

  banners = computed<NsCarouselBannerV2.IBannerItem[]>(() => {
    const sliderData: ISliderDataItem[] = this.activatedRoute.snapshot.data?.home?.data?.sliderData || []
    if (!Array.isArray(sliderData) || !sliderData.length) {
      return []
    }
    return sliderData
      .filter((item: ISliderDataItem) => item.active)
      .map((item: ISliderDataItem) => this.transformBannerData(item))
  })

  readonly DisplayType = DisplayType;

  constructor() {
    this.contentApiService.cardClickDetails$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((details) => {
        if (details) {
          this.cardClicked.emit({ cardClickDetails: details })
        }
      })

    this.contentApiService.emptySectionKeys$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((keys) => {
        this.emptySectionKeys.set(keys)
      })

    this.contentApiService.sectionUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ sectionKey, changes }) => {
        this.sections.update(sections =>
          sections.map(section => section.sectionKey === sectionKey ? { ...section, ...changes } : section)
        )
      })

    this.valueSvc.isLtMedium$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isMobile) => {
        this.isMobile.set(isMobile)
      })
  }

  private transformBannerData(item: ISliderDataItem): NsCarouselBannerV2.IBannerItem {
    return {
      bannerUrl: item.banners.l || item.banners.xl,
      redirectionUrl: item.redirectUrl || '',
      altText: item.title || '',
      title: item.title || '',
      subtitle: '',
      ctaLabel: '',
    }
  }

  isTabsSection(section: ContentSectionConfig): boolean {
    return section?.displayType === DisplayType.Tabs
  }

  isPillsSection(section: ContentSectionConfig): boolean {
    return section?.displayType === DisplayType.Pills
  }

  isCardsSection(section: ContentSectionConfig): boolean {
    return section?.displayType === DisplayType.Cards
  }

  ngOnDestroy() {
    this.destroyRef.destroyed
  }
}
