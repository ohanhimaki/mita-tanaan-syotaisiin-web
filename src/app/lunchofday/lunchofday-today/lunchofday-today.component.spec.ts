import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchofdayTodayComponent } from './lunchofday-today.component';

describe('LunchofdayTodayComponent', () => {
  let component: LunchofdayTodayComponent;
  let fixture: ComponentFixture<LunchofdayTodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LunchofdayTodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunchofdayTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
