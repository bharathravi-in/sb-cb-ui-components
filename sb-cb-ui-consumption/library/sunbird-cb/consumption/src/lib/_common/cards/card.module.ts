import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule } from '@angular/material'
import { RouterModule } from '@angular/router'
import { CardResourceComponent } from './card-resource/card-resource.component'

@NgModule({
  declarations: [CardResourceComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
  ],
  exports: [CardResourceComponent],
})
export class CardModule { }
