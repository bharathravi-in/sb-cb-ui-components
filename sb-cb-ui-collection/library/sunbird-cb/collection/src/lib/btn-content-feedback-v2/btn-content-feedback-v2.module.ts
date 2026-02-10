import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'

import { EditorQuillModule } from '../discussion-forum/editor-quill/editor-quill.module'

import { BtnContentFeedbackV2Component } from './components/btn-content-feedback-v2/btn-content-feedback-v2.component'
import { BtnContentFeedbackDialogV2Component } from './components/btn-content-feedback-dialog-v2/btn-content-feedback-dialog-v2.component'
import { FeedbackSnackbarComponent } from './components/feedback-snackbar/feedback-snackbar.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
    declarations: [
        BtnContentFeedbackV2Component,
        BtnContentFeedbackDialogV2Component,
        FeedbackSnackbarComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        EditorQuillModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
    ],
    exports: [
        BtnContentFeedbackV2Component,
        BtnContentFeedbackDialogV2Component,
        FeedbackSnackbarComponent,
    ]
})
export class BtnContentFeedbackV2Module { }
