import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';

import { HomeComponent } from './home/home.component';

import { Not403Component } from './configuracion/not403/not403.component';
import { LproductoComponent } from './logistica/dyn/lproducto/lproducto.component';
import { LrepuestoComponent } from './ingenieria/repuesto/lrepuesto/lrepuesto.component';
import { ImportarproductoComponent } from './logistica/importarproducto/importarproducto.component';


const routes: Routes = [
  {path:'home', component: HomeComponent},

  {path: 'not-403', component: Not403Component},

  /********* Como ejemplo *******/
  {path:'dyn/producto', component: LproductoComponent, canActivate: [GuardService]},
  {path:'dyn/importarproducto', component: ImportarproductoComponent, canActivate: [GuardService]},
  {path:'ingenieria/repuesto', component: LrepuestoComponent, canActivate: [GuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
