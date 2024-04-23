import { Component, Input, OnInit } from '@angular/core'
import { NsCardContent } from '@sunbird-cb/utils/lib/services/card-content.model'

@Component({
  selector: 'ws-cb-widget-card-resource',
  templateUrl: './card-resource.component.html',
  styleUrls: ['./card-resource.component.scss'],
})
export class CardResourceComponent implements OnInit {

  @Input() widgetData!: NsCardContent.ICard

  constructor() { }

  ngOnInit() {
  }

}
