import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchofdayComponent } from './lunchofday.component';
import { LunchofdayTodayComponent } from '../lunchofday-today/lunchofday-today.component';
import { LunchofdayHistoryComponent } from '../lunchofday-history/lunchofday-history.component';
import { MaterialModule } from 'src/app/shared/material.module';

describe('LunchofdayComponent', () => {
  let component: LunchofdayComponent;
  let fixture: ComponentFixture<LunchofdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [LunchofdayComponent,
        LunchofdayTodayComponent,
        LunchofdayHistoryComponent]
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
