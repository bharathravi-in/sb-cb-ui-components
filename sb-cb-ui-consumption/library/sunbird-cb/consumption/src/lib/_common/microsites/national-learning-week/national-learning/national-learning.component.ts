import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sb-uic-national-learning',
  templateUrl: './national-learning.component.html',
  styleUrls: ['./national-learning.component.scss']
})
export class NationalLearningComponent implements OnInit {
  @Input() sectionList:any = []
  constructor() { }

  ngOnInit() {
  }

}
