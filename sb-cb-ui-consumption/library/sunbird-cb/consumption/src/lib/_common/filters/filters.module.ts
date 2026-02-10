import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FilterByComponent } from './filter-by/filter-by.component'
import { SearchSortInputComponent } from './search-sort-input/search-sort-input.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatOptionModule } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatToolbarModule } from '@angular/material/toolbar'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpLoaderFactory } from '../../../public-api'
import { HttpClient } from '@angular/common/http'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatRadioModule } from '@angular/material/radio'
import { MatListModule } from '@angular/material/list'



@NgModule({
  declarations: [
    FilterByComponent,
    SearchSortInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatRadioModule,
    MatListModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    FilterByComponent,
    SearchSortInputComponent
  ]
})
export class FiltersModule { }
