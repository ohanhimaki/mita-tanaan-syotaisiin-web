import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchofdayTodayComponent } from './lunchofday-today.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { HttpClientModule } from '@angular/common/http';

describe('LunchofdayTodayComponent', () => {
  let component: LunchofdayTodayComponent;
  let fixture: ComponentFixture<LunchofdayTodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        HttpClientModule],
      declarations: [LunchofdayTodayComponent]
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
