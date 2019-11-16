import { Component, OnInit, Input } from '@angular/core';
import { LunchListService } from 'src/app/lunch-list/lunch-list.service';
import { Restaurant } from 'src/app/restaurant';


@Component({
  selector: 'app-edit-restaurants',
  templateUrl: './edit-restaurants.component.html',
  styleUrls: ['./edit-restaurants.component.scss']
})
export class EditRestaurantsComponent implements OnInit {
  @Input() restaurants: any[];
  restaurant = new Restaurant();
  constructor(private _api: LunchListService) { }

  ngOnInit() {
  }

  updateRestaurant() {
    console.log(this.restaurant);
    let vastaus = this._api.updateRestaurant(this.restaurant);
    console.log(vastaus);
  }

}
