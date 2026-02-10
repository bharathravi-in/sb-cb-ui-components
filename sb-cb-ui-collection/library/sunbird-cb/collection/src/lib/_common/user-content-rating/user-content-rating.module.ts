import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserContentRatingComponent } from './user-content-rating.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { InViewPortModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [UserContentRatingComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    InViewPortModule,
  ],
  exports: [UserContentRatingComponent],
})
export class UserContentRatingModule { }
