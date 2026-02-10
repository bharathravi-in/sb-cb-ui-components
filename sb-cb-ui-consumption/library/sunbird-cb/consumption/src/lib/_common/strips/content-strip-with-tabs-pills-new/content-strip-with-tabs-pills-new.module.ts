import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HorizontalScrollerV2Module } from '../../horizontal-scroller-v2/horizontal-scroller-v2.module'

import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatChipsModule } from '@angular/material/chips'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialogModule } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTableModule as MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { SbUiResolverModule } from '@sunbird-cb/resolver-v2'
import { ContentStripWithTabsPillsNewComponent } from './content-strip-with-tabs-pills-new.component'

// tslint:disable-next-line:function-name
export function HttpLoaderFactory2(http: HttpClient) {
    return new TranslateHttpLoader(http)
}

@NgModule({
    declarations: [ContentStripWithTabsPillsNewComponent],
    imports: [
        SbUiResolverModule,
        CommonModule,
        RouterModule,
        HorizontalScrollerV2Module,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatListModule,
        MatSidenavModule,
        MatCardModule,
        MatExpansionModule,
        MatRadioModule,
        MatChipsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSnackBarModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatButtonToggleModule,
        MatTabsModule,
        MatAutocompleteModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory2,
                deps: [HttpClient],
            },
        }),
    ],
    exports: [ContentStripWithTabsPillsNewComponent]
})
export class ContentStripWithTabsPillsNewModule { }
