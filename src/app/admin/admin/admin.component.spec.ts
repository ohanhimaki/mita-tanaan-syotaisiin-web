import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { EditRestaurantsComponent } from '../edit-restaurants/edit-restaurants.component';
import { AddRestaurantComponent } from '../add-restaurant/add-restaurant.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ManageHandeditedComponent } from '../manage-handedited/manage-handedited.component';
import { EditGenreComponent } from '../edit-genre/edit-genre.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule
      ],
      declarations: [AdminComponent,
        EditRestaurantsComponent,
        AddRestaurantComponent,
        ManageHandeditedComponent,
        EditGenreComponent
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
