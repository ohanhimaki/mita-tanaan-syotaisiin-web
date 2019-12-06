import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Restaurantgenre } from 'src/app/shared/models/restaurantgenre';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-edit-genre',
  templateUrl: './edit-genre.component.html',
  styleUrls: ['./edit-genre.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditGenreComponent implements OnInit {
  @Output() refreshGenres: EventEmitter<any> = new EventEmitter();
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
    response.finally(() => {
      this.refreshGenres.emit(null);
      alert('Genreä päivitettiin');
    });

  }
  deleteRestaurantGenre() {
    const response = this._api.deleteRestaurantGenre(this.restaurantGenre, this.apikey);
    response.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
    response.finally(() => {
      alert('Genre poistettiin');
      this.refreshGenres.emit(null);
    });
  }
  createRestaurantGenre() {
    const response = this._api.createRestaurantGenre(this.restaurantGenre, this.apikey);
    response.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
    response.finally(() => {
      alert('Genre luotiin');
      this.refreshGenres.emit(null);
    });
  }
}
