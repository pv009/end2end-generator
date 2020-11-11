import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  baseUrl = environment.api.baseUrl;
  apiKey = environment.api.apiKey;
  header = new HttpHeaders();

  constructor(
    private http: HttpClient
  ) { }

  fetchAllStories(): Promise<any> {
    return this.http.get(this.baseUrl, {
      headers: this.header.set('apiKey', this.apiKey)
    }).toPromise();
  }

  fetchStory(storyId: string): Promise<any> {
    return this.http.get(this.baseUrl + '/' + storyId, {
      headers: this.header.set('apiKey', this.apiKey)
    }).toPromise();
  }


}
