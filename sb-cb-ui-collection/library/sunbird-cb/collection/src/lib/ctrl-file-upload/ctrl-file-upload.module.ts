import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CtrlFileUploadComponent } from './components/ctrl-file-upload/ctrl-file-upload.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [CtrlFileUploadComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [CtrlFileUploadComponent],
})
export class CtrlFileUploadModule {}
