import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Listrow } from '../../shared/models/listrow';
import { LunchListService } from '../lunch-list.service';
import { DatePipe } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-lunch-list',
  templateUrl: './lunch-list.component.html',
  styleUrls: ['./lunch-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LunchListComponent implements OnInit {

  routeParams: Params;

  private lunchListRows: BehaviorSubject<Listrow[]> = new BehaviorSubject(null);
  lunchListRows$ = this.lunchListRows.asObservable();
  lunchlistparams = {
    paiva: null,
    apiid: null
  };


  constructor(private lunchListService: LunchListService, private datePipe: DatePipe, private activatedRoute: ActivatedRoute) {
    this.getRouteParams();
  }

  ngOnInit() {
    if (this.routeParams.ravid || this.routeParams.paiva) {
      const paiva = this.routeParams.paiva ? this.routeParams.paiva : null;
      const ravid = this.routeParams.ravid ? this.routeParams.ravid : null;

      this.lunchlistparams = {
        paiva: paiva,
        apiid: ravid
      };
    } else {
      this.lunchlistparams = {
        paiva: this.getDateToday(),
        apiid: null
      };

    }



    this.lunchListService
      .getLunchListRows(this.lunchlistparams)
      .then((lunchListRows: Listrow[]) => {
        this.lunchListRows.next(lunchListRows);
        if (!this.lunchListRows) {
          return;
        }
      }).then(x => {


      });


  }

  getDistinct(value, index, self) {

    return self.indexOf(value) === index;
  }

  getDateToday() {
    const date = new Date();
    return this.datePipe.transform(date, 'yyyyMMdd');
  }

  getRouteParams() {
    this.activatedRoute.params.subscribe(params => {
      this.routeParams = params;
    });
  }


}
