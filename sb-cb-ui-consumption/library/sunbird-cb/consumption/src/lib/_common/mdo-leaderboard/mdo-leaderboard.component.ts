import { Component, Input, OnInit } from '@angular/core';
import { InsiteDataService } from '../../_services/insite-data.service';

@Component({
  selector: 'sb-uic-mdo-leaderboard',
  templateUrl: './mdo-leaderboard.component.html',
  styleUrls: ['./mdo-leaderboard.component.scss']
})
export class MdoLeaderboardComponent implements OnInit {

  currentTab: any = 'XL'
  result: any = []
  filteredData: any
  searchTerm: string = ''

  @Input() object: any
  constructor(private insiteDataService: InsiteDataService) { }

  ngOnInit() {
    this.getData()
  }

  getData() {

    // this.insiteDataService.fetchLeaderboard().subscribe((res: any) => {
    //     this.result = res
    // }, error => {
    //     console.log(error)
    // })
    this.result = {
      "mdoLeaderBoard": [
          {
              "size": "L",
              "last_credit_date": "2024-06-18 17:58:20+0530",
              "org_id": "01376822290813747263",
              "total_points": 53,
              "row_num": 1,
              "total_users": 3,
              "org_name": "TarentoCBP"
          },
          {
              "size": "L",
              "last_credit_date": "2024-06-24 15:59:59+0530",
              "org_id": "0135071359030722569",
              "total_points": 24,
              "row_num": 2,
              "total_users": 3,
              "org_name": "Karmayogi Bharat"
          },
          {
              "size": "L",
              "last_credit_date": "2024-06-26 15:58:26+0530",
              "org_id": "01379305664500531251",
              "total_points": 12,
              "row_num": 3,
              "total_users": 3,
              "org_name": "Ministry for Testing"
          },
          {
              "size": "M",
              "last_credit_date": "2024-06-25 19:37:13+0530",
              "org_id": "013826080908025856107",
              "total_points": 29,
              "row_num": 1,
              "total_users": 2,
              "org_name": "Ministry of testing"
          },
          {
              "size": "M",
              "last_credit_date": "2024-06-24 19:14:24+0530",
              "org_id": "01390354700029132834",
              "total_points": 19,
              "row_num": 2,
              "total_users": 2,
              "org_name": "Agrinnovate India"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-21 14:29:01+0530",
              "org_id": "01376822910112563268",
              "total_points": 129,
              "row_num": 1,
              "total_users": 1,
              "org_name": "TarentoMDO"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-26 11:09:09+0530",
              "org_id": "01372729081852723241",
              "total_points": 12,
              "row_num": 2,
              "total_users": 1,
              "org_name": "Bharat Sanchar Nigam Limited Portal(BSNL)"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-20 01:05:02+0530",
              "org_id": "0132593267437813768",
              "total_points": 10,
              "row_num": 3,
              "total_users": 1,
              "org_name": "JPAL"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-19 09:41:00+0530",
              "org_id": "0140801732728668160",
              "total_points": 5,
              "row_num": 4,
              "total_users": 1,
              "org_name": "Commercial Taxes and Registration Department Tamil Nadu"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-19 12:21:20+0530",
              "org_id": "0140802491947827204",
              "total_points": 5,
              "row_num": 5,
              "total_users": 1,
              "org_name": "Information and Broadcasting Department Gujarat"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-24 15:23:45+0530",
              "org_id": "01381906916850892825",
              "total_points": 5,
              "row_num": 6,
              "total_users": 1,
              "org_name": "Ministry of Finance"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-26 10:44:55+0530",
              "org_id": "01359132123730739281",
              "total_points": 5,
              "row_num": 7,
              "total_users": 1,
              "org_name": "Ministry of Power"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-19 20:08:32+0530",
              "org_id": "0140788863598264326",
              "total_points": 2,
              "row_num": 8,
              "total_users": 1,
              "org_name": "Tarento CBP Provider"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-19 09:41:00+0530",
              "org_id": "0140801732728668160",
              "total_points": 5,
              "row_num": 9,
              "total_users": 1,
              "org_name": "Commercial Taxes and Registration Department Tamil Nadu"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-19 12:21:20+0530",
              "org_id": "0140802491947827204",
              "total_points": 5,
              "row_num": 10,
              "total_users": 1,
              "org_name": "Information and Broadcasting Department Gujarat"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-24 15:23:45+0530",
              "org_id": "01381906916850892825",
              "total_points": 5,
              "row_num": 11,
              "total_users": 1,
              "org_name": "Ministry of Finance"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-26 10:44:55+0530",
              "org_id": "01359132123730739281",
              "total_points": 5,
              "row_num": 12,
              "total_users": 1,
              "org_name": "Ministry of Power"
          },
          {
              "size": "S",
              "last_credit_date": "2024-06-19 20:08:32+0530",
              "org_id": "0140788863598264326",
              "total_points": 2,
              "row_num": 13,
              "total_users": 1,
              "org_name": "Tarento CBP Provider"
          },
          {
              "size": "XL",
              "last_credit_date": "2024-07-01 18:27:40+0530",
              "org_id": "0140788510336040962",
              "total_points": 94,
              "row_num": 1,
              "total_users": 8,
              "org_name": "Finance And Budget"
          }
      ]
    }
    this.filteredData = this.result.mdoLeaderBoard
        .filter(user => user.size === this.currentTab) 
        .map(user => ({ ...user, children: [], selected: false }))
  }

  getTabData(name: any) {
    this.currentTab = name
    this.searchTerm = ''
    this.filteredData = this.result.mdoLeaderBoard
        .filter(user => user.size === this.currentTab) 
            .map(user => ({ ...user, children: [], selected: false }))
  }

  getRank(rank: number) {
    return [1,2,3].includes(rank) ? `rank${rank}` : 'rank0'
  }

  getMedal(rank: number) {
    if (rank === 1) {
        return 'assets/images/national-learning/Medal1.svg'
    } else if(rank === 2) {
        return 'assets/images/national-learning/Medal2.svg'
    } else {
        return 'assets/images/national-learning/Medal3.svg'
    }
  }

  getChildren(obj: any) {
    this.filteredData = this.result.mdoLeaderBoard
        .filter(user => user.size === this.currentTab) 
            .map(user => ({ ...user, children: [], selected: user.org_id === obj.org_id }))
  }

  handleSearchQuery(e: any) {
    if (e.target.value && e.target.value.length > 0) {
        this.searchTerm = e.target.value
        this.filteredData = this.result.mdoLeaderBoard
        .filter(user => user.size === this.currentTab && user.org_name.toLowerCase().includes(e.target.value)) 
    } else {
        this.filteredData = this.result.mdoLeaderBoard
        .filter(user => user.size === this.currentTab)
    }
  }

}
