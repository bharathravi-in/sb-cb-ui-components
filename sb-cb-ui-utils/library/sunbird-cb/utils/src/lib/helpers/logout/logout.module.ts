import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'

import { LogoutComponent } from './logout.component'

@NgModule({
    declarations: [LogoutComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
    ]
})
export class LogoutModule { }
