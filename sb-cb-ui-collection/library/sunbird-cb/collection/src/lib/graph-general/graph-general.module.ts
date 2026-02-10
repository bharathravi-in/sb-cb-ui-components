import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GraphGeneralComponent } from './graph-general.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule as MatSelectModule } from '@angular/material/select'

@NgModule({
    declarations: [GraphGeneralComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule]
})
export class GraphGeneralModule {}
