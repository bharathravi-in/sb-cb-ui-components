import { Component, OnInit } from '@angular/core'
import { MatDialogRef as MatDialogRef } from '@angular/material/dialog'
import { AuthKeycloakService } from '../../services/auth-keycloak.service'
import { ConfigurationsService } from '../../services/configurations.service'
import { UtilityService } from '../../services/utility.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-utils-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

  disabled = false
  isDownloadableIos = false
  isDownloadableAndroid = false
  constructor(
    public dialogRef: MatDialogRef<LogoutComponent>,
    private authSvc: AuthKeycloakService,
    private configSvc: ConfigurationsService,
    private utilitySvc: UtilityService,
    private translate: TranslateService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      // tslint:disable-next-line: no-non-null-assertion
      const lang = localStorage.getItem('websiteLanguage') || null!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isDownloadableIos = !this.configSvc.restrictedFeatures.has('iosDownload')
      this.isDownloadableAndroid = !this.configSvc.restrictedFeatures.has('androidDownload')
    }
  }

  confirmed() {
    this.disabled = true
    this.dialogRef.close()
    if (localStorage.getItem('ratingformID')) {
      localStorage.removeItem('ratingformID')
    }
    if (localStorage.getItem('ratingfeedID')) {
      localStorage.removeItem('ratingfeedID')
    }
    if (localStorage.getItem('platformratingTime')) {
      localStorage.removeItem('platformratingTime')
    }
    if (localStorage.getItem('websiteLanguage')) {
      localStorage.removeItem('websiteLanguage')
    }
    // this.authSvc.logout()
    this.authSvc.force_logout()
    if (localStorage.getItem('faq')) {
      localStorage.removeItem('faq')
    }
    if (localStorage.getItem('faq-languages')) {
      localStorage.removeItem('faq-languages')
    }
    if (sessionStorage.getItem('hideUpdateProfilePopUp')) {
      sessionStorage.removeItem('hideUpdateProfilePopUp')
    }
    if (localStorage.getItem('motivationalMessage')) {
      localStorage.removeItem('motivationalMessage')
    }
    if (localStorage.getItem('microSiteRedirectionData')) {
      localStorage.removeItem('microSiteRedirectionData')
    }
  }

  get isDownloadable() {
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.isContentDownloadAvailable &&
      (this.utilitySvc.iOsAppRef || this.utilitySvc.isAndroidApp)) {
      return true
    }
    return false
  }

}
