import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { UserAutocompleteComponent } from './user-autocomplete.component'
import { MatAutocompleteModule as MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'
import { UserImageModule } from '../user-image/user-image.module'

@NgModule({
  declarations: [UserAutocompleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    UserImageModule,
  ],
  exports: [UserAutocompleteComponent],
})
export class UserAutocompleteModule { }
