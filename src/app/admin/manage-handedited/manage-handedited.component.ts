import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Restaurant } from 'src/app/shared/models/restaurant';
import { AdminService } from '../admin.service';
import { Handeditedrow } from 'src/app/shared/models/handeditedrow';
import { filter } from 'minimatch';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-manage-handedited',
  templateUrl: './manage-handedited.component.html',
  styleUrls: ['./manage-handedited.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageHandeditedComponent implements OnInit, OnChanges {
  @Input() restaurants: Restaurant[];
  public restaurantsFiltered: Restaurant[];
  public restaurant = new Restaurant();
  private handEditedRows: BehaviorSubject<Handeditedrow[]> = new BehaviorSubject(null);
  public handEditedRows$: Observable<Handeditedrow[]> = this.handEditedRows.asObservable();
  public apikey = '';
  constructor(private _api: AdminService) { }
  // public handEditedrows: Handeditedrow[] = [];
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.restaurants.currentValue) {
      this.restaurantsFiltered = changes
        .restaurants
        .currentValue
        .filter((x: Restaurant) => {
          return x.tassalista === 0;
        });
    }
  }
  updateHandEdited() {
    this.handEditedRows.getValue().forEach(handEditedRow => {
      const response = [];
      response.push(this._api.updateHandEditedRows(handEditedRow, this.apikey));

      Promise.all(response).then(results => {
        if (results.every(res => res.success)) {
          alert('Käsinylläpidettävä lista päivitettiin');
        }
      })
        .catch(x => {
          console.log(x);
          alert('Error ' + x.status + ' ' + x.statusText);
        });

    });
  }
  getHandEdited(restaurant: Restaurant) {
    this._api.getHandEditedRows(restaurant).subscribe((res => {
      this.handEditedRows.next(res);
    }));
  }
  newHandEditedRow() {
    const newRow: Handeditedrow = {
      ravintolaid: this.restaurant.ravintolaid,
      rivi: this.handEditedRows.getValue().length,
      teksti: ''
    };
    this.handEditedRows.next(this.handEditedRows.getValue().concat([newRow]));
  }
}
