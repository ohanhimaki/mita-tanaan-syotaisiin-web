import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRestaurantsComponent } from './edit-restaurants.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditRestaurantsComponent', () => {
  let component: EditRestaurantsComponent;
  let fixture: ComponentFixture<EditRestaurantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        HttpModule,
        BrowserAnimationsModule
      ],
      declarations: [EditRestaurantsComponent]
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
