import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SkeletonLoaderLibComponent } from './skeleton-loader-lib.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [SkeletonLoaderLibComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatIconModule,
    ],
    exports: [
        SkeletonLoaderLibComponent,
    ]
})
export class SkeletonLoaderLibModule { }
