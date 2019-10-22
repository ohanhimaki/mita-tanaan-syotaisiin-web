import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LunchListComponent } from './lunch-list/lunch-list/lunch-list.component';

const routes: Routes = [
  {
    path: '',
    component: LunchListComponent
  }, {
    path: 'ravintola/:ravid',
    component: LunchListComponent
  },
  {
    path: 'paiva/:paiva',
    component: LunchListComponent
  },
  {
    path: '**',
    redirectTo: ''
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
