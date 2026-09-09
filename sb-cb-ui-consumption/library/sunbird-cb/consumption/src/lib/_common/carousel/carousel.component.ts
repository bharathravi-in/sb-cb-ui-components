import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  viewChild,
  contentChild,
  ElementRef,
  TemplateRef,
  AfterViewInit,
  OnDestroy,
  effect,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { UtilityService } from '@sunbird-cb/utils-v2'

/**
 * A reusable, content-agnostic carousel component built with Angular 20 signals.
 *
 * Usage:
 * <sb-uic-carousel [items]="courseList" [cardWidth]="280" [gap]="16">
 *   <ng-template #carouselCard let-item let-index="index">
 *     <app-course-card [data]="item"></app-course-card>
 *   </ng-template>
 * </sb-uic-carousel>
 */
@Component({
  selector: 'sb-uic-carousel',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  // --- Inputs ---
  /** Array of items to render in the carousel */
  items = input.required<any[]>();

  /** Fixed width of each card in pixels */
  cardWidth = input<number>(230);

  /** Gap between cards in pixels */
  gap = input<number>(16);

  /** Whether to show navigation arrows */
  showNavigation = input<boolean>(true);

  /** Whether to show pagination dots */
  showDots = input<boolean>(true);

  /** Number of cards to scroll per navigation click (0 = scroll by visible count) */
  scrollBy = input<number>(0);

  // --- Outputs ---
  /** Emits when the active page changes */
  pageChanged = output<number>();

  /** Emits item and index when a card is clicked */
  itemClicked = output<{ item: any; index: number }>();

  // --- Content child: card template ---
  cardTemplate = contentChild.required<TemplateRef<any>>('carouselCard');

  // --- View children ---
  viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');

  // --- Internal state ---
  private containerWidth = signal<number>(0);
  currentPage = signal<number>(0);
  private resizeObserver: ResizeObserver | null = null;

  // --- Computed signals ---
  /** Number of cards visible at current container width */
  visibleCards = computed(() => {
    const width = this.containerWidth()
    const cw = this.cardWidth()
    const g = this.gap()
    if (width <= 0) return 1
    // Each card takes cardWidth + gap, except the last visible card which doesn't need trailing gap
    const count = Math.floor((width + g) / (cw + g))
    return Math.max(1, count)
  });

  /** Total number of pages */
  totalPages = computed(() => {
    const itemCount = this.items()?.length ?? 0
    const visible = this.visibleCards()
    if (itemCount <= visible) return 1
    return Math.ceil((itemCount - visible) / this.effectiveScrollBy()) + 1
  });

  /** Effective scroll-by count */
  effectiveScrollBy = computed(() => {
    const sb = this.scrollBy()
    return sb > 0 ? sb : this.visibleCards()
  });

  /** Whether previous button should be disabled */
  canGoPrevious = computed(() => this.currentPage() > 0);

  /** Whether next button should be disabled */
  canGoNext = computed(() => this.currentPage() < this.totalPages() - 1);

  /** CSS translateX value for the track */
  translateX = computed(() => {
    const page = this.currentPage()
    const cw = this.cardWidth()
    const g = this.gap()
    const scrollCards = this.effectiveScrollBy()
    const offset = page * scrollCards * (cw + g)
    // Ensure we don't scroll past the end
    const itemCount = this.items()?.length ?? 0
    const maxOffset = Math.max(0, (itemCount * (cw + g)) - g - this.containerWidth())
    return -Math.min(offset, maxOffset)
  });

  /** Array of page indices for dot rendering */
  dotsArray = computed(() => {
    const total = this.totalPages()
    return Array.from({ length: total }, (_, i) => i)
  });

  constructor(
    private utilitySvc: UtilityService
  ) {
    // Clamp currentPage when totalPages changes (e.g. on resize)
    effect(() => {
      const total = this.totalPages()
      const current = this.currentPage()
      if (current >= total && total > 0) {
        this.currentPage.set(total - 1)
      }
    })
  }

  ngAfterViewInit(): void {
    const el = this.viewport().nativeElement
    this.containerWidth.set(el.offsetWidth)

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        this.containerWidth.set(width)
      }
    })
    this.resizeObserver.observe(el)
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
  }

  // --- Navigation methods ---
  goToPage(page: number): void {
    const total = this.totalPages()
    const clamped = Math.max(0, Math.min(page, total - 1))
    this.currentPage.set(clamped)
    this.pageChanged.emit(clamped)
  }

  goNext(): void {
    if (this.canGoNext()) {
      this.goToPage(this.currentPage() + 1)
    }
  }

  goPrevious(): void {
    if (this.canGoPrevious()) {
      this.goToPage(this.currentPage() - 1)
    }
  }

  onItemClick(item: any, index: number): void {
    this.utilitySvc.setRouteData([{ module: 'Home', pageId: 'page/home' }])
    this.itemClicked.emit({ item, index })
  }

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.goPrevious()
        event.preventDefault()
        break
      case 'ArrowRight':
        this.goNext()
        event.preventDefault()
        break
    }
  }

  trackByIndex(index: number): number {
    return index
  }
}
