import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Listrow } from '../../shared/models/listrow';
import { LunchListService } from '../lunch-list.service';
import { DatePipe } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { Restaurant } from 'src/app/shared/models/restaurant';

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
  constructor(private lunchListService: LunchListService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService
  ) {
  }

  ngOnInit() {

    this.getLunchList(this.getDateToday());
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
  getLunchList(date) {
    console.log(date);

    const params = {
      paiva: date
    };



    this.lunchListService.getLunchListRows(params).subscribe((res => {
      this.lunchListRows.next(res);
    }));
  }
  getLunchListDatePicker(event) {
    const tmpdate = this.dateToIntDate(event.value);
    console.log(tmpdate);
    this.getLunchList(tmpdate);
  }

  getRouteParams() {
    this.activatedRoute.params.subscribe(params => {
      this.routeParams = params;
    });
  }

  getRestaurants() {
    this.adminService.getRestaurants().subscribe((res => {
      this.restaurants.next(res);
    }));
  }

}
