import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchofdayTmpComponent } from './lunchofday-tmp.component';

describe('LunchofdayTmpComponent', () => {
  let component: LunchofdayTmpComponent;
  let fixture: ComponentFixture<LunchofdayTmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LunchofdayTmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunchofdayTmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
