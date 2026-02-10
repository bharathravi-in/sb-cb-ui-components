import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TreeCatalogComponent } from './tree-catalog.component'
import { TreeModule } from '../tree/tree.module'
import { TreeCatalogMenuComponent } from './tree-catalog-menu/tree-catalog-menu.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { TreeCatalogRoutePipe } from './tree-catalog-route.pipe'

@NgModule({
    declarations: [TreeCatalogComponent, TreeCatalogMenuComponent, TreeCatalogRoutePipe],
    imports: [
        CommonModule,
        RouterModule,
        TreeModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
    ],
    exports: [TreeCatalogComponent, TreeCatalogMenuComponent]
})
export class TreeCatalogModule { }
