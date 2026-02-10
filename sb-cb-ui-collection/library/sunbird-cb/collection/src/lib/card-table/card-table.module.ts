import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardTableComponent } from './card-table.component'
import {
  HorizontalScrollerModule,
  PipeCountTransformModule,
  PipeDurationTransformModule,
} from '@sunbird-cb/utils-v2'
import { PipeTableListModule } from './pipe-table-list/pipe-table-list.module'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule as MatTableModule } from '@angular/material/table'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { RouterModule } from '@angular/router'
import { PipeTableMetaModule } from './pipe-table-meta/pipe-table-meta.module'
import { PipeRelativePathTableModule } from './relative-url/relative-url.module'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
@NgModule({
  declarations: [CardTableComponent],
  imports: [
    CommonModule,
    HorizontalScrollerModule,
    SbUiResolverModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    PipeTableListModule,
    RouterModule,
    MatCardModule,
    PipeDurationTransformModule,
    PipeCountTransformModule,
    PipeTableMetaModule,
    PipeRelativePathTableModule,
    // PipeNicRelativeModule,
  ],
  exports: [
    CardTableComponent,
  ],
  // entryComponents: [CardTableComponent],
})
export class CardTableModule { }
