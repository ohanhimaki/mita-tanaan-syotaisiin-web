import { Injectable } from '@angular/core';
import { Listrow } from './listrow';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})



export class LunchListService {


  private lunchListUrl = environment.apiurl;

  constructor(private http: Http) { }

  getLunchListRows(parameters = { paiva: '20191014' }) {
    let apiurl = environment.apiurl + this.getApiUrl(parameters);
    return this.http.get(apiurl)
      .toPromise()
      .then(response => response.json() as Listrow[])
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
  }

  getApiUrl(parameters) {
    if (parameters.ravintolaid) {
      return '/api/listat?ravintolaid=' + parameters.ravintolaid;
    } else {
      let date = parameters.paiva ? parameters.paiva : 20191021;
      return '/api/listat?paiva=' + date;
    }
  }

}
