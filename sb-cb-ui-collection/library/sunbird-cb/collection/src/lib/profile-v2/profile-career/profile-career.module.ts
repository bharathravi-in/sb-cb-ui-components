import { NgModule } from '@angular/core'
import { ProfileCareerComponent } from './profile-career.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatChipsModule as MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { BrowserModule } from '@angular/platform-browser'
import { PipeRelativeTimeModule } from '@sunbird-cb/utils-v2'

@NgModule({
    declarations: [ProfileCareerComponent],
    imports: [BrowserModule, MatButtonModule, MatCardModule, MatChipsModule,
        MatDividerModule, MatExpansionModule, MatIconModule, MatProgressSpinnerModule, PipeRelativeTimeModule]
})
export class ProfileCareerModule {

}
