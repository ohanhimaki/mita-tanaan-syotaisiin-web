import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Lunchofday } from '../shared/models/lunchofday';

@Injectable({
  providedIn: 'root'
})
export class LunchofdayService {

  constructor(private http: HttpClient) { }

  generateLunchofday() {
    return this.http.get(environment.apiurl + '/api/lunchofdayGen');
  }
  getLunchOfDay() {
    return this.http.get<Lunchofday>(environment.apiurl + '/api/lunchofday');
  }
}
