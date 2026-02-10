import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdoLeaderboardComponent } from './mdo-leaderboard.component';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';
import { InsiteDataService } from '../../_services/insite-data.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [MdoLeaderboardComponent],
  imports: [
    CommonModule,
    MatIconModule,
    SkeletonLoaderLibModule,
    FormsModule,
    MatTooltipModule
  ],
  exports: [
    MdoLeaderboardComponent
  ],
  providers: [InsiteDataService]
})
export class MdoLeaderboardModule { }
