import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Restaurant } from '../shared/models/restaurant';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  salamoiAdmin(apikey) {
    const options2 = new URLSearchParams();
    options2.append('apikey', apikey);

    const headers = new HttpHeaders();
    headers.append('apikey', apikey);

    console.log(options2);

    const apiurl = environment.apiurl + '/api/admin/salamoi';
    return this.http.get(apiurl, { headers: headers }).toPromise();

  }
  getRestaurants() {
    const apiurl = environment.apiurl + '/api/ravintolat';
    return this.http.get<Restaurant[]>(apiurl);
  }

  updateRestaurant(parameters: Restaurant, apikey: string) {

    const headers = new HttpHeaders();
    headers.append('apikey', apikey);

    const apiurl = environment.apiurl + '/api/ravintolapaivita';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
  deleteRestaurant(parameters: Restaurant, apikey: string) {

    const headers = new HttpHeaders();
    headers.append('apikey', apikey);

    const apiurl = environment.apiurl + '/api/ravintolapoista';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
  addRestaurant(parameters, apikey) {
    const headers = new HttpHeaders();
    headers.append('apikey', apikey);

    const apiurl = environment.apiurl + '/api/ravintolat';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
}
