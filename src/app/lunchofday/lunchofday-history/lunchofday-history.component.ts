import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LunchofdayService } from '../lunchofday.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lunchofday } from 'src/app/shared/models/lunchofday';

@Component({
  selector: 'app-lunchofday-history',
  templateUrl: './lunchofday-history.component.html',
  styleUrls: ['./lunchofday-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LunchofdayHistoryComponent implements OnInit {
  private lunchofdayHistory: BehaviorSubject<Array<Lunchofday>> = new BehaviorSubject(null);
  public lunchofdayHistory$: Observable<Array<Lunchofday>> = this.lunchofdayHistory.asObservable();

  constructor(private _api: LunchofdayService) { }

  ngOnInit() {
    this._api.getLunchOfDayHistory().subscribe((res => {
      this.lunchofdayHistory.next(res);

    }));
  }



}
