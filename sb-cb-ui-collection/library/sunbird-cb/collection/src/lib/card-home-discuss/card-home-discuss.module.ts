import { NgModule } from '@angular/core'
import { CardHomeDiscussComponent } from './card-home-discuss.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { BrowserModule } from '@angular/platform-browser'
import { CardDiscussComponent } from '../card-discuss/card-discuss.component'

@NgModule({
    declarations: [CardHomeDiscussComponent, CardDiscussComponent],
    imports: [BrowserModule, AvatarPhotoModule, MatButtonModule, MatCardModule, MatChipsModule,
        MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule]
})
export class CardHomeDiscussModule {

}
