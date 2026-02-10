import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatSlideToggleModule as MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { BtnProfileComponent } from './btn-profile.component'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { RouterModule } from '@angular/router'
import { LogoutModule } from '@sunbird-cb/utils-v2'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
// import { TreeCatalogModule } from '../tree-catalog/tree-catalog.module'

@NgModule({
    declarations: [BtnProfileComponent],
    imports: [
        AvatarPhotoModule,
        CommonModule,
        LogoutModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        MatSlideToggleModule,
        RouterModule,
        SbUiResolverModule,
    ]
})
export class BtnProfileModule { }
