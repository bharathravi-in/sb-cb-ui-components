import { NgModule } from '@angular/core'
import { CardDiscussComponent } from './card-discuss.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { BrowserModule } from '@angular/platform-browser'
// import { DiscussCardComponent } from '@ws/app/src/lib/routes/discuss/components/discuss-card/discuss-card.component'

@NgModule({
    declarations: [
        CardDiscussComponent,
        // DiscussCardComponent
    ],
    imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
        MatExpansionModule, MatIconModule, MatProgressSpinnerModule]
})
export class CardDiscussModule {

}
