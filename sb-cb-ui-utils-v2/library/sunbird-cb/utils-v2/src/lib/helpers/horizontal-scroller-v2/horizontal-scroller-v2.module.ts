import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HorizontalScrollerV2Component } from './horizontal-scroller-v2.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@NgModule({
  declarations: [HorizontalScrollerV2Component],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [HorizontalScrollerV2Component],
})
export class HorizontalScrollerV2Module { }
