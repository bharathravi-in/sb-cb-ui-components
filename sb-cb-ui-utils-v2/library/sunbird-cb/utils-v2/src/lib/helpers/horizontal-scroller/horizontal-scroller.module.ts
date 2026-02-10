import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HorizontalScrollerComponent } from './horizontal-scroller.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@NgModule({
  declarations: [HorizontalScrollerComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [HorizontalScrollerComponent],
})
export class HorizontalScrollerModule { }
