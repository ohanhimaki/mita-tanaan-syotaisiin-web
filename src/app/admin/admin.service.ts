import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: Http) { }

  salamoiAdmin(apikey) {
    const options2 = new URLSearchParams();
    options2.append('apikey', apikey);

    let headers = new Headers();
    headers.append('apikey', apikey);

    console.log(options2);

    let apiurl = environment.apiurl + '/api/admin/salamoi';
    return this.http.get(apiurl, { headers: headers }).toPromise();

  }
  getRestaurants() {
    let apiurl = environment.apiurl + '/api/ravintolat';
    return this.http.get(apiurl).toPromise();
  }

  updateRestaurant(parameters, apikey) {

    const headers = new Headers();
    headers.append('apikey', apikey);

    const apiurl = environment.apiurl + '/api/ravintolapaivita';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
  deleteRestaurant(parameters, apikey) {

    const headers = new Headers();
    headers.append('apikey', apikey);

    const apiurl = environment.apiurl + '/api/ravintolapoista';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
  addRestaurant(parameters, apikey) {
    const headers = new Headers();
    headers.append('apikey', apikey);

    const apiurl = environment.apiurl + '/api/ravintolat';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
}
