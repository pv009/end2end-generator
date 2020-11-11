import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStory } from 'src/app/shared/model/user-story.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaveService {
  baseUrl = environment.api.baseUrl;
  apiKey = environment.api.apiKey;
  header = new HttpHeaders();

  constructor(
    private http: HttpClient
  ) { }

  createStory(story: UserStory): Promise<any> {
    console.log('Story to create', story);
    return this.http.post(this.baseUrl, story, {
      headers: this.header.set('apiKey', this.apiKey),
    }).toPromise();
  }

  updateStory(story: UserStory): Promise<any> {
    console.log('Story to update', story);
    return this.http.put(this.baseUrl + '/' + story._id.$oid, story, {
      headers: this.header.set('apiKey', this.apiKey),
    }).toPromise();
  }

  deleteStory(id: string): Promise<any> {
    return this.http.delete(this.baseUrl + '/' + id, {
      headers: this.header.set('apiKey', this.apiKey),
    }).toPromise();
  }
}
