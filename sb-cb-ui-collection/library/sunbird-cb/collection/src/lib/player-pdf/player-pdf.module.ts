import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerPdfComponent } from './player-pdf.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule as MatInputModule } from '@angular/material/input'
import { MatMenuModule as MatMenuModule } from '@angular/material/menu'
import { MatSliderModule as MatSliderModule } from '@angular/material/slider'
import { MatToolbarModule } from '@angular/material/toolbar'
import { ReactiveFormsModule } from '@angular/forms'
import { BtnFullscreenModule } from '../btn-fullscreen/btn-fullscreen.module'
@NgModule({
    declarations: [PlayerPdfComponent],
    imports: [
        CommonModule,
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatMenuModule,
        MatButtonModule,
        MatSliderModule,
        MatToolbarModule,
        ReactiveFormsModule,
        BtnFullscreenModule,
        MatInputModule,
    ],
    exports: [PlayerPdfComponent]
})
export class PlayerPdfModule { }
