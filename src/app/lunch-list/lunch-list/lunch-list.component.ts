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
    ravintola: null,
    kaikkipaivat: null,
    kaikkiravintolat: null
  }


  constructor(private lunchListService: LunchListService, private datePipe: DatePipe, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.lunchListService
      .getLunchListRows(this.getDateToday())
      .then((lunchListRows: Listrow[]) => {
        this.lunchListRows = lunchListRows
      }).then(x => {

        this.uniqueRestaurantIDs = this.lunchListRows.map(x => x.ravintolaid).filter(this.getDistinct);

        this.uniqueRestaurantIDs.forEach(x => {
          let tmpList = this.lunchListRows.filter(row => row.ravintolaid === x);

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
