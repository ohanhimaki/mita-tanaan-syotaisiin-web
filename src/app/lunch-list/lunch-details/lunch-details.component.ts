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
    this.allowedToVoteOnLoad = this.allowedToVote();
    this.lunchlistToTemplate.next(this.lunchList);
  }

  private getCurrentValue() {
    var localstrgValue = localStorage.getItem('votes'+this.lunchList.date);
    var currentValue:string[] =localstrgValue ? localstrgValue.split(',') : [];
    return currentValue;

  }

  thisday(date: string) {
    const datedate = new Date(date);
    const datetoday = new Date();
    return datedate.toString().substring(0, 15) === datetoday.toString().substring(0, 15)

  }
  voteThis(){

    if (!this.allowedToVote()) {
      alert("Saat äänestää vain kolmea kohdetta per päivä")
      this.allowedToVoteOnLoad = false;
      return;
    }
    localStorage.setItem('votes'+this.lunchList.date, ((localStorage.getItem('votes'+this.lunchList.date) != null ?
      localStorage.getItem('votes'+this.lunchList.date) : "")
      + this.lunchList.restaurantid.toString() + ",").toString())
    this.allowedToVoteOnLoad = false;

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

   allowedToVote() {
    var amountOfAllowed = 3
     var current = this.getCurrentValue();
    return current.indexOf(this.lunchList.restaurantid.toString())< 0 && current.length <=3;
  }
}
