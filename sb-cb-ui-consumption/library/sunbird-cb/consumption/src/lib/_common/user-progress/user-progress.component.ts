import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sb-uic-user-progress',
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.scss']
})
export class UserProgressComponent implements OnInit {

  @Input() objectData: any
  constructor() { }

  ngOnInit() {
  }

}
