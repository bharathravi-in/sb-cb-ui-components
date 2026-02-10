import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { BtnContentFeedbackComponent } from './btn-content-feedback.component'
import { BtnContentFeedbackDialogComponent } from './btn-content-feedback-dialog/btn-content-feedback-dialog.component'

@NgModule({
    declarations: [BtnContentFeedbackComponent, BtnContentFeedbackDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        MatDialogModule,
        MatFormFieldModule,
    ],
    exports: [BtnContentFeedbackComponent]
})
export class BtnContentFeedbackModule { }
