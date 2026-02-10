import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { RouterModule } from '@angular/router'
import { AppButtonComponent } from './app-button.component'

@NgModule({
  declarations: [AppButtonComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
  ],
  exports: [AppButtonComponent],
})
export class AppButtonModule { }
