import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Listrow } from '../../shared/models/listrow';

@Component({
  selector: 'app-lunch-details',
  templateUrl: './lunch-details.component.html',
  styleUrls: ['./lunch-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LunchDetailsComponent implements OnInit {
  @Input() lunchList: Listrow;


  constructor() { }

  ngOnInit() {
  }

  thisday(date: string) {
    const datedate = new Date(date);
    const datetoday = new Date();
    return datedate.toString().substring(0, 15) === datetoday.toString().substring(0, 15)

  }

}
