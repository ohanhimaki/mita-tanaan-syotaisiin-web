import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRestaurantsComponent } from './edit-restaurants.component';

describe('EditRestaurantsComponent', () => {
  let component: EditRestaurantsComponent;
  let fixture: ComponentFixture<EditRestaurantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRestaurantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
