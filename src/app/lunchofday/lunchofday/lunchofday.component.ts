import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-lunchofday',
  templateUrl: './lunchofday.component.html',
  styleUrls: ['./lunchofday.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LunchofdayComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
