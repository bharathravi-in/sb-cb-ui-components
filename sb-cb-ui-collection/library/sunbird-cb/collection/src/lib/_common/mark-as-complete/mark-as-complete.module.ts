import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MarkAsCompleteComponent } from './mark-as-complete.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component'
import { RouterModule } from '@angular/router'
// import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'

@NgModule({
    declarations: [MarkAsCompleteComponent, ConfirmDialogComponent],
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
    ],
    exports: [MarkAsCompleteComponent]
})
export class MarkAsCompleteModule { }
