import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CommonAssessmentViewerComponent } from './common-assessment-viewer.component'
import { PracticePlModule } from './practice/practice.module'
import { MatIconModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material'

@NgModule({
  declarations: [CommonAssessmentViewerComponent],
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    PracticePlModule,
    CommonModule,
  ],
  exports: [CommonAssessmentViewerComponent, PracticePlModule],
})
export class CommonAssessmentViewerModule { }
