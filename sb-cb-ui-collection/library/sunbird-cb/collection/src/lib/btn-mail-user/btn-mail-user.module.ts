import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'

import { BtnMailUserComponent } from './btn-mail-user.component'
import { BtnMailUserDialogComponent } from './btn-mail-user-dialog/btn-mail-user-dialog.component'

@NgModule({
    declarations: [BtnMailUserComponent, BtnMailUserDialogComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
    ],
    exports: [BtnMailUserComponent]
})
export class BtnMailUserModule { }
