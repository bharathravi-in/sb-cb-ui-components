import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MarkAsCompleteComponent } from './mark-as-complete.component'
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module'
import { RouterModule } from '@angular/router'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltipModule } from '@angular/material/tooltip'
// import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'

@NgModule({
    declarations: [MarkAsCompleteComponent],
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTooltipModule,
        RouterModule,
        ConfirmDialogModule,
    ],
    exports: [MarkAsCompleteComponent]
})
export class MarkAsCompleteModule { }
