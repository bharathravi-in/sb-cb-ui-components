import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EmailInputComponent } from './email-input.component'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'

@NgModule({
  declarations: [EmailInputComponent],
  imports: [
    CommonModule,

    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  exports: [EmailInputComponent],
})
export class EmailInputModule { }
