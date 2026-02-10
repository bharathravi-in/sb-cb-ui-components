import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PracticeComponent } from './practice.component'
import { OverviewComponent } from './components/overview/overview.component'
import { QuestionComponent } from './components/question/question.component'
import { SubmitQuizDialogComponent } from './components/submit-quiz-dialog/submit-quiz-dialog.component'

import { PipeDurationTransformModule } from './../pipes/pipe-duration-transform/pipe-duration-transform.module'
import { PipeLimitToModule } from './../pipes/pipe-limit-to/pipe-limit-to.module'
import { SkeletonLoaderModule } from './skeleton-loader/skeleton-loader.module'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'
import { MatListModule as MatListModule } from '@angular/material/list'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatProgressBarModule as MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule as MatRadioModule } from '@angular/material/radio'
import { MatSelectModule as MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatTableModule as MatTableModule } from '@angular/material/table'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'

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
    ]
})
export class PracticePlModule { }
