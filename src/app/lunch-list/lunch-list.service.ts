import { Injectable } from '@angular/core';
import { Listrow } from './listrow';
import { Http, Response } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class LunchListService {
  private lunchListUrl = '/api/listat?paiva=20191014';

  constructor(private http: Http) { }

  getLunchListRows() {
    return this.http.get(this.lunchListUrl)
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
