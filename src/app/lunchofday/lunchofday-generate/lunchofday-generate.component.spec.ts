import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchofdayGenerateComponent } from './lunchofday-generate.component';

describe('LunchofdayGenerateComponent', () => {
  let component: LunchofdayGenerateComponent;
  let fixture: ComponentFixture<LunchofdayGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LunchofdayGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunchofdayGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
