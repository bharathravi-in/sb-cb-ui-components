import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { PipesModule } from '../_pipes/pipes.module'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { AvatarPhotoComponent } from './avatar-photo/avatar-photo.component'
import { FlagDialogueComponent } from './flag-dialogue/flag-dialogue.component';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogueComponent } from './confirm-dialogue/confirm-dialogue.component';
import { ShareDiscussionModule } from './share-discussion/share-toc.module';
import { CommunityGuideLinesComponent } from './community-guide-lines/community-guide-lines.component';



@NgModule({
  declarations: [
    AvatarPhotoComponent,
    FlagDialogueComponent,
    ConfirmDialogueComponent,
    CommunityGuideLinesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PipesModule,
    SkeletonLoaderModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    ShareDiscussionModule
  ],
  exports: [
    AvatarPhotoComponent,
    FlagDialogueComponent,
    ConfirmDialogueComponent,
    ShareDiscussionModule,
    CommunityGuideLinesComponent
  ],
})
export class SharedModule { }
