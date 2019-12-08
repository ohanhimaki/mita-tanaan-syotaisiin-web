import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Restaurant } from 'src/app/shared/models/restaurant';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRestaurantComponent implements OnInit {
  @Output() refreshRestaurants: EventEmitter<any> = new EventEmitter();
  restaurant = new Restaurant();
  apikey = '';
  constructor(private _api: AdminService) { }

  ngOnInit() {
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
      this.refreshRestaurants.emit(null);
    });


  }


}
