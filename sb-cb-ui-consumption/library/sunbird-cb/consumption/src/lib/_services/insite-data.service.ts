import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_END_POINTS = {
  PROVIDER_INSIGHTS: `/apis/proxies/v8/microsite/read/insights`,
  TRAINING_DETAILS: `apis/proxies/v8/sunbirdigot/search`,
  ANNOUNCEMENTS_DETAILS: `apis/proxies/v8/announcements/v1/search`,
  LEARNERS: `apis/proxies/v8/halloffame/top/learners`,
  LEADERBOARD: 'apis/proxies/v8/halloffame/v1/mdoleaderboard'
}

@Injectable({
  providedIn: 'root'
})
export class InsiteDataService {

  constructor(
    private http: HttpClient
  ) {}
  fetchSearchData(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.PROVIDER_INSIGHTS, request)
  }

  fetchAnnouncementsData(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.ANNOUNCEMENTS_DETAILS, request)
  }


  fetchTrainingDetails(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.TRAINING_DETAILS, request)
  }

  fetchLearner(channelId: any): Observable<any> {
    return this.http.get(`${API_END_POINTS.LEARNERS}/${channelId}`)
  }

  fetchLeaderboard() {
    return this.http.get(`${API_END_POINTS.LEADERBOARD}`)
  }

}
