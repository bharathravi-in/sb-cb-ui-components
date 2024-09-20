import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sb-uic-national-learning',
  templateUrl: './national-learning.component.html',
  styleUrls: ['./national-learning.component.scss']
})
export class NationalLearningComponent {
  @Input() sectionList:any = []
  @Input() configDetails: any
  providerId: string = '123456789'
  providerName: ''
  descriptionMaxLength = 500
  constructor(public router: Router) { }



  hideKeyHightlight(event: any, learnerReview: any) {
    if (event) {
      learnerReview['hideSection'] = true
    }
  }

  showAllContent(_stripData: any, columnData: any) {
    if (columnData && columnData.contentStrip && columnData.contentStrip.strips && columnData.contentStrip.strips.length) {
      const stripData: any = _stripData
        let tabSelected =  stripData.viewMoreUrl && stripData.viewMoreUrl.queryParams && stripData.viewMoreUrl.queryParams.tabSelected && stripData.viewMoreUrl.queryParams.tabSelected || ''
        this.router.navigate(
          [`app/learn/national-learning-week/see-all`],
          { queryParams: {  pageDetails: true, tabSelected, key: columnData.sectionKey  } })

    } else {
       this.router.navigate(
        [`/app/learn/browse-by/provider/${this.providerName}/${this.providerId}/all-CBP`],
        { queryParams: { pageDetails: true } })
    }
  }

  hideContentStrip(event: any, contentStripData: any) {
    if (event) {
      contentStripData.contentStrip['hideSection'] = true
    }
  }

  raiseTelemetryInteratEvent(event: any) {
    console.log(event)
    
  }

}
