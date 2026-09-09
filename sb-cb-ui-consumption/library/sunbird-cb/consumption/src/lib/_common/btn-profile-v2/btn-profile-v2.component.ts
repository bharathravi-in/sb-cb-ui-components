import {
  Component,
  computed,
  DestroyRef,
  HostBinding,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CommonModule } from '@angular/common'
import { Router, ActivatedRoute, RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatDialog } from '@angular/material/dialog'
import { TranslateModule, TranslateService } from '@ngx-translate/core'

import {
  ConfigurationsService,
  DomainConfService,
  EventService,
  LogoutComponent,
  NsAppsConfig,
  NsPage,
  WsEvents,
} from '@sunbird-cb/utils-v2'
import { WidgetBaseComponent } from '@sunbird-cb/resolver-v2'
import { AvatarPhotoLibModule } from '../avatar-photo-lib/avatar-photo-lib.module'
import {
  DEFAULT_PROFILE_MENU_ITEMS,
  IProfileMenuItem,
} from './btn-profile-v2.model'

// ---------------------------------------------------------------------------
// Fallback stubs for services not available in this library package
// ---------------------------------------------------------------------------
// AccessControlService: used only for group/feature role-gating.
// Fallback: treat all groups as accessible (show everything).
// TODO: replace with real AccessControlService if it becomes available.

// LibNotificationsService: used only to updateUnreadCount on "view profile" click.
// Fallback: omit the side-effect call.
// TODO: wire in real LibNotificationsService when available.
// ---------------------------------------------------------------------------

@Component({
  selector: 'sb-uic-btn-profile-v2',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
    AvatarPhotoLibModule,
  ],
  templateUrl: './btn-profile-v2.component.html',
  styleUrls: ['./btn-profile-v2.component.scss'],
})
export class BtnProfileV2Component extends WidgetBaseComponent implements OnInit {
  @HostBinding('id') public id = 'Profile_link'
  @HostBinding('class') public hostClass = 'profile-link'

  @Input() widgetData!:any

  // ── Injected services ──────────────────────────────────────────────────────
  private readonly configSvc = inject(ConfigurationsService)
  private readonly dialog = inject(MatDialog)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly translate = inject(TranslateService)
  private readonly events = inject(EventService)
  private readonly domainConfSvc = inject(DomainConfService)
  private readonly destroyRef = inject(DestroyRef)

  // ── Reactive state ─────────────────────────────────────────────────────────
  readonly givenName = signal('Guest')
  readonly profileImage = signal<string | null>(null)
  readonly verifiedBadge = signal(false)
  readonly hideMenu = signal(false)
  readonly isKbPortal = signal(true)
  /** Dropdown entries, resolved from globalConfig.components.profileMenu (see ngOnInit) */
  readonly menuItems = signal<IProfileMenuItem[]>(DEFAULT_PROFILE_MENU_ITEMS)

  // Derived full name for template convenience
  readonly displayName = computed(() => this.givenName())
  profileCompletionPercentage = 0
  showProgressBar = false

  constructor() {
    super()
    // Resolve verified badge synchronously from unMappedUser
    if (
      this.configSvc.unMappedUser?.profileDetails?.profileStatus === 'VERIFIED'
    ) {
      this.verifiedBadge.set(true)
    }

    this.updateUserInfo()
    // Set up language
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }

    this.isKbPortal.set(this.domainConfSvc.isKbPortal())
  }

  ngOnInit(): void {
    this.setPinnedAppsSubscription()
    this.setMenuItems()

    if (this.widgetData?.actionBtnId) {
      this.id = this.widgetData.actionBtnId
    }

    if (this.widgetData?.showProgress) {
      this.showProgressBar = this.widgetData.showProgress
    }

    const profileDetails = this.configSvc.unMappedUser?.profileDetails
    const profileStatus = profileDetails?.profileStatus?.toLowerCase()
    const deptName =
      profileDetails?.employmentDetails?.departmentName?.toLowerCase()

    const isNotMyUser = profileStatus === 'not-my-user'
    const isIgotOrg = deptName === 'igot'

    this.hideMenu.set(isNotMyUser && isIgotOrg)
    this.setProfileCompletionGraph()
  }

  // ── Dropdown menu ──────────────────────────────────────────────────────────

  /**
   * Resolves the dropdown entries from globalConfig.components.profileMenu.
   *
   * No `items` array configured -> keep DEFAULT_PROFILE_MENU_ITEMS, so a tenant that has not
   * adopted this config still gets the standard menu. Section explicitly disabled, or every
   * item disabled -> render nothing.
   *
   * Read straight off getGlobalConfig() rather than through a DomainConfService helper: the
   * config lives in the host app's assets, while this library resolves @sunbird-cb/utils-v2
   * from its published build, so a new service method would not be visible until that package
   * is rebuilt and re-released.
   */
  private setMenuItems(): void {
    const config = this.domainConfSvc.getGlobalConfig()?.components?.profileMenu
    if (!config || !Array.isArray(config.items)) { return }

    if (config.enabled === false) {
      this.menuItems.set([])
      return
    }

    this.menuItems.set(
      config.items.filter((item: IProfileMenuItem) => item && item.enabled !== false)
    )
  }

  /** Handles the actions that are not plain links (`logout`, `accessibility`) */
  onMenuAction(item: IProfileMenuItem): void {
    switch (item.action) {
      case 'logout':
        this.logout()
        break
      case 'accessibility':
        this.raiseTelemetry(item.key)
        this.openAccessibilityMenu()
        break
      default:
        // `route` and `newTab` are handled by routerLink / href in the template
        break
    }
  }

  setProfileCompletionGraph() {
    const progress = 247 - (247 * this.profileCompletionPercentage) / 100
    document.documentElement.style.setProperty('--i', String(progress))
  }

  // ── User info ──────────────────────────────────────────────────────────────
  private updateUserInfo(): void {
    this.profileCompletionPercentage = this.configSvc?.userProfileV2?.profileUpdateCompletion || this.configSvc?.userProfileV2?.profileCompletionPercentage || 0
    const profile = this.configSvc.userProfile
    if (profile) {
      const fullName =
        profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.firstName
      this.givenName.set(fullName || 'Guest')

      const image: string | null =
        profile.profileImageUrl ||
        (this.configSvc.userProfileV2?.profileImage ?? null) ||
        localStorage.getItem(profile.userId) ||
        null
      this.profileImage.set(image)
    }
  }

  // ── Pinned apps subscription (kept for future use) ─────────────────────────
  private setPinnedAppsSubscription(): void {
    this.configSvc.pinnedApps
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // Pinned apps panel is commented-out in template (matches legacy).
        // Retain subscription wiring for easy re-enable.
      })
  }

  // ── Navigation handlers ────────────────────────────────────────────────────
  redirectToTourPage(): void {
    this.raiseTelemetry('Get Started')
    this.router.navigate(['/page/home'], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
    })
    this.configSvc.updateTourGuideMethod(false)
  }

  redirectToMyLearning(): void {
    this.raiseTelemetry('My Learning')
    this.router.navigate(['/app/seeAll/new'], {
      queryParams: { key: 'continueLearning' },
    })
  }

  handleRedirectToCompetencyPassbook(): void {
    this.raiseTelemetry('Competency Passbook')
    this.router.navigate(['/page/competency-passbook/list'])
  }

  redirectToLearnersPage(): void {
    this.raiseTelemetry('Tips For Learners')
    this.router.navigate(['/learner-advisory'])
  }

  redirectToKBPortal(): void {
    // TODO: replace with environment.missionKarmayogiPath when environment
    //       injection is available in the library build.
    const kbUrl: string =
      (this.configSvc as any).instanceConfig?.portalConfig?.missionKarmayogiPath || ''
    if (kbUrl) {
      window.open(kbUrl, '_blank')
    }
  }

  openAccessibilityMenu(): void {
    const userWay = (window as any).UserWay
    if (userWay && typeof userWay.widgetOpen === 'function') {
      userWay.widgetOpen()
      return
    }
    // Fallback if the UserWay JS API isn't ready yet: trigger its own (hidden) icon
    document.getElementById('userwayAccessibilityIcon')?.click()
  }

  logout(): void {
    this.raiseTelemetry('signout')
    this.dialog.open(LogoutComponent, {
      panelClass: 'logout-dialog-panel',
    })
  }

  // ── Telemetry ──────────────────────────────────────────────────────────────
  raiseTelemetry(tabname: string): void {
    // TODO: call LibNotificationsService.updateUnreadCount() for 'view profile'
    //       when LibNotificationsService becomes available in this library.
    const id = tabname.toLowerCase().split(' ').join('-')
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
  }
}
