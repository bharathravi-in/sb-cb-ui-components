import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PracticeComponent } from './practice.component'
import { OverviewComponent } from './components/overview/overview.component'
import { QuestionComponent } from './components/question/question.component'
import { SubmitQuizDialogComponent } from './components/submit-quiz-dialog/submit-quiz-dialog.component'

import { PipeDurationTransformModule } from './../pipes/pipe-duration-transform/pipe-duration-transform.module'
import { PipeLimitToModule } from './../pipes/pipe-limit-to/pipe-limit-to.module'
import { SkeletonLoaderModule } from './skeleton-loader/skeleton-loader.module'
import {
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatListModule,
  MatRadioModule,
  MatSidenavModule,
  MatTableModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatTooltipModule,
  MatChipsModule,
  MatCheckboxModule,
  MatMenuModule,
  MatSelectModule,
} from '@angular/material'

import { ResultComponent } from './components/result/result.component'
import { FillInTheBlankComponent } from './components/question/fitb/fitb.component'
import { MultipleChoiseQuesComponent } from './components/question/mcq-mca/mcq-mca.component'
import { SingleChoiseQuesComponent } from './components/question/mcq-sca/mcq-sca.component'
import { MatchTheFollowingQuesComponent } from './components/question/mtf/mtf.component'
// import { TranslateModule } from '@ngx-translate/core'
import { StandaloneAssessmentComponent } from './components/standalone-assessment/standalone-assessment.component'
import { AssessmentHeaderComponent } from './components/assessment-header/assessment-header.component'
import { AssessmentFooterComponent } from './components/assessment-footer/assessment-footer.component'
import { AssessmentQuestionContainerComponent } from './components/assessment-question-container/assessment-question-container.component'
import { AssessmentQuestionCountContainerComponent } from './components/assessment-question-count-container/assessment-question-count-container.component'
import { AssessmentPerformanceSummaryComponent } from './components/assessment-performance-summary/assessment-performance-summary.component'
import { AssessmentPerformanceInsightSummaryComponent } from './components/assessment-performance-insight-summary/assessment-performance-insight-summary.component'
import { FinalAssessmentPopupComponent } from './components/final-assessment-popup/final-assessment-popup.component'
import { QuestionSafeUrlPipe } from './question-safe-pipe.pipe'
@NgModule({
  declarations: [
    FillInTheBlankComponent,
    MatchTheFollowingQuesComponent,
    MultipleChoiseQuesComponent,
    OverviewComponent,
    PracticeComponent,
    QuestionComponent,
    ResultComponent,
    SingleChoiseQuesComponent,
    SubmitQuizDialogComponent,
    StandaloneAssessmentComponent,
    AssessmentHeaderComponent,
    AssessmentFooterComponent,
    AssessmentQuestionContainerComponent,
    AssessmentQuestionCountContainerComponent,
    AssessmentPerformanceSummaryComponent,
    AssessmentPerformanceInsightSummaryComponent,
    FinalAssessmentPopupComponent,
    QuestionSafeUrlPipe,
  ],
  entryComponents: [
    SubmitQuizDialogComponent,
    FinalAssessmentPopupComponent,
  ],
  imports: [
    CommonModule,
    PipeDurationTransformModule,
    PipeLimitToModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSidenavModule,
    MatExpansionModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatChipsModule,
    SkeletonLoaderModule,
    // TranslateModule,
    MatMenuModule,
    MatSelectModule,
  ],
  exports: [
    PracticeComponent,
    StandaloneAssessmentComponent,
    AssessmentHeaderComponent,
    AssessmentFooterComponent,
    AssessmentQuestionContainerComponent,
    AssessmentQuestionCountContainerComponent,
    AssessmentPerformanceSummaryComponent,
    AssessmentPerformanceInsightSummaryComponent,
    SkeletonLoaderModule,
    FillInTheBlankComponent,
    MatchTheFollowingQuesComponent,
    MultipleChoiseQuesComponent,
    OverviewComponent,
    PracticeComponent,
    QuestionComponent,
    ResultComponent,
  ],
})
export class PracticePlModule { }
