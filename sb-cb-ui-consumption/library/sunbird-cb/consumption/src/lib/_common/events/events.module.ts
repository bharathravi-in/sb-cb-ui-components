import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { EventCardComponent } from './event-card/event-card.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [EventsComponent, EventCardComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [EventsComponent, EventCardComponent]
})
export class EventsModule { }
