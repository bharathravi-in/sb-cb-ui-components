import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule as MatListModule } from '@angular/material/list'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatSlideToggleModule as MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { BtnSettingsComponent } from './btn-settings.component'

@NgModule({
    declarations: [BtnSettingsComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatListModule,
        MatTooltipModule,
    ],
    exports: [BtnSettingsComponent]
})
export class BtnSettingsModule { }
