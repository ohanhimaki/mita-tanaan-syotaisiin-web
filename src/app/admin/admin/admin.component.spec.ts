import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { EditRestaurantsComponent } from '../edit-restaurants/edit-restaurants.component';
import { AddRestaurantComponent } from '../add-restaurant/add-restaurant.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        HttpModule,
        BrowserAnimationsModule
      ],
      declarations: [AdminComponent,
        EditRestaurantsComponent,
        AddRestaurantComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
