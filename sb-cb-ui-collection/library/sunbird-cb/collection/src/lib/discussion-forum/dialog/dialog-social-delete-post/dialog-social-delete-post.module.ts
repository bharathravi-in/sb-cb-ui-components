import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogSocialDeletePostComponent } from './dialog-social-delete-post.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@NgModule({
    declarations: [DialogSocialDeletePostComponent],
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class DialogSocialDeletePostModule {}
