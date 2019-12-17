import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Restaurant } from 'src/app/shared/models/restaurant';
import { AdminService } from '../admin.service';
import { Restaurantgenre } from 'src/app/shared/models/restaurantgenre';
import { BehaviorSubject, Observable } from 'rxjs';
import { Genreofrestaurant } from 'src/app/shared/models/genreofrestaurant';
import { MatCheckbox } from '@angular/material';
import { TouchSequence } from 'selenium-webdriver';


@Component({
  selector: 'app-edit-restaurants',
  templateUrl: './edit-restaurants.component.html',
  styleUrls: ['./edit-restaurants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRestaurantsComponent implements OnInit {
  @Output() refreshRestaurants: EventEmitter<any> = new EventEmitter();
  @Input() restaurants: Restaurant[];
  @Input() restaurantGenres: Restaurantgenre[];
  restaurant = new Restaurant();
  restaurantGenre = new Restaurantgenre();
  private genresofrestaurant: BehaviorSubject<Genreofrestaurant[]> = new BehaviorSubject(null);
  public genresofrestaurant$: Observable<Genreofrestaurant[]> = this.genresofrestaurant.asObservable();
  apikey = '';
  constructor(private _api: AdminService) { }

  ngOnInit() {
  }

  restaurantSelectionChanges() {
    this._api.getGenresOfRestaurant(this.restaurant.ravintolaid).subscribe((res => {
      this.genresofrestaurant.next(res);
    }));
  }

  addGenreToRestaurant() {
    const vastaus = this._api.addGenreToRestaurant(this.restaurant, this.restaurantGenre, this.apikey);
    vastaus.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
    vastaus.then(() => {
      this._api.getGenresOfRestaurant(this.restaurant.ravintolaid).subscribe((res => {
        this.genresofrestaurant.next(res);
      }));
    });
  }
  updateRestaurant() {
    let params: Restaurant = this.restaurant;
    params.tassalista = this.restaurant.tassalista ? 1 : 0;
    console.log(params);
    const vastaus = this._api.updateRestaurant(this.restaurant, this.apikey);
    vastaus.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
    vastaus.then(() => {
      alert('Ravintolaa päivitettiin');
    });
  }
  deleteRestaurant() {
    const vastaus = this._api.deleteRestaurant(this.restaurant, this.apikey);
    vastaus.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
    vastaus.then(() => {
      alert('Ravintola poistettiin');
      this.refreshRestaurants.emit(null);
    });


  }
  removeGenre(params: Genreofrestaurant) {
    const vastaus = this._api.deleteGenreofRestaurant(params, this.apikey);
    vastaus.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
    vastaus.then(() => {
      this.removeFromGenresOfRestaurant(params);
    });
  }
  removeFromGenresOfRestaurant(params: Genreofrestaurant) {
    const tmpArr: Genreofrestaurant[] = this.genresofrestaurant.getValue();
    tmpArr.forEach((item, index) => {
      if (item === params) { tmpArr.splice(index, 1); }
    });
    this.genresofrestaurant.next(tmpArr);
  }

}
