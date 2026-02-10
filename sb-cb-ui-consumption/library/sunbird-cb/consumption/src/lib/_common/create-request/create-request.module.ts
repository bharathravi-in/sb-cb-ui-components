import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CreateRequestFormComponent } from './components/create-request-form/create-request-form.component'
import { CreateRequestContentDetailsComponent } from './components/create-request-content-details/create-request-content-details.component'
import { CreateRequestAdditionalDetailsComponent } from './components/create-request-additional-details/create-request-additional-details.component'
import { AddAuthorsComponent } from './dialogs/add-authors/add-authors.component'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatChipsModule } from '@angular/material/chips'
import { MatOptionModule } from '@angular/material/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatTooltipModule } from '@angular/material/tooltip'
import { HorizontalDynamicStepperModule } from '../horizontal-dynamic-stepper/horizontal-dynamic-stepper.module'
import { OrderByPipeModule } from '../../_pipes/order-by/order-by.pipe.module'



@NgModule({
  declarations: [
    CreateRequestFormComponent,
    CreateRequestContentDetailsComponent,
    CreateRequestAdditionalDetailsComponent,
    AddAuthorsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatCardModule,
    MatRadioModule,
    MatTooltipModule,
    HttpClientModule,
    HorizontalDynamicStepperModule,
    OrderByPipeModule,
  ],
  exports: [
    CreateRequestFormComponent,
    AddAuthorsComponent
  ]
})
export class CreateRequestModule { }
