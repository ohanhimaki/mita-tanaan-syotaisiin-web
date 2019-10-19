import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchListComponent } from './lunch-list.component';

describe('LunchListComponent', () => {
  let component: LunchListComponent;
  let fixture: ComponentFixture<LunchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LunchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LunchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
