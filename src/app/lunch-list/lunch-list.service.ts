import { Injectable } from '@angular/core';
import { Listrow } from '../shared/models/listrow';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Restaurant} from "../shared/models/restaurant";

@Injectable({
  providedIn: 'root'
})



export class LunchListService {


  private lunchListUrl = environment.apiurl;

  constructor(private http: HttpClient) { }

  getLunchListRows(parameters) {
    const apiurl = environment.apiurl + this.getApiUrl(parameters);
    return this.http.get<Listrow[]>(apiurl);

  }
  getLunchListRowsNew(parameters) {

    //get lunchlistrows from faunadb api

    if(parameters.ravintolaid) {
      const apiurl = environment.functionsapiurl + '/lunchlists/' + parameters.ravintolaid;
      return this.http.get<Listrow[]>(apiurl);

    }
    if(!parameters.ravintolaid) {
      const apiurl = environment.functionsapiurl + '/lunchlists/' + 12;
      return this.http.get<Listrow[]>(apiurl, {params: parameters});

    }

  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
  }

  getApiUrl(parameters) {
    if (parameters.ravintolaid) {
      return '/api/listat?ravintolaid=' + parameters.ravintolaid;
    } else {
      const date = parameters.paiva ? parameters.paiva : 20191021;
      const endDate = parameters.end ? parameters.end : 20191021;



      let url = '/api/listat?paiva=' + date + '&endDate=' + endDate + '&kasinyp=' + (parameters.showHandheld ? '1' : '0') ;
      console.log(parameters.showHandheld);
      return url;
    }
  }

  UpvoteLunch(restaurantid: number, date: string) {

      const apiurl = environment.apiurl + '/api/upvotelunch';
      return this.http.put(apiurl, {restaurantid, date} ).toPromise();


  }
}
