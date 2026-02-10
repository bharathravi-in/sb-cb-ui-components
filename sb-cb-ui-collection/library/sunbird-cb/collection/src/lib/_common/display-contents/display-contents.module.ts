import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DisplayContentsComponent } from './display-contents.component'
import { DisplayContentTypeModule } from '../display-content-type/display-content-type.module'
import { PipeDurationTransformModule, PipeLimitToModule, DefaultThumbnailModule } from '@sunbird-cb/utils-v2'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule as MatProgressBarModule } from '@angular/material/progress-bar'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [DisplayContentsComponent],
  imports: [
    CommonModule,
    DefaultThumbnailModule,
    DisplayContentTypeModule,
    PipeDurationTransformModule,
    PipeLimitToModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  exports: [
    DisplayContentsComponent,
  ],
})
export class DisplayContentsModule { }
