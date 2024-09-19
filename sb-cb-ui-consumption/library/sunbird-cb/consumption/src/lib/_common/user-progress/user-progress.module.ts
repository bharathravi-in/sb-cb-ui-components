import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProgressComponent } from './user-progress.component';
import { MatTooltipModule } from '@angular/material';



@NgModule({
  declarations: [UserProgressComponent],
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  exports: [
    UserProgressComponent
  ]
})
export class UserProgressModule { }
