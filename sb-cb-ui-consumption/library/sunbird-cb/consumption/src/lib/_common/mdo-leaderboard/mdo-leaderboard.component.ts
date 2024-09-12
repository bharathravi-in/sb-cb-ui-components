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

    this.insiteDataService.fetchLeaderboard().subscribe((res: any) => {
        if (res && res.result) {
            this.result = res.result
            this.filteredData = this.result.mdoLeaderBoard
                .filter(user => user.size === this.currentTab) 
                .map(user => ({ ...user, children: [], selected: false }))
        }
        
    }, error => {
        console.log(error)
    })
    // this.result = {
    //   "mdoLeaderBoard": [
    //       {
    //           "size": "L",
    //           "last_credit_date": "2024-06-18 17:58:20+0530",
    //           "org_id": "01376822290813747263",
    //           "total_points": 53,
    //           "row_num": 1,
    //           "total_users": 3,
    //           "org_name": "TarentoCBP"
    //       },
    //       {
    //           "size": "L",
    //           "last_credit_date": "2024-06-24 15:59:59+0530",
    //           "org_id": "0135071359030722569",
    //           "total_points": 24,
    //           "row_num": 2,
    //           "total_users": 3,
    //           "org_name": "Karmayogi Bharat"
    //       },
    //       {
    //           "size": "L",
    //           "last_credit_date": "2024-06-26 15:58:26+0530",
    //           "org_id": "01379305664500531251",
    //           "total_points": 12,
    //           "row_num": 3,
    //           "total_users": 3,
    //           "org_name": "Ministry for Testing"
    //       },
    //       {
    //           "size": "M",
    //           "last_credit_date": "2024-06-25 19:37:13+0530",
    //           "org_id": "013826080908025856107",
    //           "total_points": 29,
    //           "row_num": 1,
    //           "total_users": 2,
    //           "org_name": "Ministry of testing"
    //       },
    //       {
    //           "size": "M",
    //           "last_credit_date": "2024-06-24 19:14:24+0530",
    //           "org_id": "01390354700029132834",
    //           "total_points": 19,
    //           "row_num": 2,
    //           "total_users": 2,
    //           "org_name": "Agrinnovate India"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-21 14:29:01+0530",
    //           "org_id": "01376822910112563268",
    //           "total_points": 129,
    //           "row_num": 1,
    //           "total_users": 1,
    //           "org_name": "TarentoMDO"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-26 11:09:09+0530",
    //           "org_id": "01372729081852723241",
    //           "total_points": 12,
    //           "row_num": 2,
    //           "total_users": 1,
    //           "org_name": "Bharat Sanchar Nigam Limited Portal(BSNL)"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-20 01:05:02+0530",
    //           "org_id": "0132593267437813768",
    //           "total_points": 10,
    //           "row_num": 3,
    //           "total_users": 1,
    //           "org_name": "JPAL"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-19 09:41:00+0530",
    //           "org_id": "0140801732728668160",
    //           "total_points": 5,
    //           "row_num": 4,
    //           "total_users": 1,
    //           "org_name": "Commercial Taxes and Registration Department Tamil Nadu"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-19 12:21:20+0530",
    //           "org_id": "0140802491947827204",
    //           "total_points": 5,
    //           "row_num": 5,
    //           "total_users": 1,
    //           "org_name": "Information and Broadcasting Department Gujarat"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-24 15:23:45+0530",
    //           "org_id": "01381906916850892825",
    //           "total_points": 5,
    //           "row_num": 6,
    //           "total_users": 1,
    //           "org_name": "Ministry of Finance"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-26 10:44:55+0530",
    //           "org_id": "01359132123730739281",
    //           "total_points": 5,
    //           "row_num": 7,
    //           "total_users": 1,
    //           "org_name": "Ministry of Power"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-19 20:08:32+0530",
    //           "org_id": "0140788863598264326",
    //           "total_points": 2,
    //           "row_num": 8,
    //           "total_users": 1,
    //           "org_name": "Tarento CBP Provider"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-19 09:41:00+0530",
    //           "org_id": "0140801732728668160",
    //           "total_points": 5,
    //           "row_num": 9,
    //           "total_users": 1,
    //           "org_name": "Commercial Taxes and Registration Department Tamil Nadu"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-19 12:21:20+0530",
    //           "org_id": "0140802491947827204",
    //           "total_points": 5,
    //           "row_num": 10,
    //           "total_users": 1,
    //           "org_name": "Information and Broadcasting Department Gujarat"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-24 15:23:45+0530",
    //           "org_id": "01381906916850892825",
    //           "total_points": 5,
    //           "row_num": 11,
    //           "total_users": 1,
    //           "org_name": "Ministry of Finance"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-26 10:44:55+0530",
    //           "org_id": "01359132123730739281",
    //           "total_points": 5,
    //           "row_num": 12,
    //           "total_users": 1,
    //           "org_name": "Ministry of Power"
    //       },
    //       {
    //           "size": "S",
    //           "last_credit_date": "2024-06-19 20:08:32+0530",
    //           "org_id": "0140788863598264326",
    //           "total_points": 2,
    //           "row_num": 13,
    //           "total_users": 1,
    //           "org_name": "Tarento CBP Provider"
    //       },
    //       {
    //           "size": "XL",
    //           "last_credit_date": "2024-07-01 18:27:40+0530",
    //           "org_id": "0140788510336040962",
    //           "total_points": 94,
    //           "row_num": 1,
    //           "total_users": 8,
    //           "org_name": "Finance And Budget"
    //       }
    //   ]
    // }
    // this.filteredData = this.result.mdoLeaderBoard
    //     .filter(user => user.size === this.currentTab) 
    //     .map(user => ({ ...user, children: [], selected: false }))
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
    // let children: any = {
    //     "result": {
    //         "userLeaderBoard": [
    //             {
    //                 "profile_image": null,
    //                 "last_credit_date": "2024-06-27 16:32:23+0530",
    //                 "org_id": "0140788510336040962",
    //                 "total_points": 30,
    //                 "rank": 1,
    //                 "fullname": "dev fnb userone ",
    //                 "designation": "CHIEF ASSISTANT",
    //                 "row_num": 1,
    //                 "userId": "a707c493-5d12-4ac5-ab61-228433be6edd"
    //             },
    //             {
    //                 "profile_image": null,
    //                 "last_credit_date": "2024-06-26 15:12:13+0530",
    //                 "org_id": "0140788510336040962",
    //                 "total_points": 19,
    //                 "rank": 2,
    //                 "fullname": "UserFour create mdo ",
    //                 "designation": "ADDITIONAL DEPUTY COMMISSIONER",
    //                 "row_num": 2,
    //                 "userId": "d87ed62b-6e43-46fd-a70f-dbede25fc86c"
    //             },
    //             {
    //                 "profile_image": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1721121524558_2023IMG5LandingPageGPtoBCAssessmentRequestSMALL.jpg",
    //                 "last_credit_date": "2024-06-20 15:03:19+0530",
    //                 "org_id": "0140788510336040962",
    //                 "total_points": 12,
    //                 "rank": 3,
    //                 "fullname": "Dev FnB MDOADMIN ",
    //                 "designation": "",
    //                 "row_num": 3,
    //                 "userId": "57fd815a-85eb-4354-aef5-d3642f90b876"
    //             },
    //             {
    //                 "profile_image": "https://portal.dev.karmayogibharat.net/assets/public/profileImage/1718615575605_2023IMG5LandingPageGPtoBCAssessmentRequestSMALL.jpg",
    //                 "last_credit_date": "2024-06-24 17:45:20+0530",
    //                 "org_id": "0140788510336040962",
    //                 "total_points": 9,
    //                 "rank": 4,
    //                 "fullname": "Bulk Usertwo ",
    //                 "designation": "ACCOUNTANT",
    //                 "row_num": 4,
    //                 "userId": "8178f6f7-ea96-420a-9a2f-57085f569a8d"
    //             },
    //             {
    //                 "profile_image": null,
    //                 "last_credit_date": "2024-06-25 11:20:00+0530",
    //                 "org_id": "0140788510336040962",
    //                 "total_points": 7,
    //                 "rank": 5,
    //                 "fullname": "Dev FnB UserTwo ",
    //                 "designation": "ACCOUNTANT",
    //                 "row_num": 5,
    //                 "userId": "64f070f0-90d9-4753-a6cc-a621e92634ad"
    //             },
    //             {
    //                 "profile_image": null,
    //                 "last_credit_date": "2024-06-27 16:34:35+0530",
    //                 "org_id": "0140788510336040962",
    //                 "total_points": 7,
    //                 "rank": 5,
    //                 "fullname": "FnB Userone Maildrop ",
    //                 "designation": null,
    //                 "row_num": 6,
    //                 "userId": "a545fa41-10f6-4357-afc3-75c99227e670"
    //             },
    //             {
    //                 "profile_image": null,
    //                 "last_credit_date": "2024-06-19 11:33:23+0530",
    //                 "org_id": "0140788510336040962",
    //                 "total_points": 5,
    //                 "rank": 6,
    //                 "fullname": "FnB User Three ",
    //                 "designation": "ACCOUNT SUPERINTENDENT",
    //                 "row_num": 7,
    //                 "userId": "49436ac4-2d85-4e87-8eac-e1f746fd6116"
    //             },
    //             {
    //                 "profile_image": null,
    //                 "last_credit_date": "2024-07-01 18:27:40+0530",
    //                 "org_id": "0140788510336040962",
    //                 "total_points": 5,
    //                 "rank": 6,
    //                 "fullname": "Fnb User Reg N  ",
    //                 "designation": "ACCOUNTANT GENERAL",
    //                 "row_num": 8,
    //                 "userId": "6c74de1b-5c54-4c7a-a6fe-b07cf19f39cc"
    //             }
    //         ]
    //     }
    // }

    let children = []

    this.insiteDataService.fetchMdoUsers(obj.org_id).subscribe((res: any) => {
        console.log(res)
        if (res && res.result && res.result.userLeaderBoard) {
            children = res.result.userLeaderBoard
            this.filteredData = this.result.mdoLeaderBoard
                .filter(user => user.size === this.currentTab) 
                .map(user => ({ ...user, children: user.org_id === obj.org_id ? children : [], selected: user.org_id === obj.org_id }))
            console.log("filteredData ", this.filteredData)
        }
    }, error => {
        console.log(error)
    })

    
  }

  handleSearchQuery(e: any) {
    if (e.target.value && e.target.value.length > 0) {
        this.searchTerm = e.target.value
        this.filteredData = this.result.mdoLeaderBoard
            .filter(user => user.size === this.currentTab && user.org_name.toLowerCase().includes(e.target.value))
            .map(user => ({ ...user, children: []}))
    } else {
        this.filteredData = this.result.mdoLeaderBoard
            .filter(user => user.size === this.currentTab)
            .map(user => ({ ...user, children: []}))
    }
  }

}
