import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContentPickerV2Component } from './content-picker-v2.component'
import { RouterModule } from '@angular/router'
import { DefaultThumbnailModule, PipeDurationTransformModule } from '@sunbird-cb/utils-v2'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule as MatCheckboxModule } from '@angular/material/checkbox'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'
import { MatListModule as MatListModule } from '@angular/material/list'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatRadioModule as MatRadioModule } from '@angular/material/radio'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { SearchInputComponent } from './components/search-input/search-input.component'
import { FiltersComponent } from './components/filters/filters.component'

@NgModule({
  declarations: [ContentPickerV2Component, SearchInputComponent, FiltersComponent],
  imports: [
    CommonModule,
    RouterModule,
    DefaultThumbnailModule,
    PipeDurationTransformModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatListModule,
    MatRadioModule,
  ],
  exports: [
    ContentPickerV2Component,
  ],
})
export class ContentPickerV2Module { }
