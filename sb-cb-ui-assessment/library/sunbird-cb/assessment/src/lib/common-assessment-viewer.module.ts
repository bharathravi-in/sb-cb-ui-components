import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CommonAssessmentViewerComponent } from './common-assessment-viewer.component'
import { PracticePlModule } from './practice/practice.module'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'

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
