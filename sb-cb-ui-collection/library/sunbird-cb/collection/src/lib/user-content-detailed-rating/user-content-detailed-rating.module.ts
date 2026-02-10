import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserContentDetailedRatingComponent } from './user-content-detailed-rating.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule as MatProgressBarModule } from '@angular/material/progress-bar'
import { InViewPortModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [UserContentDetailedRatingComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    InViewPortModule,
    MatProgressBarModule,
  ],
  exports: [UserContentDetailedRatingComponent],
})
export class UserContentDetailedRatingModule { }
