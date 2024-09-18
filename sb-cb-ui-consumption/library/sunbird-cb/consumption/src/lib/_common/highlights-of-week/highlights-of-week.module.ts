import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { HighlightsOfWeekComponent } from './highlights-of-week.component';
import { ScrollableItemModule } from '../../_directives/scrollable-item/scrollable-item.module';
import { SlidersNgContentLibModule } from '../sliders-ng-content/sliders-ng-content.module';



@NgModule({
  declarations: [HighlightsOfWeekComponent],
  imports: [
    CommonModule,
    MatIconModule,
    ScrollableItemModule,
    SlidersNgContentLibModule
  ],
  exports: [
    HighlightsOfWeekComponent
  ]
})
export class HighlightsOfWeekModule { }
