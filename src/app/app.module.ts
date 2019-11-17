import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LunchDetailsComponent } from './lunch-list/lunch-details/lunch-details.component';
import { LunchListComponent } from './lunch-list/lunch-list/lunch-list.component';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePipe } from '@angular/common';
import { AdminComponent } from './admin/admin/admin.component';
import { EditRestaurantsComponent } from './admin/edit-restaurants/edit-restaurants.component';
import { FormsModule } from '@angular/forms';
import { AddRestaurantComponent } from './admin/add-restaurant/add-restaurant.component';


@NgModule({
  declarations: [
    AppComponent,
    LunchDetailsComponent,
    LunchListComponent,
    AdminComponent,
    EditRestaurantsComponent,
    AddRestaurantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
