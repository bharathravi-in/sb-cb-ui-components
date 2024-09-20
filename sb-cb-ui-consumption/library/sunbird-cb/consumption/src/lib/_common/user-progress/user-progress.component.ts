import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { InsiteDataService } from '../../_services/insite-data.service';
import { ScrollableItemDirective } from '../../_directives/scrollable-item/scrollable-item.directive';

@Component({
  selector: 'sb-uic-user-progress',
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.scss']
})
export class UserProgressComponent implements OnInit {

  @Input() objectData: any
  @Input() rootOrgId: any
  insitesData = []
  currentIndex = 0
  styleData: any = {}
  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective>
  constructor(public insightSvc: InsiteDataService,
  ) { }

  ngOnInit() {
    this.styleData = this.objectData.insights.data.sliderData.styleData
    console.log("sdfd ", this.styleData)
    this.getInsightsData()
  }
  getInsightsData() {
    const request = {
      request: {
        filters: {
          primaryCategory: 'programs',
          organisations: [
            'across',
            this.rootOrgId,
            //"01390354700029132834"
          ],
        },
      },
    }
    this.insightSvc.fetchInsightsData(request).subscribe((res: any) => {
      if (res && res.result && res.result.response && res.result.response.nudges) {
        this.insitesData = res.result.response.nudges
        this.insitesData = this.insitesData.map((obj: any) => {
          return {...obj, cardSubType: 'card-wide-lib'}
        })
      }
    })
  }

  roundTo(number: any) {
    return Math.round(number * 100 /100)
  }

  getCurrentIndex(indexValue: any) {
    this.currentIndex = indexValue
  }

}
