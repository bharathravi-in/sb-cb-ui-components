/*
 * Public API Surface of viewer
 */

// Main Module
export * from './lib/viewer.module'

// Main Component
export * from './lib/viewer.component'

// Viewer Resolve
export * from './lib/viewer.resolve'

// Component Modules
export * from './lib/components/viewer-top-bar/viewer-top-bar.module'
export * from './lib/components/viewer-secondary-top-bar/viewer-secondary-top-bar.module'
export * from './lib/components/player-survey/player-survey.module'
export * from './lib/components/skeleton-loader/skeleton-loader.module'

// Component (TOC doesn't have a module, exported directly)
export * from './lib/components/viewer-toc/viewer-toc.component'

// Plugin Modules (excluding rdbms-hands-on due to incompatible dependencies)
export * from './lib/plugins/audio-native/audio-native.module'
export * from './lib/plugins/certification/certification.module'
export * from './lib/plugins/class-diagram/class-diagram.module'
export * from './lib/plugins/dnd-quiz/dnd-quiz.module'
export * from './lib/plugins/hands-on/hands-on.module'
export * from './lib/plugins/html/html.module'
export * from './lib/plugins/html-picker/html-picker.module'
export * from './lib/plugins/iap/iap.module'
export * from './lib/plugins/practice/practice.module'
export * from './lib/plugins/quiz/quiz.module'
export * from './lib/plugins/resource-collection/resource-collection.module'
export * from './lib/plugins/web-module/web-module.module'
export { PracticeModule } from './lib/route-view-container/practice/practice.module'
export { PracticeComponent as PracticeRouteComponent } from './lib/route-view-container/practice/practice.component'

// Services (excluding access-control.service due to missing @ws-widget/utils dependency)
export * from './lib/viewer-data.service'
export * from './lib/viewer-util.service'
export * from './lib/pdf-scorm-data-service'
export * from './lib/viewer-header-side-bar-toggle.service'
export * from './lib/services/app-toc.service'
export * from './lib/services/mobile-apps.service'
export * from './lib/services/navigation-external.service'
export * from './lib/services/pending-function.service'
export * from './lib/services/app-pre-assessment-content-resolver.service'
export * from './lib/services/subapplication-responsd.service'

// Models
export * from './lib/models/app-toc.model'
export * from './lib/models/constant'
export * from './lib/models/mobile-events.model'

// Pipes
export * from './lib/pipes/replace-nbsp.pipe'

// Plugin Components (exported for NG3001 compliance)
export * from './lib/plugins/audio-native/audio-native.component'
export * from './lib/plugins/certification/certification.component'
export * from './lib/plugins/class-diagram/class-diagram.component'
export * from './lib/plugins/hands-on/hands-on.component'
export * from './lib/plugins/html/html.component'
export * from './lib/plugins/html-picker/html-picker.component'
export * from './lib/plugins/iap/iap.component'
export * from './lib/plugins/practice/practice.component'
export * from './lib/plugins/practice/components/assessment-footer/assessment-footer.component'
export * from './lib/plugins/practice/components/assessment-header/assessment-header.component'
export * from './lib/plugins/practice/components/assessment-performance-insight-summary/assessment-performance-insight-summary.component'
export * from './lib/plugins/practice/components/assessment-performance-summary/assessment-performance-summary.component'
export * from './lib/plugins/practice/components/assessment-question-container/assessment-question-container.component'
export * from './lib/plugins/practice/components/assessment-question-count-container/assessment-question-count-container.component'
export { StandaloneAssessmentComponent } from './lib/plugins/practice/components/standalone-assessment/standalone-assessment.component'
export { QuizComponent } from './lib/plugins/quiz/quiz.component'
export * from './lib/plugins/resource-collection/resource-collection.component'
export * from './lib/plugins/web-module/web-module.component'

// UI Components (exported for NG3001 compliance)
export * from './lib/components/player-survey/player-survey.component'
export * from './lib/components/skeleton-loader/skeleton-loader.component'
export * from './lib/components/viewer-secondary-top-bar/viewer-secondary-top-bar.component'
export * from './lib/components/viewer-top-bar/viewer-top-bar.component'

// Resolvers (excluding config-resolver due to type errors)
export * from './lib/resolvers/profile-resolver.service'


