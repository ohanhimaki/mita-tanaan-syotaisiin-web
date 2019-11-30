import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchListComponent } from './lunch-list.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { LunchDetailsComponent } from '../lunch-details/lunch-details.component';
import { HttpModule } from '@angular/http';
import { DatePipe, APP_BASE_HREF } from '@angular/common';
import { AdminComponent } from 'src/app/admin/admin/admin.component';
import { EditRestaurantsComponent } from 'src/app/admin/edit-restaurants/edit-restaurants.component';
import { AddRestaurantComponent } from 'src/app/admin/add-restaurant/add-restaurant.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LunchListComponent', () => {
  let component: LunchListComponent;
  let fixture: ComponentFixture<LunchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        HttpModule,
        RouterTestingModule,
        FormsModule
      ],
      declarations: [LunchListComponent,
        LunchDetailsComponent
      ],
      providers: [DatePipe,
        { provide: APP_BASE_HREF, useValue: '/' }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunchListComponent);
    component = fixture.componentInstance;
    const test1 = {
      apiid: 1,
      nimi: 'test',
      paiva: 20191130,
      rivi: 0,
      teksti: 'qwerty'
    };
    const test2 = {
      apiid: 1,
      nimi: 'test',
      paiva: 20191130,
      rivi: 0,
      teksti: 'asdf'
    };
    component.lunchListsByRestaurants.push([test1]);
    component.lunchListsByRestaurants.push([test2]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filtering with getDistinct should return unique values', () => {
    let test = [1, 1, 2];
    test = test.filter(component.getDistinct);
    expect(test).toEqual([1, 2]);
  });
  it('Shows lunch-details component for every item array in lunchListsByRestaurants array.', () => {

    fixture.detectChanges();

    const lunchDetails = fixture.debugElement.nativeElement.querySelectorAll('app-lunch-details');
    expect(lunchDetails[0].innerText).toContain('qwerty');
    expect(lunchDetails[1].innerText).toContain('asdf');
  });
});
