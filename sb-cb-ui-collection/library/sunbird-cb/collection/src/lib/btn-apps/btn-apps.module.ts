import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BtnAppsComponent } from './btn-apps.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatRippleModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'

@NgModule({
    declarations: [BtnAppsComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatRippleModule,
        SbUiResolverModule,
    ],
    exports: [BtnAppsComponent]
})
export class BtnAppsModule { }
