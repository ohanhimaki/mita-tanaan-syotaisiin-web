import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private apikey: string;
  constructor(private _api: AdminService) { }

  ngOnInit() {
  }

  salamoi(event) {
    console.log(event);
    this._api.salamoiAdmin(event);
  }
}
