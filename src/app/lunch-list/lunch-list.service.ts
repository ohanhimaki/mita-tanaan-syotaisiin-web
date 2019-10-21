import { Injectable } from '@angular/core';
import { Listrow } from './listrow';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})



export class LunchListService {


  private lunchListUrl = environment.apiurl + '/api/listat?paiva=';

  constructor(private http: Http) { }

  getLunchListRows(paiva = '20191014') {
    return this.http.get(this.lunchListUrl + paiva.toString())
      .toPromise()
      .then(response => response.json() as Listrow[])
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
}
