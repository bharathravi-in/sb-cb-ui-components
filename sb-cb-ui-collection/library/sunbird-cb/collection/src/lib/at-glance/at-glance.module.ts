import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AtGlanceComponent } from './at-glance.component'
import { RouterModule } from '@angular/router'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { PipeDurationTransformModule } from '@sunbird-cb/utils-v2'

@NgModule({
    declarations: [AtGlanceComponent],
    imports: [
        CommonModule, SbUiResolverModule, RouterModule,
        MatCardModule, MatDividerModule, MatIconModule, PipeDurationTransformModule,
    ],
    exports: [AtGlanceComponent]
})
export class AtGlanceModule { }
