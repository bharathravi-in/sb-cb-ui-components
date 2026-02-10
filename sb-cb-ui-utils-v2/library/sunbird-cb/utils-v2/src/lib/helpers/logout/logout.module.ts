import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'

import { LogoutComponent } from './logout.component'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
    declarations: [LogoutComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        TranslateModule,
    ]
})
export class LogoutModule { }
