import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchofdayComponent } from './lunchofday.component';

describe('LunchofdayComponent', () => {
  let component: LunchofdayComponent;
  let fixture: ComponentFixture<LunchofdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LunchofdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunchofdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
