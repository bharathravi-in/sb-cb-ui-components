import { NgModule } from '@angular/core'
import { CardHomeNetworkComponent } from './card-home-network.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { BrowserModule } from '@angular/platform-browser'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'

@NgModule({
    declarations: [CardHomeNetworkComponent],
    imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
        MatExpansionModule, MatIconModule, MatProgressSpinnerModule, AvatarPhotoModule]
})
export class CardHomeNetworkModule {

}
