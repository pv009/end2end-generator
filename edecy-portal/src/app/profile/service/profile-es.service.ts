import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { environment } from 'src/environments/environment';
import { ProfileResponse } from '../model/profileES.model';
import { ProfileQuery } from '../model/query.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileEsService {
  searchURL = environment.elasticSearch.baseURL;

  constructor(
    private http: HttpClient,
    private matomoHelper: MatomoHelperService
  ) { }

  getProfiles(size: number, page: number): Observable<ProfileResponse> {
    const searchQuery: ProfileQuery = {
      size,
      page
    };


    return this.http.get<ProfileResponse>(this.searchURL + 'institute', {
      params: {
        size: searchQuery.size.toString(),
        page: searchQuery.page.toString(),
      }
    });
  }

  searchProfiles(searchQuery: ProfileQuery, testing?: boolean): Observable<ProfileResponse> {
    console.log('Query: ', searchQuery);
    const pageNo = searchQuery.page - 1;
    let parameters: HttpParams = new HttpParams().set('page', pageNo.toString()).set('country', 'Deutschland');

    if (searchQuery.q) {
      parameters = parameters.append('q', searchQuery.q);
    }

    if (searchQuery.category) {
      parameters = parameters.append('category', searchQuery.category);
    }

    if (searchQuery.city) {
      parameters = parameters.append('city', searchQuery.city);
    }

    if (testing === undefined) {
      if (searchQuery.q || searchQuery.category) {
        this.matomoHelper.trackSiteSearch(searchQuery.q, searchQuery.category);
      }
    }

    console.log('Parameters: ', parameters);

    return this.http.get<ProfileResponse>(this.searchURL + 'institute', { params: parameters });
  }

  loadProfile(profileId: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.searchURL + 'institute', {
      params: {
        id: profileId
      }
    });
  }
}
