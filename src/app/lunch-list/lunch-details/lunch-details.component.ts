import { Component, OnInit, Input } from '@angular/core';
import { Listrow } from '../../shared/models/listrow';

@Component({
  selector: 'app-lunch-details',
  templateUrl: './lunch-details.component.html',
  styleUrls: ['./lunch-details.component.scss']
})
export class LunchDetailsComponent implements OnInit {
  @Input() lunchList: Listrow;


  constructor() { }

  ngOnInit() {
  }

}
