import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Listrow } from '../listrow';
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
  }


  constructor(private lunchListService: LunchListService, private datePipe: DatePipe, private activatedRoute: ActivatedRoute) {
    this.getRouteParams();
  }

  ngOnInit() {
    console.log(!this.routeParams.ravid)
    console.log(!this.routeParams.paiva)
    if (this.routeParams.ravid || this.routeParams.paiva) {
      let paiva = this.routeParams.paiva ? this.routeParams.paiva : null;
      let ravid = this.routeParams.ravid ? this.routeParams.ravid : null;

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
        this.lunchListRows = lunchListRows
      }).then(x => {
        console.log(this.lunchListRows);
        this.uniqueRestaurantIDs = this.lunchListRows.map(x => x.apiid).filter(this.getDistinct);
        console.log(this.uniqueRestaurantIDs);

        this.uniqueRestaurantIDs.forEach(x => {
          let tmpList = this.lunchListRows.filter(row => row.apiid === x);

          this.lunchListsByRestaurants.push(tmpList);
        });
      });


  }

  getDistinct(value, index, self) {
    let tulos = self.indexOf(value) === index;

    return self.indexOf(value) === index;
  }

  getDateToday() {
    let date = new Date();
    return this.datePipe.transform(date, 'yyyyMMdd');
  }

  getRouteParams() {
    this.activatedRoute.params.subscribe(params => {
      this.routeParams = params;
    })
  }


}
