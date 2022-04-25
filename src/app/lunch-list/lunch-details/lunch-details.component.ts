import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Listrow } from '../../shared/models/listrow';
import {LunchListService} from "../lunch-list.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-lunch-details',
  templateUrl: './lunch-details.component.html',
  styleUrls: ['./lunch-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LunchDetailsComponent implements OnInit {
  @Input() lunchList: Listrow;
  allowedToVoteOnLoad = true;

  lunchlistToTemplate: BehaviorSubject<Listrow> = new BehaviorSubject<Listrow>(null);
  lunchlistToTemplate$ = this.lunchlistToTemplate.asObservable();


  constructor(private lunchListService: LunchListService) { }

  ngOnInit() {
    this.allowedToVoteOnLoad = this.getCurrentValue()<3;
    this.lunchlistToTemplate.next(this.lunchList);
  }

  private getCurrentValue() {
    var localstrgValue = localStorage.getItem('votes'+this.lunchList.date);
    var currentValue = localstrgValue == null ? 0 : parseInt( localstrgValue );
    return currentValue;

  }

  thisday(date: string) {
    const datedate = new Date(date);
    const datetoday = new Date();
    return datedate.toString().substring(0, 15) === datetoday.toString().substring(0, 15)

  }
  voteThis(){

    if (this.getCurrentValue() >=3) {
      alert("Saat äänestää vain kolmea kohdetta per päivä")
      this.allowedToVoteOnLoad = false;
      return;
    }
    localStorage.setItem('votes'+this.lunchList.date, (this.getCurrentValue()+1).toString())


    const vastaus = this.lunchListService.UpvoteLunch(this.lunchList.restaurantid, this.lunchList.date);
    vastaus.catch(x => {
      console.log(x);
      alert('Error ' + x.status + ' ' + x.statusText);
    });
    vastaus.then(() => {
      // alert('Hurray äänestys onnistui');
      this.lunchList.votes++;
      this.ngOnInit();
    });
  }

}
