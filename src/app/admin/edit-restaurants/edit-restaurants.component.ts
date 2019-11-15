import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-edit-restaurants',
  templateUrl: './edit-restaurants.component.html',
  styleUrls: ['./edit-restaurants.component.scss']
})
export class EditRestaurantsComponent implements OnInit {
  @Input() restaurants: any[];
  restaurant: any;
  constructor() { }

  ngOnInit() {
  }

  testi(test) {
    console.log(test);
  }
}
