import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private apikey: string;
  restaurants: any[];
  constructor(private _api: AdminService) { }

  ngOnInit() {
    this.getRestaurants();
  }

  salamoi(event) {
    console.log(event);
    this._api.salamoiAdmin(event);
  }
  async getRestaurants() {
    this.restaurants = await this._api.getRestaurants().then(x => x.json());
  }

}
