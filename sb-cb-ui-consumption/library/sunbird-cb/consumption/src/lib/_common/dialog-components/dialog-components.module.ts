import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateDialogComponent } from './certificate-dialog/certificate-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../content-strip-with-tabs-lib/content-strip-with-tabs-lib.module';
import { HttpClient } from '@angular/common/http';
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2';
import { AddCompetencyPopupComponent } from './add-competency-popup/add-competency-popup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';



@NgModule({
    declarations: [
        CertificateDialogComponent, 
        AddCompetencyPopupComponent, 
        SnackbarComponent,
        ConfirmationDialogComponent
    ],
    imports: [
        CommonModule,
        MatMenuModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        PipeSafeSanitizerModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        MatFormFieldModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatInputModule,
        MatButtonModule
    ],
    exports: [
        CertificateDialogComponent, 
        AddCompetencyPopupComponent, 
        SnackbarComponent,
        ConfirmationDialogComponent
    ]
})
export class DialogComponentsModule { }
