import { NgModule } from '@angular/core'
import { CardHubsListComponent } from './card-hubs-list.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { BrowserModule } from '@angular/platform-browser'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { HorizontalScrollerModule, PipeNameTransformModule } from '@sunbird-cb/utils-v2'
import { RouterModule } from '@angular/router'

@NgModule({
    declarations: [CardHubsListComponent],
    imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
        MatExpansionModule, MatIconModule, MatProgressSpinnerModule, AvatarPhotoModule,
        HorizontalScrollerModule, PipeNameTransformModule, RouterModule]
})
export class CardHubsListModule {

}
