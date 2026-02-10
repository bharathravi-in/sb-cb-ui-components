import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardKnowledgeComponent } from './card-knowledge.component'
import { RouterModule } from '@angular/router'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { DefaultThumbnailModule, PipeDurationTransformModule, PipePartialContentModule } from '@sunbird-cb/utils-v2'
import { BtnContentShareModule } from '../btn-content-share/btn-content-share.module'
import { BtnFollowModule } from '../btn-follow/btn-follow.module'
import { BtnKbAnalyticsModule } from '../btn-kb-analytics/btn-kb-analytics.module'

@NgModule({
    declarations: [CardKnowledgeComponent],
    imports: [
        CommonModule,
        RouterModule,
        DefaultThumbnailModule,
        BtnFollowModule,
        BtnContentShareModule,
        // Material Imports
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        PipeDurationTransformModule,
        BtnKbAnalyticsModule,
        PipePartialContentModule,
    ],
    exports: [CardKnowledgeComponent]
})
export class CardKnowledgeModule { }
