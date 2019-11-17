import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Restaurant } from 'src/app/shared/models/restaurant';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRestaurantComponent implements OnInit {
  restaurant = new Restaurant();
  apikey = '';
  constructor(private _api: AdminService) { }

  ngOnInit() {
  }
  addRestaurant() {
    const vastaus = this._api.addRestaurant(this.restaurant, this.apikey);
    console.log(vastaus);
  }


}
