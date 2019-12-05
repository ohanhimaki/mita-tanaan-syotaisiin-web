import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Restaurant } from '../shared/models/restaurant';
import { Handeditedrow } from '../shared/models/handeditedrow';
import { Restaurantgenre } from '../shared/models/restaurantgenre';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  salamoiAdmin(apikey) {
    const options2 = new URLSearchParams();
    options2.set('apikey', apikey);

    let headers = new HttpHeaders();
    headers = headers.set('apikey', apikey);

    console.log(options2);

    const apiurl = environment.apiurl + '/api/admin/salamoi';
    return this.http.get(apiurl, { headers: headers }).toPromise();

  }
  getRestaurants() {
    const apiurl = environment.apiurl + '/api/ravintolat';
    return this.http.get<Restaurant[]>(apiurl);
  }
  getRestaurantGenres() {
    const apiurl = environment.apiurl + '/api/restaurantGenre';
    return this.http.get<Restaurantgenre[]>(apiurl);
  }
  getHandEditedRows(parameters) {
    const apiurl = environment.apiurl + '/api/handedited?ravintolaid=' + parameters.ravintolaid;
    return this.http.get<Handeditedrow[]>(apiurl);
  }

  updateRestaurant(parameters: Restaurant, apikey: string) {

    let headers = new HttpHeaders();
    headers = headers.set('apikey', apikey);
    const apiurl = environment.apiurl + '/api/ravintolapaivita';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
  updateHandEditedRows(parameters: Handeditedrow, apikey: string) {

    let headers = new HttpHeaders();
    headers = headers.set('apikey', apikey);
    const apiurl = environment.apiurl + '/api/handedited';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
  deleteRestaurant(parameters: Restaurant, apikey: string) {

    let headers = new HttpHeaders();
    headers = headers.set('apikey', apikey);

    const apiurl = environment.apiurl + '/api/ravintolapoista';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
  addRestaurant(parameters, apikey) {
    let headers = new HttpHeaders();
    headers = headers.set('apikey', apikey);

    const apiurl = environment.apiurl + '/api/ravintolat';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
  updateRestaurantGenre(parameters: Restaurantgenre, apikey: string) {

    let headers = new HttpHeaders();
    headers = headers.set('apikey', apikey);
    const apiurl = environment.apiurl + '/api/restaurantgenre';
    return this.http.put(apiurl, parameters, { headers: headers }).toPromise();

  }
  createRestaurantGenre(parameters: Restaurantgenre, apikey: string) {

    let headers = new HttpHeaders();
    headers = headers.set('apikey', apikey);
    const apiurl = environment.apiurl + '/api/restaurantgenre';
    return this.http.post(apiurl, parameters, { headers: headers }).toPromise();

  }
  deleteRestaurantGenre(parameters: Restaurantgenre, apikey: string) {

    let headers = new HttpHeaders();
    headers = headers.set('apikey', apikey);
    const body = {
      genreid: parameters.genreid
    };
    const options = { headers, body };
    const apiurl = environment.apiurl + '/api/restaurantgenre';
    return this.http.delete(apiurl, options).toPromise();

  }
}
