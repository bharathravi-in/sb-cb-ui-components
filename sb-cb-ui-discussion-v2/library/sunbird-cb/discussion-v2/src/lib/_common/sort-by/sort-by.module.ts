import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortByComponent } from './sort-by.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio'





@NgModule({
  declarations: [
    SortByComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule
  ],
  exports:[
    SortByComponent
  ]
})
export class SortByModule { }
