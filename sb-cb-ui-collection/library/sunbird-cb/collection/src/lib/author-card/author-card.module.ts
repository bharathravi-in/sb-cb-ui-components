import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthorCardComponent } from './author-card.component'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { RouterModule } from '@angular/router'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'

@NgModule({
    declarations: [AuthorCardComponent],
    imports: [CommonModule, SbUiResolverModule, RouterModule, MatCardModule, MatIconModule, AvatarPhotoModule],
    exports: [AuthorCardComponent]
})
export class AuthorCardModule { }
