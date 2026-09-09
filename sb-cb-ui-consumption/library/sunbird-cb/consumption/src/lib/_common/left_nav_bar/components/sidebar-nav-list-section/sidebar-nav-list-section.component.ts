import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, OnDestroy, SimpleChanges, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router, NavigationEnd } from '@angular/router'
import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { MatIconModule } from '@angular/material/icon'
import { MatRippleModule } from '@angular/material/core'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { NavListSectionConfig, NavListItem } from '../../models/sidebar.models'
import { MultilingualTranslationsService } from '../../../../_services/multilingual-translations.service'
import { SkeletonLoaderLibModule } from '../../../skeleton-loader-lib/skeleton-loader-lib.module'
import { UtilityService } from '@sunbird-cb/utils-v2'

/**
 * Sidebar Nav List Section Component
 *
 * Renders a list of navigation items with icons and active route highlighting.
 *
 * Features:
 * - Material icons and custom image icons support
 * - Active route highlighting
 * - Hover effects with ripple animation
 * - Accessible keyboard navigation
 * - RouterLink integration
 *
 * @example
 * <sb-uic-sidebar-nav-list-section [section]="navListConfig" />
 */
@Component({
  selector: 'sb-uic-sidebar-nav-list-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    TranslateModule,
    SkeletonLoaderLibModule
  ],
  templateUrl: './sidebar-nav-list-section.component.html',
  styleUrls: ['./sidebar-nav-list-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarNavListSectionComponent implements OnChanges, OnDestroy {
  /**
   * Navigation list section configuration
   */
  @Input({ required: true }) section!: NavListSectionConfig
  @Input({ required: true }) isOpen!: boolean // Sidebar open/close state
  @Input({ required: true }) detailsChanged!: boolean

  /**
   * Content visibility state (with delayed hiding)
   */
  @Input({ required: true }) showContent!: boolean
  @Input() activeItemCode?: string

  @Output() itemClicked = new EventEmitter<{ code: string; subType: string }>()

  itemsList: NavListItem[] = []
  limitedItemsList: NavListItem[] = []

  viewAllItems = signal<boolean>(false)
  showViewAll = signal<boolean>(false)

  visibleItems = computed(() =>
    this.viewAllItems() ? this.itemsList : this.limitedItemsList
  );

  /**
   * isActiveRoute() reads the router rather than any component input, so on an
   * OnPush view nothing marks it dirty when the URL changes. Bumping this signal
   * on NavigationEnd is what re-runs the active-state bindings. RouterLinkActive
   * used to provide that as a side effect of its own markForCheck(), which is why
   * the highlight kept working while two competing sources set the same class.
   */
  private navigationTick = signal(0)
  private subs: Subscription[] = []

  constructor(
    private router: Router,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private utilitySvc: UtilityService
  ) {
    this.subs.push(
      this.langtranslations.languageSelectedObservable.subscribe(() => {
        if (localStorage.getItem('websiteLanguage')) {
          this.translate.setDefaultLang('en')
          const lang = localStorage.getItem('websiteLanguage')!
          this.translate.use(lang)
        }
      })
    )

    this.subs.push(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => this.navigationTick.update(v => v + 1))
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['section'] && this.section && this.section.items) {
      this.itemsList = this.section.items.filter(item => item.enabled !== false)
      if (this.section.maxItemsVisible) {
        this.limitedItemsList = this.itemsList.slice(0, this.section.maxItemsVisible)
      }
      if (this.section.showViewAll && this.section.maxItemsVisible && this.itemsList.length > this.section.maxItemsVisible) {
        this.showViewAll.set(true)
      }
      if (!this.showViewAll()) {
        this.viewAllItems.set(true)
      }
    }
  }

  /**
   * Translate a label using MultilingualTranslationsService
   */

  translateLabels(label: string, type: string): string {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  itemTooltip(item?: NavListItem): string {
    return item?.tooltipText || item?.label || ''
  }

  onItemClick(item: NavListItem): void {
    this.utilitySvc.setRouteData([{ module: 'Home', pageId: 'page/home' }])
    if (item?.code) {
      this.itemClicked.emit({ code: item.code, subType: item.subtype ?? '' })
    }
  }

  /**
   * Check if a route is currently active
   *
   * Sidebar items routinely share a navUrl and are told apart only by their query
   * string - marketplace and my-learning both sit under seeAll, and the
   * globalsearch presets differ only by their filter params. So any item that
   * declares queryParams is active only when the current URL carries them, rather
   * than just "my-learning" being special-cased.
   *
   * 'subset' rather than 'exact' because the page adds params of its own (pill and
   * tab state the config does not spell out) and those must not break the match.
   * Items with no queryParams keep ignoring the query string entirely, so
   * something like /page/home stays active whatever is appended to it.
   */
  isActiveRoute(item?: NavListItem): boolean {
    // Read the tick so the binding re-runs after a navigation - see navigationTick.
    this.navigationTick()

    if (!item?.navUrl) return false

    const hasQueryParams = !!item.queryParams && Object.keys(item.queryParams).length > 0

    return this.router.isActive(
      this.router.createUrlTree([item.navUrl], hasQueryParams ? { queryParams: item.queryParams } : {}),
      {
        paths: 'exact',
        queryParams: hasQueryParams ? 'subset' : 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      }
    )
  }

  /**
   * Track by function for nav items
   */
  trackByNavUrl(index: number, item: NavListItem): string {
    return item.navUrl || `nav-item-${index}`
  }
}
