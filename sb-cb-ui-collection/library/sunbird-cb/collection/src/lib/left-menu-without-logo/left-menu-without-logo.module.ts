import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { LeftMenuWithoutLogoComponent } from './left-menu-without-logo.component'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule as MatListModule } from '@angular/material/list'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
    declarations: [LeftMenuWithoutLogoComponent],
    imports: [
        CommonModule,
        RouterModule,
        SbUiResolverModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        MatChipsModule,
        MatCardModule,
        MatListModule,
    ],
    exports: [
        LeftMenuWithoutLogoComponent,
    ]
})
export class LeftMenuWithoutLogoModule { }
