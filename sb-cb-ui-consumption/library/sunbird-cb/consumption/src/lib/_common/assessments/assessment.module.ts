import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatRadioModule } from '@angular/material/radio'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSlideToggleModule as MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatStepperModule } from '@angular/material/stepper'
import { MatDialogModule } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatChipsModule } from '@angular/material/chips'
import { MatCardModule } from '@angular/material/card'
import { AssessmentMainComponent } from './components/assessment-main/assessment-main.component'
import { AssessmentBasicInfoComponent } from './components/assessment-basic-info/assessment-basic-info.component'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { AssessmentSessionsComponent } from './components/assessment-sessions/assessment-sessions.component'
import { SelectQuestionModalComponent } from './components/select-question-modal/select-question-modal.component'
import { AssessmentQuestionListComponent } from './components/assessment-question-list/assessment-question-list.component'
import { AssessmentRichTextComponent } from './components/assessment-rich-text/assessment-rich-text.component'
import { CKEditorModule } from 'ng2-ckeditor'
import { MultipleChoiceQuestionComponent } from './components/multiple-choice-question/multiple-choice-question.component'
import { MatchTheFollowingComponent } from './components/match-the-following/match-the-following.component'
import { FillUpTheBlanksComponent } from './components/fill-up-the-blanks/fill-up-the-blanks.component'
import { DialogComponentsModule } from '../dialog-components/dialog-components.module'
import { BulkUploadAllTypeQuestionComponent } from './components/bulk-upload-all-type-question/bulk-upload-all-type-question.component'



@NgModule({
  declarations: [
    AssessmentMainComponent,
    AssessmentBasicInfoComponent,
    AssessmentSessionsComponent,
    SelectQuestionModalComponent,
    AssessmentQuestionListComponent,
    AssessmentRichTextComponent,
    MultipleChoiceQuestionComponent,
    MatchTheFollowingComponent,
    FillUpTheBlanksComponent,
    BulkUploadAllTypeQuestionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    CKEditorModule,
    DialogComponentsModule
  ],
  exports: [
    AssessmentMainComponent
  ]
})
export class AssessmentModule { }
