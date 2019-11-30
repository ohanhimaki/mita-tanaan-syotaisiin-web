import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchDetailsComponent } from './lunch-details.component';
import { MaterialModule } from 'src/app/shared/material.module';

describe('LunchDetailsComponent', () => {
  let component: LunchDetailsComponent;
  let fixture: ComponentFixture<LunchDetailsComponent>;

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
    // const compiled: HTMLElement = fixture.debugElement.nativeElement;
    // let ainnertext = compiled.querySelector('a');
    // ainnertext.innerText = 'testi';
    // fixture.detectChanges();
  });


  it('tobetruthy', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate', () => {
    expect(component).toBeDefined();
  });

  // it('lunchlist.teksti to span', () => {
  //   component.lunchList = [{
  //     apiid: 1337,
  //     nimi: 'testiravintola',
  //     paiva: 20191125,
  //     rivi: 0,
  //     teksti: 'testiriviteksti'
  //   }];
  //   fixture.detectChanges();
  //   const testi = fixture.debugElement.nativeElement.querySelector('div > span');
  //   console.log(testi);
  //   expect(testi).toEqual('testi');
  // });
});
