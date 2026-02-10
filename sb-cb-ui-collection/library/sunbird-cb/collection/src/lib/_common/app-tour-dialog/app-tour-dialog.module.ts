import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AppTourDialogComponent } from './app-tour-dialog.component'
import { MatButtonModule as MatButtonModule } from '@angular/material/button'
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router'

@NgModule({
    declarations: [AppTourDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule, MatButtonModule,
        MatIconModule,
        RouterModule,
    ]
})
export class AppTourDialogModule { }
