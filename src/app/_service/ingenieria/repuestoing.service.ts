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

  listar(data: string, fecha: Date, page: number,pages: number, column: string, order: SortDirection) {
    let urls = `${this.url}/GetAllRepuestoIng`;
    let req = new RepuestoIngRequest();
    
    req.data =  (data=="Todos")? null! : data;
    req.fecha = (fecha==null)?null!:fecha.toISOString().slice(0, 10);
    req.page =  page!+1;
    req.pages =  pages;
    req.column = (column==undefined)?'':column;
    req.order = order;

    return this.http.post<dataCollection>(urls,req);
  }

  exportar(data: string, fecha: Date) {
    let dats =  (data=="Todos")? "" : data;
    let date = (fecha==null)?"":fecha.toISOString().slice(0, 10);

    let href = `${this.urlRe}/GetExportarRepuestoIng`;
    let urls = `${href}?data=${dats}&fecha=${date}`;

    return this.http.get<string>(urls);
  }

  listarIngeniero() {
    let urls = `${this.url}/GetAllIngeniero`;
    let req = new RepuestoIngRequest();

    return this.http.get<dataCollection>(urls);
  }
  
}
