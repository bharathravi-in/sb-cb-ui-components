import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule, MatIconModule, MatTabsModule } from '@angular/material';
import { SkeletonLoaderLibModule } from '../../skeleton-loader-lib/skeleton-loader-lib.module';
import { NationalLearningComponent } from './national-learning/national-learning.component';
import { CommonMethodsService } from '../../../_services/common-methods.service';
import { SlidersLibModule } from '../../sliders/sliders.module';
import { KeyHighlightsModule } from '../../key-highlights/key-highlights.module';
import { ContentStripWithTabsLibModule } from '../../content-strip-with-tabs-lib/content-strip-with-tabs-lib.module';
import { EventsModule } from '../../events/events.module';
import { MdoLeaderboardModule } from '../../mdo-leaderboard/mdo-leaderboard.module';



@NgModule({
  declarations: [NationalLearningComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule,
    SkeletonLoaderLibModule,
    SlidersLibModule,
    MatTabsModule,
    KeyHighlightsModule,
    ContentStripWithTabsLibModule,
    EventsModule,
    MdoLeaderboardModule,
  ],
  exports: [
    NationalLearningComponent,
  ],
  providers:[
    CommonMethodsService
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class NationalLearningModule { }
