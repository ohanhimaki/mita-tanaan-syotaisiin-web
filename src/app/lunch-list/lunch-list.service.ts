import { Injectable } from '@angular/core';
import { Listrow } from '../shared/models/listrow';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

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
      return '/api/listat?paiva=' + date;
    }
  }

}
