import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-lunchofday-today',
  templateUrl: './lunchofday-today.component.html',
  styleUrls: ['./lunchofday-today.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LunchofdayTodayComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
