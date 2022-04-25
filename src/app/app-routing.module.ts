import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LunchListComponent } from './lunch-list/lunch-list/lunch-list.component';
import { AdminComponent } from './admin/admin/admin.component';
import { LunchofdayComponent } from './lunchofday/lunchofday/lunchofday.component';
import { LunchofdayTmpComponent } from './lunchofday-tmp/lunchofday-tmp/lunchofday-tmp.component';

const routes: Routes = [
  {
    path: '',
    component: LunchListComponent
  }, {
    path: 'lunchoftheday',
    component: LunchofdayComponent
  }, {
    path: 'lista/ravintola/:ravid',
    component: LunchListComponent
  },
  {
    path: 'lista/paiva/:paiva',
    component: LunchListComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'lunchofdaytmp',
    component: LunchofdayTmpComponent
  },
  {
    path: '*',
    redirectTo: ''
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
