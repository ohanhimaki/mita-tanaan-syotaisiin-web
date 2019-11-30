import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchDetailsComponent } from './lunch-details.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { exec } from 'child_process';

describe('LunchDetailsComponent', () => {
  let component: LunchDetailsComponent;
  let fixture: ComponentFixture<LunchDetailsComponent>;

  const restaurantName = 'testRestaurant';
  const date = 20191125;
  const contentRow = 'testrow text';
  const apiid = 1337;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule
      ],
      declarations: [LunchDetailsComponent]
    });

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


    component.lunchList = [{
      apiid: 1337,
      nimi: restaurantName,
      paiva: date,
      rivi: 0,
      teksti: contentRow
    }];
    fixture.detectChanges();
  });


  it('tobetruthy', () => {
    expect(component).toBeTruthy();
  });


  it('Restaurant name to title', () => {
    const title = fixture.debugElement.nativeElement.querySelector('mat-card-title>a');

    expect(title.innerText).toEqual(restaurantName);
  });
  it('Date to subtitle', () => {
    const subtitle = fixture.debugElement.nativeElement.querySelector('mat-card-subtitle');

    expect(subtitle.innerText).toContain(date.toString().substring(0, 4));
    expect(subtitle.innerText).toContain(date.toString().substring(4, 2));
    expect(subtitle.innerText).toContain(date.toString().substring(6, 2));
  });
  it('Row text to content', () => {
    const content = fixture.debugElement.nativeElement.querySelector('mat-card-content');
    expect(content.innerText).toContain(contentRow);
  });
  it('Title links to url containing apiid', () => {

    const title = fixture.debugElement.nativeElement.querySelector('mat-card-title>a');
    expect(title.href).toContain(apiid);
  })
});
