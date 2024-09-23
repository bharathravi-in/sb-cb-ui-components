import { Component, Input, OnInit } from '@angular/core'
import * as moment_ from 'moment'
const moment = moment_

@Component({
  selector: 'sb-uic-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {

  @Input() objectData: any
  @Input() eventDetails: any
  constructor() { }

  ngOnInit() {
  }

  getEventDate(event: any) {
    let timeString = event.startTime.split(":")
    let dataString = `${moment(event.startDate).format('MMM DD, YYYY')} ${timeString[0]}:${timeString[1]}`
    return dataString
  }

}
