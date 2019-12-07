import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Lunchofday } from 'src/app/shared/models/lunchofday';
import { LunchofdayService } from '../lunchofday.service';
import { observable, Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-lunchofday-today',
  templateUrl: './lunchofday-today.component.html',
  styleUrls: ['./lunchofday-today.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LunchofdayTodayComponent implements OnInit {
  private lunchofday: BehaviorSubject<Lunchofday> = new BehaviorSubject(null);
  public lunchofday$: Observable<Lunchofday> = this.lunchofday.asObservable();


  constructor(private _api: LunchofdayService) { }



  ngOnInit() {

    this._api.getLunchOfDay().subscribe((res => {
      this.lunchofday.next(res[0]);
      console.log(this.lunchofday$);

    }));

  }

}
