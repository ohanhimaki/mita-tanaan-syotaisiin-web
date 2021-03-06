import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AdminService } from '../admin.service';
import { AddRestaurantComponent } from '../add-restaurant/add-restaurant.component';
import { Restaurant } from 'src/app/shared/models/restaurant';
import { Restaurantgenre } from 'src/app/shared/models/restaurantgenre';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {
  private apikey: string;
  restaurants: Restaurant[];
  restaurantGenres: Restaurantgenre[];
  constructor(private _api: AdminService) { }

  ngOnInit() {
    this.getRestaurants();
    this.getRestaurantGenres();
  }

  salamoi(event) {
    console.log(event);
    this._api.salamoiAdmin(event);
  }
  async getRestaurants(event?) {
    this._api.getRestaurants().subscribe((res => {
      this.restaurants = res;
    }));
  }
  async getRestaurantGenres(event?) {
    this._api.getRestaurantGenres().subscribe((res => {
      this.restaurantGenres = res;
    }));
  }

}
