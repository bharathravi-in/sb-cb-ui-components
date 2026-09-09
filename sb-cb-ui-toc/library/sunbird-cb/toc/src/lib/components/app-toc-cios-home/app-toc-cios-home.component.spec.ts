// app-toc-cios-home.component.spec.ts
// Pure unit tests - the component is instantiated directly with mocked dependencies, no TestBed.

// Mock all external modules BEFORE importing the component under test.
jest.mock('@angular/router', () => ({
  ActivatedRoute: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@angular/material/dialog', () => ({
  MatDialog: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@angular/material/snack-bar', () => ({
  MatSnackBar: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('../../services/loader.service', () => ({
  LoaderService: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('../../services/certificate.service', () => ({
  CertificateService: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('../../services/netcore.service', () => ({
  NetCoreService: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@sunbird-cb/consumption', () => ({
  CommonMethodsService: jest.fn().mockImplementation(() => ({
    handleCapitalize: jest.fn(),
  })),
}))

jest.mock('@sunbird-cb/utils-v2', () => ({
  ConfigurationsService: jest.fn().mockImplementation(() => ({})),
  EventService: jest.fn().mockImplementation(() => ({})),
  MultilingualTranslationsService: jest.fn().mockImplementation(() => ({})),
  WidgetContentService: jest.fn().mockImplementation(() => ({})),
  WsEvents: {
    WsEventType: { Telemetry: 'telemetry' },
    WsEventLogLevel: { Info: 'info' },
    EnumTelemetrySubType: { Loaded: 'loaded', Unloaded: 'unloaded', Interact: 'Interact' },
    EnumTelemetrymodules: { CONTENT: 'content' },
  },
}))

jest.mock('@sunbird-cb/discussion-v2', () => ({
  NsDiscussionV2: {},
}))

jest.mock('@ngx-translate/core', () => ({
  TranslateService: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('./consent-dialog.component', () => ({
  ConsentDialogComponent: class MockConsentDialogComponent { },
}))

import { of, throwError, BehaviorSubject } from 'rxjs'
import { AppTocCiosHomeComponent } from './app-toc-cios-home.component'

describe('AppTocCiosHomeComponent', () => {
  let component: AppTocCiosHomeComponent

  let routeMock: any
  let commonSvcMock: any
  let translateMock: any
  let configSvcMock: any
  let eventsMock: any
  let langtranslationsMock: any
  let contentSvcMock: any
  let certSvcMock: any
  let loaderMock: any
  let matDialogMock: any
  let snackBarMock: any
  let netCoreServiceMock: any
  let environmentMock: any

  const buildDiscussWidgetData = () => ({
    newCommentSection: {
      commentTreeData: { entityId: '' },
      commentBox: { placeholder: '' },
    },
    commentsList: {
      repliesSection: {
        newCommentReply: {
          commentTreeData: { entityId: '' },
        },
      },
    },
  })

  const setWindowProp = (prop: string, value: any) => {
    Object.defineProperty(window, prop, { value, writable: true, configurable: true })
  }

  /** Builds a fresh component with the current mocks. */
  const createComponent = (): AppTocCiosHomeComponent =>
    new AppTocCiosHomeComponent(
      routeMock,
      commonSvcMock,
      translateMock,
      configSvcMock,
      eventsMock,
      langtranslationsMock,
      contentSvcMock,
      certSvcMock,
      loaderMock,
      matDialogMock,
      snackBarMock,
      netCoreServiceMock,
      environmentMock
    )

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()

    routeMock = {
      data: of({}),
      snapshot: {
        queryParams: {},
        data: {},
      },
    }

    commonSvcMock = {
      handleCapitalize: jest.fn().mockReturnValue('Capitalized'),
    }

    translateMock = {
      setDefaultLang: jest.fn(),
      use: jest.fn(),
    }

    configSvcMock = {
      languageTranslationFlag: new BehaviorSubject<any>(false),
      userProfile: null,
      userProfileV2: { email: 'user@test.com' },
      netcoreConfig: null,
      unMappedUser: { identifier: '  USER-1  ' },
    }

    eventsMock = {
      dispatchEvent: jest.fn(),
      raiseInteractTelemetry: jest.fn(),
    }

    langtranslationsMock = {
      translateLabel: jest.fn().mockReturnValue('translated'),
    }

    contentSvcMock = {
      extContentEnroll: jest.fn().mockReturnValue(of({ result: { id: 'enrolled' } })),
      fetchExtUserContentEnroll: jest.fn().mockReturnValue(of({ result: { progress: 10 } })),
    }

    certSvcMock = {
      downloadCertificate_v2: jest.fn().mockReturnValue(of({ result: { printUri: 'print-uri' } })),
      consentSubmit: jest.fn().mockReturnValue(of({ result: 'ok' })),
      validateEnrollmentEligibility: jest.fn().mockReturnValue(of({ result: 'eligible' })),
      getKarmaPointsDeductionRule: jest.fn().mockReturnValue(of({ result: { requiredKarmaPoints: 0 } })),
    }

    loaderMock = {
      changeLoad: { next: jest.fn() },
    }

    matDialogMock = {
      open: jest.fn().mockReturnValue({ afterClosed: () => of(true) }),
    }

    snackBarMock = {
      open: jest.fn(),
    }

    netCoreServiceMock = {
      trackEventForContentAndEvent: jest.fn(),
    }

    environmentMock = { missionKarmayogiPath: 'https://karmayogi.in' }

    setWindowProp('innerWidth', 1400)
    setWindowProp('scrollY', 0)

    component = createComponent()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  describe('constructor - route data handling', () => {
    it('should stop the enroll validation loader once route data resolves', () => {
      expect(component.enrollValidationLoading).toBe(false)
    })

    it('should mark ext content unavailable when route data has no content', () => {
      expect(component.extContentAvailable).toBe(false)
      expect(component.skeletonLoader).toBe(false)
    })

    it('should read the ext content and seed the certificate object', () => {
      routeMock.data = of({ extContent: { data: { content: { contentId: 'c1', name: 'Course' } } } })
      const created = createComponent()
      expect(created.extContentReadData.contentId).toBe('c1')
      expect(created.extContentReadData.certificateObj).toEqual({ data: {} })
      expect(created.skeletonLoader).toBe(false)
      expect(created.extContentAvailable).toBe(true)
    })

    it('should keep content unavailable when extContent has no data node', () => {
      routeMock.data = of({ extContent: {} })
      const created = createComponent()
      expect(created.extContentAvailable).toBe(false)
    })

    it('should store the user enrollment when the route resolves one', () => {
      routeMock.data = of({
        extContent: { data: { content: { contentId: 'c1' } } },
        userEnrollContent: { data: { result: { completionpercentage: 40 } } },
      })
      const created = createComponent()
      expect(created.userExtCourseEnroll).toEqual({ completionpercentage: 40 })
      expect(created.extContentReadData.completionStatus).toBeUndefined()
    })

    it('should mark the content complete and download the certificate at 100 percent', () => {
      routeMock.data = of({
        extContent: { data: { content: { contentId: 'c1' } } },
        userEnrollContent: {
          data: {
            result: {
              completionpercentage: 100,
              issued_certificates: [{ identifier: 'cert-1' }],
            },
          },
        },
      })
      const created = createComponent()
      expect(created.extContentReadData.completionStatus).toBe(2)
      expect(certSvcMock.downloadCertificate_v2).toHaveBeenCalledWith('cert-1')
    })

    it('should validate enrollment eligibility when the user is not enrolled', () => {
      routeMock.data = of({
        extContent: { data: { content: { contentId: 'c1', contentPartner: { id: 'p1' } } } },
      })
      const created = createComponent()
      expect(certSvcMock.validateEnrollmentEligibility).toHaveBeenCalledWith('c1', 'p1')
      expect(created.canEnroll).toBe(true)
    })

    it('should validate enrollment eligibility when the enrollment result is empty', () => {
      routeMock.data = of({
        extContent: { data: { content: { contentId: 'c1', contentPartner: { id: 'p1' } } } },
        userEnrollContent: { data: { result: {} } },
      })
      createComponent()
      expect(certSvcMock.validateEnrollmentEligibility).toHaveBeenCalled()
    })

    it('should load the karma points to enrol with when the user is not enrolled', async () => {
      certSvcMock.getKarmaPointsDeductionRule.mockReturnValue(of({ result: { requiredKarmaPoints: 30 } }))
      routeMock.data = of({
        extContent: { data: { content: { contentId: 'c1', contentPartner: { id: 'p1' } } } },
      })
      const created = createComponent()
      expect(certSvcMock.getKarmaPointsDeductionRule).toHaveBeenCalledWith('c1', 'p1')
      await (created as any).karmaPointsRequest
      expect(created.requiredKarmaPoints).toBe(30)
    })

    it('should not load the karma points for an already enrolled user', () => {
      routeMock.data = of({
        extContent: { data: { content: { contentId: 'c1', contentPartner: { id: 'p1' } } } },
        userEnrollContent: { data: { result: { progress: 40 } } },
      })
      createComponent()
      expect(certSvcMock.getKarmaPointsDeductionRule).not.toHaveBeenCalled()
    })
  })

  describe('constructor - language handling', () => {
    it('should not touch the translate service when no website language is stored', () => {
      expect(translateMock.setDefaultLang).not.toHaveBeenCalled()
      expect(component.currentLang).toBe('en')
    })

    it('should apply the stored website language', () => {
      localStorage.setItem('websiteLanguage', 'hi')
      const created = createComponent()
      expect(translateMock.setDefaultLang).toHaveBeenCalledWith('en')
      expect(created.currentLang).toBe('hi')
      expect(translateMock.use).toHaveBeenCalledWith('hi')
    })

    it('should re-apply the language when the translation flag turns on', () => {
      localStorage.setItem('websiteLanguage', 'ta')
      configSvcMock.languageTranslationFlag = new BehaviorSubject<any>(true)
      const created = createComponent()
      expect(created.currentLang).toBe('ta')
      expect(translateMock.use).toHaveBeenCalledWith('ta')
    })

    it('should ignore the translation flag when no language is stored', () => {
      configSvcMock.languageTranslationFlag = new BehaviorSubject<any>(true)
      const created = createComponent()
      expect(created.currentLang).toBe('en')
      expect(translateMock.use).not.toHaveBeenCalled()
    })
  })

  describe('constructor - profile and query params', () => {
    it('should leave rootOrgId unset when there is no user profile', () => {
      expect(component.rootOrgId).toBeUndefined()
    })

    it('should read rootOrgId from the user profile', () => {
      configSvcMock.userProfile = { rootOrgId: 'org-1' }
      const created = createComponent()
      expect(created.rootOrgId).toBe('org-1')
    })

    it('should default commentId to an empty string', () => {
      expect(component.commentId).toBe('')
    })

    it('should read commentId from the query params', () => {
      routeMock.snapshot.queryParams = { commentId: 'comment-9' }
      const created = createComponent()
      expect(created.commentId).toBe('comment-9')
    })

    it('should build the content link from the current location', () => {
      expect(component.contentLink).toBe(`${window.location.pathname.substring(1)}${window.location.search}`)
    })
  })

  describe('ngOnInit', () => {
    it('should read the page config and initialise the discussion data', () => {
      routeMock.snapshot.data = { pageData: { data: { title: 'page' } } }
      const created = createComponent()
      const initSpy = jest.spyOn(created, 'initializeDiscussData').mockImplementation(() => { })
      created.ngOnInit()
      expect(created.config).toEqual({ title: 'page' })
      expect(initSpy).toHaveBeenCalled()
    })

    it('should skip the config when the route has no page data', () => {
      component.ngOnInit()
      expect(component.config).toBeUndefined()
    })

    it('should flag mobile when the viewport is 1200px or narrower', () => {
      setWindowProp('innerWidth', 900)
      component.ngOnInit()
      expect(component.isMobile).toBe(true)
    })

    it('should not flag mobile on a wide viewport', () => {
      setWindowProp('innerWidth', 1400)
      component.ngOnInit()
      expect(component.isMobile).toBe(false)
    })

    it('should raise the netcore view event', () => {
      const netCoreSpy = jest.spyOn(component, 'contentViewEventForNetCore')
      component.ngOnInit()
      expect(netCoreSpy).toHaveBeenCalledWith('view')
    })
  })

  describe('initializeDiscussData', () => {
    it('should warn when the learning partner is inactive', () => {
      component.extContentReadData = { contentPartner: { isActive: false } }
      component.initializeDiscussData()
      expect(snackBarMock.open).toHaveBeenCalledWith(
        expect.stringContaining('temporarily not available'),
        'X',
        { duration: 10000 }
      )
    })

    it('should warn when the course itself is inactive', () => {
      component.extContentReadData = { contentPartner: { isActive: true }, isActive: false }
      component.initializeDiscussData()
      expect(snackBarMock.open).toHaveBeenCalledWith(
        expect.stringContaining('no longer being offered'),
        'X',
        { duration: 10000 }
      )
    })

    it('should not warn when both the partner and the course are active', () => {
      component.extContentReadData = { contentPartner: { isActive: true }, isActive: true }
      component.initializeDiscussData()
      expect(snackBarMock.open).not.toHaveBeenCalled()
    })

    it('should do nothing further when the config has no discuss widget data', () => {
      component.extContentReadData = { contentPartner: { isActive: true }, isActive: true }
      component.config = {}
      component.initializeDiscussData()
      expect(component.widgetData).toBeUndefined()
    })

    it('should stamp the content id onto the comment tree data', () => {
      component.extContentReadData = {
        contentId: 'c-42',
        isActive: true,
        contentPartner: { isActive: true, providerTips: [{ tip: 'a' }] },
      }
      component.config = { discussWidgetData: buildDiscussWidgetData() }
      component.initializeDiscussData()
      expect(component.discussWidgetData.newCommentSection.commentTreeData.entityId).toBe('c-42')
      expect(component.discussWidgetData.commentsList.repliesSection.newCommentReply.commentTreeData.entityId)
        .toBe('c-42')
    })

    it('should skip the replies section when it is absent', () => {
      const widget: any = buildDiscussWidgetData()
      delete widget.commentsList.repliesSection
      component.extContentReadData = { contentId: 'c-42', isActive: true, contentPartner: { isActive: true } }
      component.config = { discussWidgetData: widget }
      component.initializeDiscussData()
      expect(component.discussWidgetData.newCommentSection.commentTreeData.entityId).toBe('c-42')
    })

    it('should not stamp the content id when the content has none', () => {
      component.extContentReadData = { isActive: true, contentPartner: { isActive: true } }
      component.config = { discussWidgetData: buildDiscussWidgetData() }
      component.initializeDiscussData()
      expect(component.discussWidgetData.newCommentSection.commentTreeData.entityId).toBe('')
    })

    it('should build the provider tips widget data', () => {
      component.extContentReadData = {
        contentId: 'c-42',
        isActive: true,
        contentPartner: { isActive: true, providerTips: [{ tip: 'a' }] },
      }
      component.config = { discussWidgetData: buildDiscussWidgetData(), extra: 'x' }
      component.initializeDiscussData()
      expect(component.widgetData).toEqual(expect.objectContaining({
        type: 'tips',
        cardClass: 'slider-container',
        height: 'auto',
        sliderData: [{ tip: 'a' }],
        extra: 'x',
      }))
    })

    it('should show provider tips for a user who is not enrolled', () => {
      component.extContentReadData = {
        contentId: 'c-42',
        isActive: true,
        contentPartner: { isActive: true, providerTips: [{ tip: 'a' }] },
      }
      component.config = { discussWidgetData: buildDiscussWidgetData() }
      component.userExtCourseEnroll = {}
      component.initializeDiscussData()
      expect(component.showProviderTips).toBeTruthy()
    })

    it('should show provider tips for an enrolled user without certificates', () => {
      component.extContentReadData = {
        contentId: 'c-42',
        isActive: true,
        contentPartner: { isActive: true, providerTips: [{ tip: 'a' }] },
      }
      component.config = { discussWidgetData: buildDiscussWidgetData() }
      component.userExtCourseEnroll = { issued_certificates: [], progress: 40 }
      component.initializeDiscussData()
      expect(component.showProviderTips).toBeTruthy()
    })

    it('should hide provider tips for an enrolled user holding a certificate', () => {
      component.extContentReadData = {
        contentId: 'c-42',
        isActive: true,
        contentPartner: { isActive: true, providerTips: [{ tip: 'a' }] },
      }
      component.config = { discussWidgetData: buildDiscussWidgetData() }
      component.userExtCourseEnroll = { issued_certificates: [{ identifier: 'cert' }], progress: 100 }
      component.initializeDiscussData()
      expect(component.showProviderTips).toBeFalsy()
    })

    it('should hide provider tips when the partner publishes none', () => {
      component.extContentReadData = { contentId: 'c-42', isActive: true, contentPartner: { isActive: true } }
      component.config = { discussWidgetData: buildDiscussWidgetData() }
      component.initializeDiscussData()
      expect(component.showProviderTips).toBeFalsy()
    })

    it('should open the discussion box for an enrolled user', () => {
      component.extContentReadData = { contentId: 'c-42', isActive: true, contentPartner: { isActive: true } }
      component.config = { discussWidgetData: buildDiscussWidgetData() }
      component.userExtCourseEnroll = { progress: 10 }
      component.initializeDiscussData()
      expect(component.discussWidgetData.enrolledContent).toBe(true)
      expect(component.discussWidgetData.newCommentSection.commentBox.placeholder).toBe('Start a discussion')
    })

    it('should prompt an unenrolled user to enrol before commenting', () => {
      component.extContentReadData = { contentId: 'c-42', isActive: true, contentPartner: { isActive: true } }
      component.config = { discussWidgetData: buildDiscussWidgetData() }
      component.userExtCourseEnroll = {}
      component.initializeDiscussData()
      expect(component.discussWidgetData.enrolledContent).toBe(false)
      expect(component.discussWidgetData.newCommentSection.commentBox.placeholder).toBe('Enrol to add your comments')
    })
  })

  describe('handleCapitalize', () => {
    it('should delegate to the common methods service', () => {
      expect(component.handleCapitalize('some text', 'title')).toBe('Capitalized')
      expect(commonSvcMock.handleCapitalize).toHaveBeenCalledWith('some text', 'title')
    })

    it('should delegate without a type', () => {
      component.handleCapitalize('some text')
      expect(commonSvcMock.handleCapitalize).toHaveBeenCalledWith('some text', undefined)
    })
  })

  describe('translateLabels', () => {
    it('should delegate to the multilingual translations service', () => {
      expect(component.translateLabels('label', 'type')).toBe('translated')
      expect(langtranslationsMock.translateLabel).toHaveBeenCalledWith('label', 'type', '')
    })
  })

  describe('ngAfterViewInit', () => {
    it('should measure the right container', () => {
      component.rcElement = { nativeElement: { offsetTop: 120, offsetHeight: 300, style: {} } } as any
      component.ngAfterViewInit()
      expect(component.rcElem).toEqual({ offSetTop: 120, BottomPos: 420 })
    })

    it('should leave the measurements untouched without a right container', () => {
      component.ngAfterViewInit()
      expect(component.rcElem).toEqual({ offSetTop: 0, BottomPos: 0 })
    })
  })

  describe('handleScroll', () => {
    beforeEach(() => {
      component.rcElement = { nativeElement: { style: { position: '' } } } as any
      component.rcElem = { offSetTop: 100, BottomPos: 400 }
    })

    it('should stick the container once the scroll limit is passed', () => {
      component.scrollLimit = 500
      setWindowProp('scrollY', 200)
      component.handleScroll()
      expect(component.rcElement.nativeElement.style.position).toBe('sticky')
    })

    it('should fix the container while above the scroll limit', () => {
      component.scrollLimit = 1000
      setWindowProp('scrollY', 100)
      component.handleScroll()
      expect(component.rcElement.nativeElement.style.position).toBe('fixed')
    })

    it('should not reposition the container without a scroll limit', () => {
      component.scrollLimit = undefined
      setWindowProp('scrollY', 100)
      component.handleScroll()
      expect(component.rcElement.nativeElement.style.position).toBe('')
    })

    it('should flag the page as scrolled past the container offset', () => {
      setWindowProp('scrollY', 300)
      component.handleScroll()
      expect(component.scrolled).toBe(true)
    })

    it('should clear the scrolled flag near the top of the page', () => {
      setWindowProp('scrollY', 50)
      component.handleScroll()
      expect(component.scrolled).toBe(false)
    })
  })

  describe('redirectToContent', () => {
    it('should substitute the username placeholder with the user email', () => {
      const url = component.redirectToContent({ redirectUrl: 'https://partner.com/login?u=<username>' })
      expect(url).toBe('https://partner.com/login?u=user@test.com')
    })
  })

  describe('replaceText', () => {
    it('should strip every occurrence of the given text', () => {
      expect(component.replaceText('a-b-c', '-')).toBe('abc')
    })
  })

  describe('formatcourseProviders', () => {
    it('should join the provider names', () => {
      expect(component.formatcourseProviders([{ name: 'A' }, { name: 'B' }])).toBe('A, B')
    })

    it('should return an empty string for an empty list', () => {
      expect(component.formatcourseProviders([])).toBe('')
    })

    it('should return an empty string when the providers are missing', () => {
      expect(component.formatcourseProviders(null as any)).toBe('')
    })

    it('should return an empty string when the providers are not an array', () => {
      expect(component.formatcourseProviders({ name: 'A' } as any)).toBe('')
    })
  })

  describe('enRollToExtCourse', () => {
    /** The course on screen; both ids are needed for the deduction rule call. */
    const extContent = { contentId: 'c1', contentPartner: { id: 'p1' } }

    /** Points the deduction rule API answers with for this user and course. */
    const setRequiredKarmaPoints = (requiredKarmaPoints: any) => {
      certSvcMock.getKarmaPointsDeductionRule.mockReturnValue(of({ result: { requiredKarmaPoints } }))
    }

    beforeEach(() => {
      // The skip paths open the consent dialog straight away - stop there.
      jest.spyOn(component, 'callConsentApi').mockImplementation(() => { })
      component.extContentReadData = { ...extContent }
    })

    it('should ask the deduction rule api for the points of this course', async () => {
      setRequiredKarmaPoints(25)
      await component.enRollToExtCourse(extContent)
      expect(certSvcMock.getKarmaPointsDeductionRule).toHaveBeenCalledWith('c1', 'p1')
      expect(component.requiredKarmaPoints).toBe(25)
    })

    it('should build the karma redeem data from the popup config', async () => {
      setRequiredKarmaPoints(25)
      component.config = {
        karmaRedeemPopup: {
          popupHeader: 'Redeem?',
          message: 'Spend {points} coins to unlock',
          acceptButton: 'Yes',
          cancelButton: 'No',
        },
      }
      await component.enRollToExtCourse(extContent)
      expect(component.karmaRedeemData).toEqual({
        requiredKarmaPoints: 25,
        header: 'Redeem?',
        message: 'Spend 25 coins to unlock',
        acceptButton: 'Yes',
        cancelButton: 'No',
      })
    })

    it('should skip the popup and open consent when the rule returns no karma points', async () => {
      component.config = {}
      await component.enRollToExtCourse(extContent)
      expect(component.karmaRedeemData).toBeNull()
      expect(matDialogMock.open).toHaveBeenCalled()
    })

    it('should skip the popup and open consent when the karma points are zero', async () => {
      setRequiredKarmaPoints(0)
      component.config = {}
      await component.enRollToExtCourse(extContent)
      expect(component.karmaRedeemData).toBeNull()
      expect(matDialogMock.open).toHaveBeenCalled()
    })

    it('should ignore the content own required karma points', async () => {
      setRequiredKarmaPoints(0)
      component.config = {}
      await component.enRollToExtCourse({ ...extContent, requiredKarmaPoints: 25 })
      expect(component.karmaRedeemData).toBeNull()
      expect(matDialogMock.open).toHaveBeenCalled()
    })

    it('should show the popup whatever group the user belongs to', async () => {
      setRequiredKarmaPoints(25)
      configSvcMock.unMappedUser = {
        identifier: 'USER-1',
        profileDetails: { professionalDetails: [{ group: 'Group A' }] },
      }
      component.config = {}
      await component.enRollToExtCourse(extContent)
      expect(component.karmaRedeemData.requiredKarmaPoints).toBe(25)
      expect(matDialogMock.open).not.toHaveBeenCalled()
    })

    it('should skip the popup when the rule call fails', async () => {
      certSvcMock.getKarmaPointsDeductionRule.mockReturnValue(throwError({ error: 'boom' }))
      component.config = {}
      await component.enRollToExtCourse(extContent)
      expect(component.requiredKarmaPoints).toBe(0)
      expect(component.karmaRedeemData).toBeNull()
      expect(matDialogMock.open).toHaveBeenCalled()
    })

    it('should not call the rule without a course and partner id', async () => {
      certSvcMock.getKarmaPointsDeductionRule.mockClear()
      await component.enRollToExtCourse({ contentId: 'c1' })
      expect(certSvcMock.getKarmaPointsDeductionRule).not.toHaveBeenCalled()
      expect(matDialogMock.open).toHaveBeenCalled()
    })

    it('should ask the rule only once per page', async () => {
      setRequiredKarmaPoints(25)
      certSvcMock.getKarmaPointsDeductionRule.mockClear()
      await component.enRollToExtCourse(extContent)
      component.onKarmaRedeemClosed(false)
      await component.enRollToExtCourse(extContent)
      expect(certSvcMock.getKarmaPointsDeductionRule).toHaveBeenCalledTimes(1)
      expect(component.karmaRedeemData.requiredKarmaPoints).toBe(25)
    })

    it('should tolerate a null karma popup config', async () => {
      setRequiredKarmaPoints(5)
      component.config = { karmaRedeemPopup: null }
      await component.enRollToExtCourse(extContent)
      expect(component.karmaRedeemData.requiredKarmaPoints).toBe(5)
    })

    const karmaRedeemEvent = () => eventsMock.dispatchEvent.mock.calls[0][0]

    it('should raise continue telemetry with the content id and the ext toc pageid', async () => {
      setRequiredKarmaPoints(25)
      await component.enRollToExtCourse(extContent)
      eventsMock.dispatchEvent.mockClear()

      component.onKarmaRedeemClosed(true)

      expect(karmaRedeemEvent().data.edata).toEqual({
        type: 'click',
        subType: 'redeem-karma-coins-continue',
        id: extContent.contentId,
        pageid: 'app/toc/ext',
      })
      expect(karmaRedeemEvent().data.eventSubType).toBe('Interact')
    })

    it('should send the marketplace env and the ext toc pageid on the event itself', async () => {
      setRequiredKarmaPoints(25)
      await component.enRollToExtCourse(extContent)
      eventsMock.dispatchEvent.mockClear()

      component.onKarmaRedeemClosed(true)

      // the listener reads env off the top level pageContext and pageid off the one under data
      expect(karmaRedeemEvent().pageContext).toEqual({ pageId: 'app/toc/ext', module: 'Marketplace' })
      expect(karmaRedeemEvent().data.pageContext).toEqual({ pageId: 'app/toc/ext', module: 'Marketplace' })
    })

    it('should raise cancel telemetry when the popup is dismissed', async () => {
      setRequiredKarmaPoints(25)
      await component.enRollToExtCourse(extContent)
      eventsMock.dispatchEvent.mockClear()

      component.onKarmaRedeemClosed(false)

      expect(karmaRedeemEvent().data.edata.subType).toBe('redeem-karma-coins-cancel')
      expect(karmaRedeemEvent().data.edata.id).toBe(extContent.contentId)
    })

    it('should raise exactly one event per close, on either button', async () => {
      setRequiredKarmaPoints(25)
      await component.enRollToExtCourse(extContent)
      eventsMock.dispatchEvent.mockClear()
      component.onKarmaRedeemClosed(true)
      expect(eventsMock.dispatchEvent).toHaveBeenCalledTimes(1)

      await component.enRollToExtCourse(extContent)
      eventsMock.dispatchEvent.mockClear()
      component.onKarmaRedeemClosed(false)
      expect(eventsMock.dispatchEvent).toHaveBeenCalledTimes(1)
    })

    it('should send an empty id when the popup closes with no content held', () => {
      eventsMock.dispatchEvent.mockClear()

      component.onKarmaRedeemClosed(false)

      expect(karmaRedeemEvent().data.edata.id).toBe('')
    })

    it('should remember the content being redeemed', async () => {
      setRequiredKarmaPoints(5)
      const content = { ...extContent }
      await component.enRollToExtCourse(content)
      expect((component as any).karmaRedeemContent).toBe(content)
    })

    it('should replace every points placeholder in the message template', async () => {
      setRequiredKarmaPoints(7)
      component.config = { karmaRedeemPopup: { message: '{points} coins now, {points} coins total' } }
      await component.enRollToExtCourse(extContent)
      expect(component.karmaRedeemData.message).toBe('7 coins now, 7 coins total')
    })

    it('should assemble the message from the before and after text', async () => {
      setRequiredKarmaPoints(12)
      component.config = {
        karmaRedeemPopup: { pointsBeforeText: 'Redeem', pointsAfterText: 'Karma Coins to unlock' },
      }
      await component.enRollToExtCourse(extContent)
      expect(component.karmaRedeemData.message).toBe('Redeem 12 Karma Coins to unlock')
    })

    it('should assemble the message from the before text alone', async () => {
      setRequiredKarmaPoints(12)
      component.config = { karmaRedeemPopup: { pointsBeforeText: 'Redeem' } }
      await component.enRollToExtCourse(extContent)
      expect(component.karmaRedeemData.message).toBe('Redeem 12')
    })

    it('should assemble the message from the after text alone', async () => {
      setRequiredKarmaPoints(12)
      component.config = { karmaRedeemPopup: { pointsAfterText: 'Karma Coins' } }
      await component.enRollToExtCourse(extContent)
      expect(component.karmaRedeemData.message).toBe('12 Karma Coins')
    })
  })

  describe('onKarmaRedeemClosed', () => {
    beforeEach(async () => {
      component.config = { contentConsent: { consentDocUrl: '/consent.html', assetsDocUrl: '/assets.html' } }
      jest.spyOn(component, 'callConsentApi').mockImplementation(() => { })
      certSvcMock.getKarmaPointsDeductionRule.mockReturnValue(of({ result: { requiredKarmaPoints: 5 } }))
      await component.enRollToExtCourse({ contentId: 'c1', contentPartner: { id: 'p1' } })
    })

    it('should clear the dialog state and open the consent dialog on confirm', () => {
      component.onKarmaRedeemClosed(true)
      expect(component.karmaRedeemData).toBeNull()
      expect((component as any).karmaRedeemContent).toBeNull()
      expect(matDialogMock.open).toHaveBeenCalled()
    })

    it('should only clear the dialog state on cancel', () => {
      component.onKarmaRedeemClosed(false)
      expect(component.karmaRedeemData).toBeNull()
      expect(matDialogMock.open).not.toHaveBeenCalled()
    })

    it('should do nothing when there is no pending content', () => {
      component.onKarmaRedeemClosed(false)
      component.onKarmaRedeemClosed(true)
      expect(matDialogMock.open).not.toHaveBeenCalled()
    })
  })

  describe('showKarmaRedeemDialog', () => {
    it('should stay hidden with no redeem data at all', () => {
      expect(component.showKarmaRedeemDialog).toBe(false)
    })

    it('should stay hidden when the rule asked for zero coins', () => {
      component.karmaRedeemData = { requiredKarmaPoints: 0 }
      expect(component.showKarmaRedeemDialog).toBe(false)
    })

    it('should stay hidden when the rule gave no number at all', () => {
      component.karmaRedeemData = { header: 'Redeem?' }
      expect(component.showKarmaRedeemDialog).toBe(false)
    })

    it('should show once there are coins to redeem', () => {
      component.karmaRedeemData = { requiredKarmaPoints: 25 }
      expect(component.showKarmaRedeemDialog).toBe(true)
    })
  })

  describe('openConsentDialog', () => {
    let consentSpy: jest.SpyInstance

    const openDialog = async (content: any = { contentId: 'c1', contentPartner: { id: 'p1' } }) => {
      await (component as any).openConsentDialog(content)
    }

    beforeEach(() => {
      consentSpy = jest.spyOn(component, 'callConsentApi').mockImplementation(() => { })
    })

    it('should open the consent dialog with the resolved urls', async () => {
      component.config = { contentConsent: { consentDocUrl: '/consent.html', assetsDocUrl: '/assets.html' } }
      await openDialog()
      expect(matDialogMock.open).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        width: '900px',
        height: '70vh',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'consent-dialog-panel',
        data: {
          consentUrl: 'https://karmayogi.in/consent.html',
          assetsDocUrl: '/assets.html',
        },
      }))
    })

    it('should submit the consent when the user agrees', async () => {
      await openDialog()
      expect(consentSpy).toHaveBeenCalledWith({ contentId: 'c1', contentPartner: { id: 'p1' } })
    })

    it('should warn the user when they decline the terms', async () => {
      matDialogMock.open.mockReturnValue({ afterClosed: () => of(false) })
      await openDialog()
      expect(consentSpy).not.toHaveBeenCalled()
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'You must agree to the terms to enroll in this course.',
        'X',
        { duration: 5000 }
      )
    })

    it('should treat a dismissed dialog as a decline', async () => {
      matDialogMock.open.mockReturnValue({ afterClosed: () => of(undefined) })
      await openDialog()
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'You must agree to the terms to enroll in this course.',
        'X',
        { duration: 5000 }
      )
    })
  })

  describe('callConsentApi', () => {
    it('should post the consent request for the content', () => {
      component.config = { contentConsent: { consentId: 'consent-1' } }
      jest.spyOn(component as any, 'proceedWithEnrollment').mockResolvedValue(undefined)
      component.callConsentApi({ contentId: 'c1' })
      expect(certSvcMock.consentSubmit).toHaveBeenCalledWith(expect.objectContaining({
        request: expect.objectContaining({
          contentId: 'c1',
          consentId: 'consent-1',
        }),
      }))
    })

    it('should default the consent id when the config has none', () => {
      jest.spyOn(component as any, 'proceedWithEnrollment').mockResolvedValue(undefined)
      component.callConsentApi({ contentId: 'c1' })
      expect(certSvcMock.consentSubmit).toHaveBeenCalledWith(expect.objectContaining({
        request: expect.objectContaining({ consentId: '' }),
      }))
    })

    it('should proceed with the enrollment when the consent succeeds', () => {
      const proceedSpy = jest.spyOn(component as any, 'proceedWithEnrollment').mockResolvedValue(undefined)
      component.callConsentApi({ contentId: 'c1' })
      expect(proceedSpy).toHaveBeenCalledWith({ contentId: 'c1' })
    })

    it('should surface the api error message when the consent fails', () => {
      certSvcMock.consentSubmit.mockReturnValue(throwError({ error: { params: { msg: 'consent rejected' } } }))
      component.callConsentApi({ contentId: 'c1' })
      expect(snackBarMock.open).toHaveBeenCalledWith('consent rejected', 'X', { duration: 5000 })
    })

    it('should fall back to a default message when the consent fails without one', () => {
      certSvcMock.consentSubmit.mockReturnValue(throwError({}))
      component.callConsentApi({ contentId: 'c1' })
      expect(snackBarMock.open).toHaveBeenCalledWith('Unable to submit consent', 'X', { duration: 5000 })
    })
  })

  describe('proceedWithEnrollment', () => {
    const content = { contentId: 'c1', contentPartner: { id: 'p1' } }

    beforeEach(() => {
      component.discussWidgetData = buildDiscussWidgetData() as any
    })

    it('should show the loader and post the enrollment request', async () => {
      jest.spyOn(component, 'getUserContentEnroll').mockResolvedValue(undefined)
      await (component as any).proceedWithEnrollment(content)
      expect(loaderMock.changeLoad.next).toHaveBeenCalledWith(true)
      expect(contentSvcMock.extContentEnroll).toHaveBeenCalledWith({ courseId: 'c1', partnerId: 'p1' })
    })

    it('should open the discussion box and fetch the enrollment on success', async () => {
      const fetchSpy = jest.spyOn(component, 'getUserContentEnroll').mockResolvedValue(undefined)
      const netCoreSpy = jest.spyOn(component, 'contentViewEventForNetCore')
      await (component as any).proceedWithEnrollment(content)
      expect(component.discussWidgetData.enrolledContent).toBe(true)
      expect(component.discussWidgetData.newCommentSection.commentBox.placeholder).toBe('Start a discussion')
      expect(fetchSpy).toHaveBeenCalledWith('c1')
      expect(netCoreSpy).toHaveBeenCalledWith('enroll')
    })

    it('should hide the loader and warn when the enrollment returns no result', async () => {
      contentSvcMock.extContentEnroll.mockReturnValue(of({ result: {} }))
      await (component as any).proceedWithEnrollment(content)
      expect(loaderMock.changeLoad.next).toHaveBeenLastCalledWith(false)
      expect(snackBarMock.open).toHaveBeenCalledWith('Unable to enroll to the content', 'X', { duration: 10000 })
    })

    it('should surface the api error message when the enrollment fails', async () => {
      contentSvcMock.extContentEnroll.mockReturnValue(
        throwError({ error: { params: { msg: 'already enrolled' } } })
      )
      await (component as any).proceedWithEnrollment(content)
      expect(snackBarMock.open).toHaveBeenCalledWith('already enrolled', 'X', { duration: 10000 })
    })
  })

  describe('getUserContentEnroll', () => {
    it('should store the enrollment and confirm it to the user', async () => {
      const telemetrySpy = jest.spyOn(component, 'telemetryToCaptureInteract')
      await component.getUserContentEnroll('c1')
      expect(component.userExtCourseEnroll).toEqual({ progress: 10 })
      expect(loaderMock.changeLoad.next).toHaveBeenCalledWith(false)
      expect(telemetrySpy).toHaveBeenCalledWith('c1', 'enroll', 'enrol-content')
      expect(snackBarMock.open).toHaveBeenCalledWith('Successfully enrolled in the course.')
    })

    it('should warn when the enrollment details come back empty', async () => {
      contentSvcMock.fetchExtUserContentEnroll.mockReturnValue(of({ result: {} }))
      await component.getUserContentEnroll('c1')
      expect(snackBarMock.open).toHaveBeenCalledWith('Unable to get the enrolled details')
    })

    it('should warn when the enrollment request fails', async () => {
      contentSvcMock.fetchExtUserContentEnroll.mockReturnValue(throwError('boom'))
      await component.getUserContentEnroll('c1')
      expect(loaderMock.changeLoad.next).toHaveBeenCalledWith(false)
      expect(snackBarMock.open).toHaveBeenCalledWith('Unable to get the enrolled details')
    })
  })

  describe('telemetry', () => {
    it('should dispatch a loaded event on start', () => {
      component.raiseTelemtryStartEvent()
      expect(eventsMock.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'telemetry',
        eventLogLevel: 'info',
        from: 'test',
        data: expect.objectContaining({ state: 'loaded', type: 'session', mode: 'view' }),
      }))
    })

    it('should dispatch an unloaded event on end', () => {
      component.raiseTelemtryEndEvent()
      expect(eventsMock.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ state: 'unloaded' }),
      }))
    })

    it('should raise an interact telemetry event', () => {
      component.telemetryToCaptureInteract('c1', 'redirect', 'redirect-content')
      expect(eventsMock.raiseInteractTelemetry).toHaveBeenCalledWith(
        { type: 'click', subType: 'redirect', id: 'redirect-content' },
        { id: 'c1', type: 'External content' },
        { module: 'Home' }
      )
    })

    it('should bracket the redirect telemetry with start and end events', () => {
      component.captureRedirectTelemetry({ contentId: 'c1' })
      expect(eventsMock.dispatchEvent).toHaveBeenCalledTimes(2)
      expect(eventsMock.raiseInteractTelemetry).toHaveBeenCalledWith(
        expect.objectContaining({ subType: 'redirect' }),
        expect.objectContaining({ id: 'c1' }),
        expect.anything()
      )
    })
  })

  describe('downloadCert', () => {
    beforeEach(() => {
      component.extContentReadData = { certificateObj: { data: {} } }
      component.userExtCourseEnroll = { issued_certificates: [{ identifier: 'cert-1' }] }
    })

    it('should build the certificate object from the download response', async () => {
      await component.downloadCert()
      expect(certSvcMock.downloadCertificate_v2).toHaveBeenCalledWith('cert-1')
      expect(component.extContentReadData.certificateObj).toEqual({
        data: { identifier: 'cert-1' },
        certData: 'print-uri',
        certId: 'cert-1',
      })
      expect(component.downloadCertificateLoading).toBe(false)
    })

    it('should stop the loader when the certificate response is empty', async () => {
      certSvcMock.downloadCertificate_v2.mockReturnValue(of({ result: {} }))
      await component.downloadCert()
      expect(component.downloadCertificateLoading).toBe(false)
      expect(component.extContentReadData.certificateObj).toEqual({ data: {} })
    })

    it('should stop the loader when the certificate request fails', async () => {
      certSvcMock.downloadCertificate_v2.mockReturnValue(throwError('boom'))
      await component.downloadCert()
      expect(component.downloadCertificateLoading).toBe(false)
    })
  })

  describe('share', () => {
    it('should enable sharing', () => {
      component.onClickOfShare()
      expect(component.enableShare).toBe(true)
    })

    it('should reset sharing', () => {
      component.enableShare = true
      component.resetEnableShare({})
      expect(component.enableShare).toBe(false)
    })
  })

  describe('contentViewEventForNetCore', () => {
    const activeNetcoreConfig = {
      netcoreWebConfig: {
        isActive: true,
        events: { content_view: { isActive: true } },
      },
    }

    beforeEach(() => {
      configSvcMock.netcoreConfig = activeNetcoreConfig
    })

    it('should do nothing when netcore is not configured', () => {
      configSvcMock.netcoreConfig = null
      component.contentViewEventForNetCore('view')
      expect(netCoreServiceMock.trackEventForContentAndEvent).not.toHaveBeenCalled()
    })

    it('should do nothing when netcore is inactive', () => {
      configSvcMock.netcoreConfig = { netcoreWebConfig: { isActive: false } }
      component.contentViewEventForNetCore('view')
      expect(netCoreServiceMock.trackEventForContentAndEvent).not.toHaveBeenCalled()
    })

    it('should do nothing when the content view event is inactive', () => {
      configSvcMock.netcoreConfig = {
        netcoreWebConfig: { isActive: true, events: { content_view: { isActive: false } } },
      }
      component.contentViewEventForNetCore('view')
      expect(netCoreServiceMock.trackEventForContentAndEvent).not.toHaveBeenCalled()
    })

    it('should track a content view with the full payload', () => {
      component.extContentReadData = {
        name: 'Course A',
        externalId: 'ext-1',
        appIcon: 'icon.png',
        duration: '3600',
        avgRating: 4.5,
        totalNoOfRating: 10,
        source: 'Partner A',
      }
      component.contentViewEventForNetCore('view')
      expect(netCoreServiceMock.trackEventForContentAndEvent).toHaveBeenCalledWith(
        'content_view',
        'user-1',
        expect.objectContaining({
          content_name: 'Course A',
          content_category: 'External Course',
          content_id: 'ext-1',
          content_image: 'icon.png',
          content_duration: 3600,
          content_rating: 4.5,
          no_users_rated: 10,
          content_provider_name: 'Partner A',
          learning_path_content: false,
        })
      )
    })

    it('should track a content enrolment', () => {
      component.contentViewEventForNetCore('enroll')
      expect(netCoreServiceMock.trackEventForContentAndEvent).toHaveBeenCalledWith(
        'content_enrolment',
        'user-1',
        expect.any(Object)
      )
    })

    it('should track a content completion', () => {
      component.contentViewEventForNetCore('completion')
      expect(netCoreServiceMock.trackEventForContentAndEvent).toHaveBeenCalledWith(
        'content_completion',
        'user-1',
        expect.any(Object)
      )
    })

    it('should not track an unknown event type', () => {
      component.contentViewEventForNetCore('unknown')
      expect(netCoreServiceMock.trackEventForContentAndEvent).not.toHaveBeenCalled()
    })

    it('should default the duration to zero when the content has none', () => {
      component.extContentReadData = { name: 'Course A' }
      component.contentViewEventForNetCore('view')
      expect(netCoreServiceMock.trackEventForContentAndEvent).toHaveBeenCalledWith(
        'content_view',
        'user-1',
        expect.objectContaining({ content_duration: 0 })
      )
    })

    it('should default the duration to zero when it is not a positive number', () => {
      component.extContentReadData = { duration: 'not-a-number' }
      component.contentViewEventForNetCore('view')
      expect(netCoreServiceMock.trackEventForContentAndEvent).toHaveBeenCalledWith(
        'content_view',
        'user-1',
        expect.objectContaining({ content_duration: 0 })
      )
    })

    it('should fall back to the content partner name as the provider', () => {
      component.extContentReadData = { contentPartner: { contentPartnerName: 'Partner B' } }
      component.contentViewEventForNetCore('view')
      expect(netCoreServiceMock.trackEventForContentAndEvent).toHaveBeenCalledWith(
        'content_view',
        'user-1',
        expect.objectContaining({ content_provider_name: 'Partner B' })
      )
    })

    it('should fall back to Karmayogi Bharat when no provider is known', () => {
      component.extContentReadData = {}
      component.contentViewEventForNetCore('view')
      expect(netCoreServiceMock.trackEventForContentAndEvent).toHaveBeenCalledWith(
        'content_view',
        'user-1',
        expect.objectContaining({ content_provider_name: 'Karmayogi Bharat' })
      )
    })

    it('should flag learning path content for an enrolled user', () => {
      component.userExtCourseEnroll = { progress: 20 }
      component.contentViewEventForNetCore('view')
      expect(netCoreServiceMock.trackEventForContentAndEvent).toHaveBeenCalledWith(
        'content_view',
        'user-1',
        expect.objectContaining({ learning_path_content: true })
      )
    })
  })

  describe('secondsToTime', () => {
    it('should format hours, minutes and seconds', () => {
      expect(component.secondsToTime(7325)).toBe('2 hours, 2 minutes, 5 seconds')
    })

    it('should use singular units for a single hour, minute and second', () => {
      expect(component.secondsToTime(3661)).toBe('1 hour, 1 minute, 1 second')
    })

    it('should format minutes only', () => {
      expect(component.secondsToTime(120)).toBe('2 minutes, ')
    })

    it('should return an empty string for zero seconds', () => {
      expect(component.secondsToTime(0)).toBe('')
    })

    it('should accept a numeric string', () => {
      expect(component.secondsToTime('60')).toBe('1 minute, ')
    })
  })

  describe('clearCommentIdFromUrl', () => {
    it('should clear the comment id', () => {
      component.commentId = 'comment-9'
      component.clearCommentIdFromUrl()
      expect(component.commentId).toBe('')
    })

    it('should leave the route query params untouched', () => {
      routeMock.snapshot.queryParams = { commentId: 'comment-9', other: 'x' }
      component.clearCommentIdFromUrl()
      expect(routeMock.snapshot.queryParams).toEqual({ commentId: 'comment-9', other: 'x' })
    })
  })

  describe('validateEnrollmentEligibility', () => {
    const callValidate = () => (component as any).validateEnrollmentEligibility()

    beforeEach(() => {
      component.userExtCourseEnroll = {}
      component.extContentReadData = { contentId: 'c1', contentPartner: { id: 'p1' } }
      certSvcMock.validateEnrollmentEligibility.mockClear()
    })

    it('should allow enrolling when the validation succeeds', () => {
      callValidate()
      expect(component.canEnroll).toBe(true)
      expect(component.enrollValidationLoading).toBe(false)
    })

    it('should clear a previous restriction message when the validation succeeds', () => {
      component.enrollRestrictionMessage = 'stale message'
      callValidate()
      expect(component.enrollRestrictionMessage).toBe('')
    })

    it('should block enrolling and surface the error message when the validation fails', () => {
      certSvcMock.validateEnrollmentEligibility.mockReturnValue(
        throwError({ error: { params: { msg: 'not eligible' } } })
      )
      callValidate()
      expect(component.canEnroll).toBe(false)
      expect(component.enrollValidationLoading).toBe(false)
      expect(snackBarMock.open).toHaveBeenCalledWith('not eligible', 'X', { duration: 10000 })
    })

    it('should keep the error message for the restricted badge tooltip', () => {
      certSvcMock.validateEnrollmentEligibility.mockReturnValue(
        throwError({ error: { params: { msg: 'Access settings are enabled but no access rule found for the course' } } })
      )
      callValidate()
      expect(component.enrollRestrictionMessage)
        .toBe('Access settings are enabled but no access rule found for the course')
    })

    it('should fall back to a default message when the validation fails without one', () => {
      certSvcMock.validateEnrollmentEligibility.mockReturnValue(throwError({}))
      callValidate()
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'Unable to validate enrollment eligibility',
        'X',
        { duration: 10000 }
      )
      expect(component.enrollRestrictionMessage).toBe('Unable to validate enrollment eligibility')
    })

    it('should skip the validation for an already enrolled user', () => {
      component.userExtCourseEnroll = { progress: 10 }
      callValidate()
      expect(certSvcMock.validateEnrollmentEligibility).not.toHaveBeenCalled()
    })

    it('should skip the validation when the content has no id', () => {
      component.extContentReadData = { contentPartner: { id: 'p1' } }
      callValidate()
      expect(certSvcMock.validateEnrollmentEligibility).not.toHaveBeenCalled()
    })

    it('should skip the validation when the content has no partner', () => {
      component.extContentReadData = { contentId: 'c1' }
      callValidate()
      expect(certSvcMock.validateEnrollmentEligibility).not.toHaveBeenCalled()
    })
  })

  describe('showBadgeIcon', () => {
    it('should hide the badge when there are no badge details', () => {
      component.extContentReadData = {}
      expect(component.showBadgeIcon()).toBe(false)
    })

    it('should hide the badge when the badge details are empty', () => {
      component.extContentReadData = { badgeDetails_v1: [] }
      expect(component.showBadgeIcon()).toBe(false)
    })

    it('should show the badge when the earning date is not enabled', () => {
      component.extContentReadData = { badgeDetails_v1: [{ badgeEarningDateEnabled: false }] }
      expect(component.showBadgeIcon()).toBe(true)
    })

    it('should show the badge when the earning date is still in the future', () => {
      component.extContentReadData = {
        badgeDetails_v1: [{ badgeEarningDateEnabled: true, badgeEarningDateTime: Date.now() + 100000 }],
      }
      expect(component.showBadgeIcon()).toBe(true)
    })

    it('should hide the badge once the earning date has passed', () => {
      component.extContentReadData = {
        badgeDetails_v1: [{ badgeEarningDateEnabled: true, badgeEarningDateTime: Date.now() - 100000 }],
      }
      expect(component.showBadgeIcon()).toBe(false)
    })

    it('should hide the badge when the earning date is enabled but missing', () => {
      component.extContentReadData = { badgeDetails_v1: [{ badgeEarningDateEnabled: true }] }
      expect(component.showBadgeIcon()).toBe(false)
    })
  })

  describe('showEnroll', () => {
    beforeEach(() => {
      component.userExtCourseEnroll = {}
      component.enrollValidationLoading = false
      component.canEnroll = true
      component.extContentReadData = { contentPartner: { isActive: true } }
    })

    it('should show the enroll action for an eligible user', () => {
      expect(component.showEnroll).toBe(true)
    })

    it('should hide the enroll action for an enrolled user', () => {
      component.userExtCourseEnroll = { progress: 10 }
      expect(component.showEnroll).toBe(false)
    })

    it('should hide the enroll action while the validation is running', () => {
      component.enrollValidationLoading = true
      expect(component.showEnroll).toBe(false)
    })

    it('should hide the enroll action when the user cannot enroll', () => {
      component.canEnroll = false
      expect(component.showEnroll).toBe(false)
    })

    it('should hide the enroll action when the partner is inactive', () => {
      component.extContentReadData = { contentPartner: { isActive: false } }
      expect(component.showEnroll).toBe(false)
    })
  })

  describe('showRedirect', () => {
    beforeEach(() => {
      component.userExtCourseEnroll = { progress: 10 }
      component.extContentReadData = {
        redirectUrl: 'https://partner.com',
        contentPartner: { isActive: true },
      }
    })

    it('should show the redirect action for an enrolled user', () => {
      expect(component.showRedirect).toBeTruthy()
    })

    it('should hide the redirect action for an unenrolled user', () => {
      component.userExtCourseEnroll = {}
      expect(component.showRedirect).toBeFalsy()
    })

    it('should hide the redirect action without a redirect url', () => {
      component.extContentReadData = { contentPartner: { isActive: true } }
      expect(component.showRedirect).toBeFalsy()
    })

    it('should hide the redirect action when the partner is inactive', () => {
      component.extContentReadData = {
        redirectUrl: 'https://partner.com',
        contentPartner: { isActive: false },
      }
      expect(component.showRedirect).toBeFalsy()
    })
  })

  describe('paid and restricted badges', () => {
    beforeEach(() => {
      component.userExtCourseEnroll = {}
      component.enrollValidationLoading = false
      component.canEnroll = true
      component.extContentReadData = { courseType: 'paid', contentPartner: { isActive: true } }
    })

    it('should tag an enrollable paid course as paid', () => {
      expect(component.showPaidBadge).toBe(true)
      expect(component.showRestrictedBadge).toBe(false)
    })

    it('should keep the paid tag for an enrolled user who can redirect', () => {
      component.userExtCourseEnroll = { progress: 10 }
      component.extContentReadData = {
        courseType: 'paid',
        redirectUrl: 'https://partner.com',
        contentPartner: { isActive: true },
      }

      expect(component.showPaidBadge).toBe(true)
      expect(component.showRestrictedBadge).toBe(false)
    })

    it('should mark a paid course the user cannot enroll in as restricted', () => {
      component.canEnroll = false

      expect(component.showPaidBadge).toBe(false)
      expect(component.showRestrictedBadge).toBe(true)
    })

    it('should show neither badge while eligibility is being validated', () => {
      component.enrollValidationLoading = true

      expect(component.showPaidBadge).toBe(false)
      expect(component.showRestrictedBadge).toBe(false)
    })

    it('should show neither badge for a free course', () => {
      component.extContentReadData = { courseType: 'free', contentPartner: { isActive: true } }

      expect(component.showPaidBadge).toBe(false)
      expect(component.showRestrictedBadge).toBe(false)
    })
  })
})
