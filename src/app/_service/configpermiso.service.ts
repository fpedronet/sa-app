import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { MenuResponse } from '../_model/configuracion/menu';
import { Permiso } from './../_model/permiso';

@Injectable({
  providedIn: 'root'
})
export class ConfigPermisoService {

  constructor(
    private http: HttpClient,
    ) { }
    
  private url: string = `${environment.UrlApi}/configpermiso`;
  
  listar() {
    let urls = `${this.url}/GetAllOpcionMenu`;
    return this.http.get<MenuResponse>(urls);
  }

  configmenu() {
    let urls = `${this.url}/GetAllConfigMenu`;
    return this.http.get<MenuResponse>(urls);
  }

}
