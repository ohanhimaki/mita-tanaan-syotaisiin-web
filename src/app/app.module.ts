import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LunchDetailsComponent } from './lunch-list/lunch-details/lunch-details.component';
import { LunchListComponent } from './lunch-list/lunch-list/lunch-list.component';
import { HttpModule } from '@angular/http';



@NgModule({
  declarations: [
    AppComponent,
    LunchDetailsComponent,
    LunchListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
