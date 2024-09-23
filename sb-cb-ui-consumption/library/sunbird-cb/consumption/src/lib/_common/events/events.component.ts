import { Component, Input, OnInit } from '@angular/core'
import { InsiteDataService } from '../../_services/insite-data.service'
import * as moment_ from 'moment';
const moment = moment_;

@Component({
  selector: 'sb-uic-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  @Input() object: any
  @Input() nwlEventsConfig: any
  daysBetween: any = []
  events: any = []
  constructor(public insightSvc: InsiteDataService) { }

  ngOnInit() {
    this.getEventsList()
  }
  getDaysBetweenDates() {
    let currentDate = moment(this.nwlEventsConfig.startDate, 'DD-MM-YYYY')
    const endDate = moment(this.nwlEventsConfig.endDate, 'DD-MM-YYYY')
    while (currentDate.isSameOrBefore(endDate)) {
      let localObj = {}
      localObj['startDate'] = currentDate.format('YYYY-MM-DD')
      localObj['diplayFormat'] = currentDate.format('MMM DD, YYYY')
      currentDate.add(1, 'days')
      this.daysBetween.push(localObj)
    }
  }

  getEventsList() {
    this.getDaysBetweenDates()
    let nextDay = moment(this.daysBetween[0]['startDate'], 'YYYY-MM-DD')
    nextDay.add(1, 'days')
    console.log("nextr date ", nextDay)
    const requestObj = {
      locale: [
        'en',
      ],
      query: '',
      request: {
        query: '',
        filters: {
          status: ['Live'],
          contentType: 'Event',
          category: 'Event',
          startDate	: {
            ">=": this.daysBetween[0]['startDate'],
            "<": nextDay.format('YYYY-MM-DD')
          }
        },
        sort_by: {
          startDate: 'desc',
        },
      },
    }
    this.insightSvc.fetchTrainingDetails(requestObj).subscribe((res: any)=> {
      if (res && res.result && res.result.Event) {
        this.events = res.result.Event
      }
    })
  }

}
