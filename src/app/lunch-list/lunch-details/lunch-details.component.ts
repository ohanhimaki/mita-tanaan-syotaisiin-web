import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Listrow } from '../../shared/models/listrow';
import {LunchListService} from "../lunch-list.service";

@Component({
  selector: 'app-lunch-details',
  templateUrl: './lunch-details.component.html',
  styleUrls: ['./lunch-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LunchDetailsComponent implements OnInit {
  @Input() lunchList: Listrow;


  constructor(private lunchListService: LunchListService) { }

  ngOnInit() {
  }

  thisday(date: string) {
    const datedate = new Date(date);
    const datetoday = new Date();
    return datedate.toString().substring(0, 15) === datetoday.toString().substring(0, 15)

  }
  voteThis(){


    const vastaus = this.lunchListService.UpvoteLunch(this.lunchList.restaurantid, this.lunchList.date);
    vastaus.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
    vastaus.then(() => {
      alert('Hurray äänestys onnistui');
    });
  }

}
