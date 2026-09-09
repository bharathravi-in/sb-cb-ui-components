import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { SkeletonLoaderLibModule } from '../../../skeleton-loader-lib/skeleton-loader-lib.module'
import { MultilingualTranslationsService, UtilityService } from '@sunbird-cb/utils-v2'
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'sb-uic-sidebar-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    SkeletonLoaderLibModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar-footer.component.html',
  styleUrls: ['./sidebar-footer.component.scss']
})
export class SidebarFooterComponent implements OnChanges {

  @Input({ required: true }) itemsList: any[] = []
  @Input({ required: true }) isOpen!: boolean

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
  translateLabels(label: string, type: string, disableTranslate?: boolean): string {
    if (disableTranslate) {
      return label
    }
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  onItemClick(item: any): void {
    this.utilitySvc.setRouteData([{ module: 'Home', pageId: 'page/home' }])
    if (item?.code) {
      const eventDetails = {
        code: item.code,
        subType: item.subType || '',
      }
      this.itemClicked.emit(eventDetails)
    }
  }


}
