import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Restaurant } from 'src/app/shared/models/restaurant';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss']
})
export class AddRestaurantComponent implements OnInit {
  @Output() refreshRestaurants: EventEmitter<any> = new EventEmitter();
  restaurant = new Restaurant();

  apikey = '';
  apiRestaurantUrlPrefix = 'https://tassa.fi/kohde/';
  constructor(private _api: AdminService) { }

  ngOnInit() {
  }
  changeLink(event?) {
    console.log(event);

    if (this.restaurant.tassalista) {

      this.restaurant.linkki = this.apiRestaurantUrlPrefix + this.restaurant.apiid;
    } else {
      console.log(this.restaurant.tassalista);

      this.restaurant.apiid = 0;
      this.restaurant.linkki = '';
    }
  }

  addRestaurant() {
    this.restaurant.tassalista = this.restaurant.tassalista ? 1 : 0;
    const response = this._api.addRestaurant(this.restaurant, this.apikey);
    response.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
    response.then(() => {
      alert('Ravintola lisättiin');
      this.restaurant = new Restaurant();
      this.refreshRestaurants.emit(null);
    });


  }


}
