import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LunchListComponent } from './lunch-list.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { LunchDetailsComponent } from '../lunch-details/lunch-details.component';
import { HttpModule } from '@angular/http';
import { DatePipe, APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AdminComponent } from 'src/app/admin/admin/admin.component';
import { EditRestaurantsComponent } from 'src/app/admin/edit-restaurants/edit-restaurants.component';
import { AddRestaurantComponent } from 'src/app/admin/add-restaurant/add-restaurant.component';
import { FormsModule } from '@angular/forms';

describe('LunchListComponent', () => {
  let component: LunchListComponent;
  let fixture: ComponentFixture<LunchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        HttpModule,
        AppRoutingModule,
        FormsModule
      ],
      declarations: [LunchListComponent,
        LunchDetailsComponent,
        AdminComponent,
        EditRestaurantsComponent,
        AddRestaurantComponent
      ],
      providers: [DatePipe,
        { provide: APP_BASE_HREF, useValue: '/' }]
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
