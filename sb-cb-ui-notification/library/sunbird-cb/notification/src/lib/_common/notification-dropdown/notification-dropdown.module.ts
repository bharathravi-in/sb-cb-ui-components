import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule as MatTabsModule } from '@angular/material/tabs'
import { NotificationDropdownComponent } from './notification-dropdown.component';
import { SkeletonLoaderLibModule } from '../skeleton-loader-lib/skeleton-loader-lib.module';



@NgModule({
  declarations: [NotificationDropdownComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    SkeletonLoaderLibModule,
  ],
  exports: [NotificationDropdownComponent
  ],
})
export class NotificationDropdownModule { }
