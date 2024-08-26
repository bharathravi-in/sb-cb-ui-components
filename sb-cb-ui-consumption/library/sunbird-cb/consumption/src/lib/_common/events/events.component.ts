import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sb-uic-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  @Input() object: any
  constructor() { }

  ngOnInit() {
    console.log("object ", this.object)
  }

}
