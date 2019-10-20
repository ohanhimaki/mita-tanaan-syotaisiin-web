import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Listrow } from '../listrow';
import { LunchListService } from '../lunch-list.service';

@Component({
  selector: 'app-lunch-list',
  templateUrl: './lunch-list.component.html',
  styleUrls: ['./lunch-list.component.scss']
})
export class LunchListComponent implements OnInit {

  lunchListRows: Listrow[] = [];
  lunchListsByRestaurants: Listrow[][] = [[]];
  uniqueRestaurantIDs: number[];


  constructor(private lunchListService: LunchListService) { }

  ngOnInit() {
    this.lunchListService
      .getLunchListRows()
      .then((lunchListRows: Listrow[]) => {
        this.lunchListRows = lunchListRows
      }).then(x => {

        this.uniqueRestaurantIDs = this.lunchListRows.map(x => x.ravintolaid).filter(this.getDistinct);

        this.uniqueRestaurantIDs.forEach(x => {
          let tmpList = this.lunchListRows.filter(row => row.ravintolaid === x);

          this.lunchListsByRestaurants.push(tmpList);
        });
      });


  }

  getDistinct(value, index, self) {
    let tulos = self.indexOf(value) === index;

    return self.indexOf(value) === index;
  }


}
