import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchofdayTmpComponent } from './lunchofday-tmp.component';
import { MaterialModule } from '../../shared/material.module';
import { HttpClientModule } from '@angular/common/http';

describe('LunchofdayTmpComponent', () => {
  let component: LunchofdayTmpComponent;
  let fixture: ComponentFixture<LunchofdayTmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      imports: [MaterialModule,
        HttpClientModule],
      declarations: [LunchofdayTmpComponent]
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
