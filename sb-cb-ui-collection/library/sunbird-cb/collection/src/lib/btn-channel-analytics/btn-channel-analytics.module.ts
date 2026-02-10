import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnChannelAnalyticsComponent } from './btn-channel-analytics.component'
import { RouterModule } from '@angular/router'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
@NgModule({
    declarations: [BtnChannelAnalyticsComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
    ],
    exports: [BtnChannelAnalyticsComponent]
})
export class BtnChannelAnalyticsModule { }
