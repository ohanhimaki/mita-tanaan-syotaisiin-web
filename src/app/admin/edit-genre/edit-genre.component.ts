import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Restaurantgenre } from 'src/app/shared/models/restaurantgenre';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-edit-genre',
  templateUrl: './edit-genre.component.html',
  styleUrls: ['./edit-genre.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditGenreComponent implements OnInit {
  @Input() restaurantGenres: Restaurantgenre[];
  restaurantGenre = new Restaurantgenre;
  apikey = '';
  constructor(private _api: AdminService) { }

  ngOnInit() {
  }
  updateRestaurantGenre() {
    const response = this._api.updateRestaurantGenre(this.restaurantGenre, this.apikey);

    response.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });

  }
  deleteRestaurantGenre() {
    const response = this._api.deleteRestaurantGenre(this.restaurantGenre, this.apikey);
    response.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
  }
  createRestaurantGenre() {
    const response = this._api.createRestaurantGenre(this.restaurantGenre, this.apikey);
    response.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
  }
}
