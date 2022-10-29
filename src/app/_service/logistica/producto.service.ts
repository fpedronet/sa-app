import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { dataCollection } from 'src/app/_model/dataCollection';
import { Producto, ProductoRequest } from 'src/app/_model/dyn/producto';
import { Response } from 'src/app/_model/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url: string = `${environment.UrlApi}/producto`;
  private urlRe: string = `${environment.UrlApi}/reporte`;

  constructor(
    private http: HttpClient
  ) { }

  listar(linea: string,division: string,producto: string,estado: string, page: number,pages: number, column: string, order: SortDirection) {
    let urls = `${this.url}/GetAllProductoDyn`;
    let req = new ProductoRequest();
    req.linea = linea;
    req.division = division;
    req.producto = producto;
    req.estado = estado;
    req.page =  page!+1;
    req.pages =  pages;
    req.column = (column==undefined)?'':column;
    req.order = order;

    return this.http.post<dataCollection>(urls,req);
  }

  guardar(model: Producto){
    let urls = `${this.url}/PostSaveProductoDyn`;
    return this.http.post<Response>(urls, model);
  }

  exportar(linea: string,division: string,producto: string,estado: string) {
    let href = `${this.urlRe}/GetExportarProductoDyn`;
    let urls = `${href}?linea=${linea}&division=${division}&producto=${producto}&estado=${estado}`;

    return this.http.get<string>(urls);
  }

  buscarproducto(producto: string){
    let req = new  ProductoRequest();
    req.producto = producto;

    let urls = `${this.url}/GetAllProductoDynExcel`;
    return this.http.post<dataCollection>(urls,req);
  }

  guardarexcel(model: Producto){
    let urls = `${this.url}/PostSaveProductoDynExcel`;
    return this.http.post<Response>(urls, model);
  }

}
