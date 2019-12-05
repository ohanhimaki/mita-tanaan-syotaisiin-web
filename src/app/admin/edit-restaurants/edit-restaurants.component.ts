import { Component, OnInit, Input } from '@angular/core';
import { Restaurant } from 'src/app/shared/models/restaurant';
import { AdminService } from '../admin.service';
import { Restaurantgenre } from 'src/app/shared/models/restaurantgenre';
import { BehaviorSubject, Observable } from 'rxjs';
import { Genreofrestaurant } from 'src/app/shared/models/genreofrestaurant';


@Component({
  selector: 'app-edit-restaurants',
  templateUrl: './edit-restaurants.component.html',
  styleUrls: ['./edit-restaurants.component.scss']
})
export class EditRestaurantsComponent implements OnInit {
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
  }
  updateRestaurant() {
    const vastaus = this._api.updateRestaurant(this.restaurant, this.apikey);
    console.log(vastaus);
  }
  deleteRestaurant() {
    const vastaus = this._api.deleteRestaurant(this.restaurant, this.apikey);
    console.log(vastaus);

  }
  removeGenre(params: Genreofrestaurant) {
    const vastaus = this._api.deleteGenreofRestaurant(params, this.apikey);
  }
}
