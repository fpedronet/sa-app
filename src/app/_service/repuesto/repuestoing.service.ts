import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { dataCollection } from 'src/app/_model/dataCollection';
import { RepuestoIngRequest } from 'src/app/_model/ingenieria/repuestoing';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepuestoingService {

  private url: string = `${environment.UrlApi}/repuestoing`;
  private urlRe: string = `${environment.UrlApi}/reporte`;

  constructor(
    private http: HttpClient
  ) { }

  listar(page: number,pages: number, column: string, order: SortDirection) {
    let urls = `${this.url}/GetAllRepuestoIng`;
    let req = new RepuestoIngRequest();
    
    req.page =  page!+1;
    req.pages =  pages;
    req.column = (column==undefined)?'':column;
    req.order = order;

    return this.http.post<dataCollection>(urls,req);
  }

  exportar() {
    let urls = `${this.urlRe}/GetExportarProductoDyn`;

    return this.http.get<string>(urls);
  }
  
}
