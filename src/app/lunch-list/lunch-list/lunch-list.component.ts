import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Listrow } from '../../shared/models/listrow';
import { LunchListService } from '../lunch-list.service';
import { DatePipe } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lunch-list',
  templateUrl: './lunch-list.component.html',
  styleUrls: ['./lunch-list.component.scss']
})
export class LunchListComponent implements OnInit {

  routeParams: Params;

  lunchListRows: Listrow[] = [];
  lunchListsByRestaurants: Listrow[][] = new Array<Array<Listrow>>();
  uniqueRestaurantIDs: number[];
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
        this.lunchListRows = lunchListRows;
      }).then(x => {
        this.uniqueRestaurantIDs = this.lunchListRows.map(x => x.apiid).filter(this.getDistinct);

        this.uniqueRestaurantIDs.forEach(x => {
          const tmpList = this.lunchListRows.filter(row => row.apiid === x);

          this.lunchListsByRestaurants.push(tmpList);
        });
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
