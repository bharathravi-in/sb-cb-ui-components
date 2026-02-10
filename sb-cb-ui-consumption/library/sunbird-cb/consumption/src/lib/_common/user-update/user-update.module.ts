import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserUpdateComponent } from './user-update/user-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AvatarPhotoLibModule } from '../avatar-photo-lib/avatar-photo-lib.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { DialogComponentsModule } from '../dialog-components/dialog-components.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { NotificationModule } from '../notification/notification.module';
import { AddUsersFormMetaComponent } from './add-users-form-meta/add-users-form-meta.component';



@NgModule({
  declarations: [
    UserUpdateComponent,
    AddUsersFormMetaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    AvatarPhotoLibModule,
    MatDatepickerModule,
    MatListModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatRadioModule,
    DialogComponentsModule,
    NotificationModule,
  ],
  exports: [
    UserUpdateComponent,
    AddUsersFormMetaComponent
  ]
})
export class UserUpdateModule { }
