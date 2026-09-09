import { Component, Input, signal, ChangeDetectionStrategy, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatRippleModule } from '@angular/material/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { InfoCardsSectionConfig, InfoCardItem } from '../../models/sidebar.models'
import { MultilingualTranslationsService } from '../../../../_services/multilingual-translations.service'
import { SkeletonLoaderLibModule } from '../../../skeleton-loader-lib/skeleton-loader-lib.module'
import { UtilityService } from '@sunbird-cb/utils-v2'

/**
 * Sidebar Info Cards Section Component
 *
 * Renders informational cards with support for nested children cards.
 *
 * Features:
 * - Info card display with title and description
 * - Nested children cards support
 * - Collapsible parent section
 * - Expandable children cards
 * - Click navigation support
 * - Material Design accordions
 *
 * @example
 * <sb-uic-sidebar-info-cards-section [section]="infoCardsConfig" />
 */
@Component({
  selector: 'sb-uic-sidebar-info-cards-section',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatRippleModule,
    TranslateModule,
    SkeletonLoaderLibModule
  ],
  templateUrl: './sidebar-info-cards-section.component.html',
  styleUrls: ['./sidebar-info-cards-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarInfoCardsSectionComponent implements OnChanges {
  /**
   * Info cards section configuration
   */
  @Input({ required: true }) section!: InfoCardsSectionConfig
  @Input({ required: true }) detailsChanged!: boolean

  /**
   * Sidebar open/close state
   */
  @Input({ required: true }) isOpen!: boolean

  /**
   * Content visibility state (with delayed hiding)
   */
  @Input({ required: true }) showContent!: boolean
  @Output() itemClicked = new EventEmitter<{ code: string; subType: string }>()

  constructor(
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private cdr: ChangeDetectorRef,
    private utilitySvc: UtilityService
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Manually detect changes when detailsChanged flag is toggled
    if (changes['detailsChanged'] && !changes['detailsChanged'].firstChange) {
      this.cdr.markForCheck()
    }
  }

  /**
   * Translate a label using MultilingualTranslationsService
   */
  translateLabels(label: string, type: string): string {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  /**
   * Track expanded state of each parent card
   */
  expandedCards = signal<Set<number>>(new Set());

  /**
   * Toggle expansion of a parent card with children
   */
  toggleCardExpansion(index: number): void {
    this.expandedCards.update(expanded => {
      const newSet = new Set(expanded)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  isCardExpanded(index: number): boolean {
    return this.expandedCards().has(index)
  }

  trackByTitle(index: number, item: InfoCardItem): string {
    return item.title || `info-item-${index}`
  }

  trackByChildTitle(index: number, child: any): string {
    return child.title || `child-item-${index}`
  }

  onItemClicked(item: InfoCardItem | any): void {
    this.utilitySvc.setRouteData([{ module: 'Home', pageId: 'page/home' }])
    this.itemClicked.emit({ code: item.code, subType: item.subtype || '' })
  }
}
