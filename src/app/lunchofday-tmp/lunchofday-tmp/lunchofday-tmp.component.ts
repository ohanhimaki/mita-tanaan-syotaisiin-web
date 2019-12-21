import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LunchofdayTmpService } from '../lunchofday-tmp.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lunchofdaytmp } from 'src/app/shared/models/lunchofdaytmp';

@Component({
  selector: 'app-lunchofday-tmp',
  templateUrl: './lunchofday-tmp.component.html',
  styleUrls: ['./lunchofday-tmp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LunchofdayTmpComponent implements OnInit {
  displayedColumns: string[] = [
    'nimi',
    'restaurantid',
    'randommultiplier',
    'restaurantmultiplier',
    'genremultiplier',
    'usermultiplier',
    'totalscore'];

  private lunchOfDayTmpList: BehaviorSubject<Lunchofdaytmp[]> = new BehaviorSubject(null);
  public lunchOfDayTmpList$: Observable<Lunchofdaytmp[]> = this.lunchOfDayTmpList.asObservable();

  constructor(private _api: LunchofdayTmpService) { }

  ngOnInit() {
    this._api.getLunchOfDay().subscribe((res => {
      this.lunchOfDayTmpList.next(res);
    }));
  }

}
