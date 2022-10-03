import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';

import { HomeComponent } from './home/home.component';

import { Not403Component } from './configuracion/not403/not403.component';
import { LproductoComponent } from './dyn/lproducto/lproducto.component';

const routes: Routes = [
  {path:'inicio', component: HomeComponent},

  {path: 'not-403', component: Not403Component},

  /********* Como ejemplo *******/
  {path:'dyn/producto', component: LproductoComponent, canActivate: [GuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }