import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRestaurantComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
