import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnFeatureComponent } from './btn-feature.component'
import { RouterModule } from '@angular/router'
import { MatBadgeModule } from '@angular/material/badge'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatRippleModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { WidgetUrlResolverDirective } from './widget-url-resolver.directive'

@NgModule({
    declarations: [BtnFeatureComponent, WidgetUrlResolverDirective],
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatCardModule,
        MatMenuModule,
        MatRippleModule,
        MatBadgeModule,
    ],
    exports: [BtnFeatureComponent]
})
export class BtnFeatureModule {}
