import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatCardModule as MatCardModule } from '@angular/material/card'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatSliderModule as MatSliderModule } from '@angular/material/slider'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule as MatTooltipModule } from '@angular/material/tooltip'
import { ImageCropperModule } from 'ngx-image-cropper'
import { ImageCropComponent } from './image-crop.component'
// @dynamic
@NgModule({
    declarations: [ImageCropComponent],
    imports: [
        CommonModule,
        ImageCropperModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatToolbarModule,
        MatDialogModule,
        MatCardModule,
        MatTooltipModule,
        MatSliderModule,
    ],
    exports: [ImageCropComponent]
})
export class ImageCropModule { }
