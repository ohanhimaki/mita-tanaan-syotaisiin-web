import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchofdayHistoryComponent } from './lunchofday-history.component';

describe('LunchofdayHistoryComponent', () => {
  let component: LunchofdayHistoryComponent;
  let fixture: ComponentFixture<LunchofdayHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LunchofdayHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunchofdayHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
