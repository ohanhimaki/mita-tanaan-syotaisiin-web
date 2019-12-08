import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lunchofdaytmp } from '../shared/models/lunchofdaytmp';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LunchofdayTmpService {

  constructor(private http: HttpClient) { }
  getLunchOfDay() {
    const apiurl = environment.apiurl + '/api/lunchofdaytmp';
    return this.http.get<Lunchofdaytmp[]>(apiurl);
  }
}
