import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ConfirmComponent } from './component/confirm/confirm.component';
import { LayoutComponent } from './component/layout/layout.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PageRoutingModule } from './page-routing.module';
import { InterceptorService } from '../_interceptors/interceptor.service';
import { Not404Component } from './configuracion/not404/not404.component';
import { Not403Component } from './configuracion/not403/not403.component';
import { PerfilComponent } from './component/perfil/perfil.component';
import { LproductoComponent } from './dyn/lproducto/lproducto.component';
import { FproductoComponent } from './dyn/fproducto/fproducto.component';


@NgModule({
  declarations: [
    ConfirmComponent,
    LayoutComponent,
    HomeComponent,
    Not404Component,
    Not403Component,
    PerfilComponent,
    LproductoComponent,
    FproductoComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PageRoutingModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true,
  },
  {
    provide:LocationStrategy,
    useClass:HashLocationStrategy
  }
],
})

export class PageModule { }
