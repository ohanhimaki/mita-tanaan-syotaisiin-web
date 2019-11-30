import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { AddRestaurantComponent } from '../add-restaurant/add-restaurant.component';
import { Restaurant } from 'src/app/shared/models/restaurant';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private apikey: string;
  restaurants: Restaurant[];
  constructor(private _api: AdminService) { }

  ngOnInit() {
    this.getRestaurants();
  }

  salamoi(event) {
    console.log(event);
    this._api.salamoiAdmin(event);
  }
  async getRestaurants() {
    this._api.getRestaurants().subscribe((res => {
      this.restaurants = res;
    }));
  }

}
