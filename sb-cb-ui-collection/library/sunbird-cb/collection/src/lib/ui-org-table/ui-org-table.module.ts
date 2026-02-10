import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatTableModule as MatTableModule } from '@angular/material/table'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { FormsModule } from '@angular/forms'
import { MatSortModule } from '@angular/material/sort'
import { MatIconModule } from '@angular/material/icon'
import { AppButtonModule } from '../app-button/app-button.module'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { DefaultThumbnailModule, PipeCountTransformModule, PipeDurationTransformModule, PipeHtmlTagRemovalModule, PipePartialContentModule } from '@sunbird-cb/utils-v2'
import { BtnChannelAnalyticsModule } from '../btn-channel-analytics/btn-channel-analytics.module'
import { BtnContentFeedbackV2Module } from '../btn-content-feedback-v2/btn-content-feedback-v2.module'
import { BtnContentLikeModule } from '../btn-content-like/btn-content-like.module'
import { BtnContentMailMeModule } from '../btn-content-mail-me/btn-content-mail-me.module'
import { MatPaginatorModule as MatPaginatorModule } from '@angular/material/paginator'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { OrgUserTableComponent } from './user-list/org-user-table.component'
import { OrgUserTableV2Component } from './org-user-table-v2/org-user-table-v2.component'
@NgModule({
  declarations: [OrgUserTableComponent, OrgUserTableV2Component],
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    DefaultThumbnailModule, PipeCountTransformModule,
    PipeDurationTransformModule, PipeHtmlTagRemovalModule,
    PipePartialContentModule,
    BtnChannelAnalyticsModule,
    BtnContentFeedbackV2Module,
    BtnContentMailMeModule,
    BtnContentLikeModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    AppButtonModule,
    FormsModule
  ],

  exports: [OrgUserTableComponent, OrgUserTableV2Component],
})
export class UIORGTableModule { }
