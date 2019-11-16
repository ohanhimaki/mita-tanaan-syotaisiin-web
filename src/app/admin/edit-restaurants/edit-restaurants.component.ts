import { Component, OnInit, Input } from '@angular/core';
import { Restaurant } from 'src/app/restaurant';
import { AdminService } from '../admin.service';


@Component({
  selector: 'app-edit-restaurants',
  templateUrl: './edit-restaurants.component.html',
  styleUrls: ['./edit-restaurants.component.scss']
})
export class EditRestaurantsComponent implements OnInit {
  @Input() restaurants: any[];
  restaurant = new Restaurant();
  apikey = '';
  constructor(private _api: AdminService) { }

  ngOnInit() {
  }

  updateRestaurant() {
    console.log(this.restaurant);
    let vastaus = this._api.updateRestaurant(this.restaurant, this.apikey);
    console.log(vastaus);
  }

}
