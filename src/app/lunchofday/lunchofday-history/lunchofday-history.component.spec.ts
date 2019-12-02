import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchofdayHistoryComponent } from './lunchofday-history.component';
import { MaterialModule } from 'src/app/shared/material.module';

describe('LunchofdayHistoryComponent', () => {
  let component: LunchofdayHistoryComponent;
  let fixture: ComponentFixture<LunchofdayHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [LunchofdayHistoryComponent]
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
