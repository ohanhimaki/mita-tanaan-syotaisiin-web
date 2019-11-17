import { Component, OnInit, Input } from '@angular/core';
import { Restaurant } from 'src/app/shared/models/restaurant';
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
    const vastaus = this._api.updateRestaurant(this.restaurant, this.apikey);
    console.log(vastaus);
  }

}
