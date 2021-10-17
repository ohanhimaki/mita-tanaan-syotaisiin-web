import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Listrow} from '../../shared/models/listrow';
import {LunchListService} from '../lunch-list.service';
import {DatePipe} from '@angular/common';
import {Params, ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {AdminService} from 'src/app/admin/admin.service';
import {Restaurant} from 'src/app/shared/models/restaurant';
import {DateAdapter} from '@angular/material';
import {MatCheckboxChange} from "@angular/material/checkbox";
import {min} from "rxjs/operators";

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
  private restaurants: BehaviorSubject<Restaurant[]> = new BehaviorSubject(null);
  restaurants$ = this.restaurants.asObservable();
  selectedRestaurant: Restaurant;
  showHandheldLists: boolean = false;
  showWholeWeek: boolean = false;
  selectedDate: any;
  private loadingLunchLists: boolean;

  constructor(private lunchListService: LunchListService,
              private datePipe: DatePipe,
              private activatedRoute: ActivatedRoute,
              private adminService: AdminService,
              // private _adapter: DateAdapter<any>
  ) {
  }

  thisWeekMax(d: Date) {
    const startDay = new Date('2019-10-20');
    const now = new Date();
    const day = now.getDay();
    const nextsunday = new Date();
    nextsunday.setDate(now.getDate() + 7 - day);
    return d.getTime() < nextsunday.getTime() && d.getTime() >= startDay.getTime();
  }

  ngOnInit() {
    // this._adapter.setLocale('fi')
    this.selectedDate = new Date();
    this.getLunchList(this.getDateToday(), undefined, undefined, this.showWholeWeek);
    this.getRestaurants();
  }

  getDistinct(value, index, self) {

    return self.indexOf(value) === index;
  }

  getDateToday() {
    const date = new Date();
    return this.dateToIntDate(date);
  }

  dateToIntDate(date) {
    return this.datePipe.transform(date, 'yyyyMMdd');
  }

  dateintToDate = dateint => {
    if (!dateint) {
      return;
    }
    var datestring = dateint.toString();
    var year = datestring.substring(0, 4);
    var month = datestring.substring(4, 6);
    var day = datestring.substring(6, 8);

    return new Date(year, month - 1, day);
  };

  getLunchList(date?, restaurantid?, showHandheld?, showWholeWeek?) {
    var startDate = showWholeWeek ? this.dateToIntDate(this.getPreviousMonday(this.dateintToDate(date))) : date;
    var endDate = showWholeWeek ? this.dateToIntDate(this.getNextSunday(this.dateintToDate(date))) : date;
    let params = {};
    if (date) {
      params = {
        paiva: startDate,
        end: endDate,
        showHandheld: showHandheld == null || false ? false : showHandheld
      };
    }
    if (restaurantid) {
      params = {
        ravintolaid: restaurantid
      };
    }
    this.lunchListService.getLunchListRows(params).subscribe((res => {
      this.calculateLunchLists(res);
    }));
  }

  private calculateLunchLists(res: Listrow[]) {
    if (this.selectedRestaurant != null || this.showWholeWeek) {
      var distinctRestaurants = res.map(x => ({
        restaurantid: x.restaurantid,
        nimi: x.nimi,
        link: x.link
      })).filter((value, i, self) => self.findIndex(restr => restr.restaurantid == value.restaurantid) === i);
      var datesAsInt = res.map(x => parseInt(this.dateToIntDate(x.date)));
      var dateMin = Math.min(...datesAsInt);

      let dateMinTmp = this.getPreviousMonday(this.dateintToDate(dateMin));
      dateMin = parseInt(this.dateToIntDate(dateMinTmp));


      var dateMax = Math.max(...datesAsInt);
      let dateMaxTmp = this.getNextSunday(this.dateintToDate(dateMax));
      dateMax = parseInt(this.dateToIntDate(dateMaxTmp));

      console.log(dateMin, dateMax)
      var datesBetween = this.getDatesBetween(this.dateintToDate(dateMin), this.dateintToDate(dateMax));


      var rowsForMissing = [];
      for (const key in distinctRestaurants) {

        var datesWithList = res.filter(x => x.restaurantid == distinctRestaurants[key].restaurantid).map(x => x.date)
        var datesMissingList = datesBetween.filter(x => {
            return datesWithList.find(y => {
              return this.dateToIntDate(x) === this.dateToIntDate(y)
            }) === undefined
          }
        );
        var rowsForMissingTmp = datesMissingList.map(x => ({
          date: x,
          restaurantid: distinctRestaurants[key].restaurantid,
          nimi: distinctRestaurants[key].nimi,
          lunch: 'Ei saatavilla',
          link: distinctRestaurants[key].link
        }))
        console.log(distinctRestaurants[key].nimi, rowsForMissingTmp.length)
        rowsForMissing.push(...rowsForMissingTmp);
      }

      console.log(rowsForMissing);
      this.lunchListRows.next(res.concat(rowsForMissing).sort((a, b) => parseInt(this.dateToIntDate(a.date)) - parseInt(this.dateToIntDate(b.date))).sort((a, b) => a.nimi > b.nimi ? 1 : -1));

    } else {
      this.lunchListRows.next(res);
    }
    this.loadingLunchLists = false;

  }

  getPreviousMonday = (date: Date) => {
    var day = date.getDay();
    var prevMonday;
    if (day === 0) {
      day = 7;
    }

    prevMonday = date.setDate(date.getDate() - day + 1);

    return prevMonday;
  }
  getNextSunday = (date) => {
    var day = date.getDay();
    var nextSunday;
    if (day === 0) {
      day = 7;
    }

    nextSunday = date.setDate(date.getDate() - day + 7);

    return nextSunday;
  }

  private addDays(date, daysToAdd) {
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }

  getDatesBetween(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate = this.addDays(currentDate, 1);
    }
    return dateArray;
  }

  getLunchListRestaurantPicker(event) {
    const tmpRestaurantID = event.value.ravintolaid;
    this.showWholeWeek = false;
    this.getLunchList(undefined, tmpRestaurantID, undefined, this.showWholeWeek);
  }

  getLunchListDatePicker(event) {
    this.selectedRestaurant = null;
    const tmpdate = this.dateToIntDate(event.value);
    this.getLunchList(tmpdate, undefined, this.showHandheldLists, this.showWholeWeek);
  }

  getRouteParams() {
    this.activatedRoute.params.subscribe(params => {
      this.routeParams = params;
    });
  }

  getRestaurants() {
    this.adminService.getRestaurants().subscribe((res => {
      res = res.filter(x => x.tassalista === 1);
      res.forEach(x => x.nimi = x.nimi.trim())
      this.restaurants.next(res.sort((a, b) => {
        if (a.nimi > b.nimi) {
          return 1;
        }
        if (a.nimi < b.nimi) {
          return -1;
        }
        return 0;
      }));
    }));
  }

  changeLink($event: MatCheckboxChange) {
    this.getLunchList(this.dateToIntDate(this.selectedDate), undefined, this.showHandheldLists, this.showWholeWeek);
  }

  changeWholeWeekToggle($event: MatCheckboxChange) {
    this.selectedRestaurant = this.showWholeWeek ? undefined : this.selectedRestaurant;
    this.getLunchList(this.dateToIntDate(this.selectedDate), undefined, this.showHandheldLists, this.showWholeWeek);
  }
}
