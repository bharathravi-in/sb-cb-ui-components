import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { BtnFullscreenComponent } from './btn-fullscreen.component'

@NgModule({
    declarations: [BtnFullscreenComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
    exports: [BtnFullscreenComponent]
})
export class BtnFullscreenModule { }
