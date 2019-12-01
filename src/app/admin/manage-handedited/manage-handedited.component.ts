import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Restaurant } from 'src/app/shared/models/restaurant';
import { AdminService } from '../admin.service';
import { Handeditedrow } from 'src/app/shared/models/handeditedrow';
import { filter } from 'minimatch';

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
  public apikey = '';
  constructor(private _api: AdminService) { }
  public handEditedrows: Handeditedrow[] = [];
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
    this.handEditedrows.forEach(handEditedRow => {
      this._api.updateHandEditedRows(handEditedRow, this.apikey);
    });
  }
  getHandEdited(restaurant: Restaurant) {
    this._api.getHandEditedRows(restaurant).subscribe((res => {
      this.handEditedrows = res;
    }));
  }
  newHandEditedRow() {
    const newRow: Handeditedrow = {
      ravintolaid: this.restaurant.ravintolaid,
      rivi: this.handEditedrows.length,
      teksti: ''
    };
    this.handEditedrows.push(newRow);
  }
}
