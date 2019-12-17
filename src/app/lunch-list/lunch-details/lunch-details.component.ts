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

}
