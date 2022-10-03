import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';

import { RepuestoIng } from 'src/app/_model/repuesto/repuestoing';
import { RepuestoingService } from 'src/app/_service/repuesto/repuestoing.service';
import { SpinnerService } from '../../component/spinner/spinner.service';

@Component({
  selector: 'app-lrepuesto',
  templateUrl: './lrepuesto.component.html',
  styleUrls: ['./lrepuesto.component.css']
})
export class LrepuestoComponent implements OnInit {

  dataSource: RepuestoIng[] = [];
  displayedColumns: string[] = ['CodProd', 'CodEqv', 'Repuesto', 'REF1', 'REF4', 'UltEnvio', 'CodIng', 'Ingeniero','Prestamo','Devolucion','Saldo'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private repuestoingService: RepuestoingService,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {  
    this.repuestoingService = new RepuestoingService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {

          return this.repuestoingService!.listar(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {
           this.loading = false;
           this.existRegistro = res === null;

          if (res === null) {
            return [];
          }

          this.countRegistro = res.pagination.total;
          return res.items;
        }),
      ).subscribe(data => (this.dataSource = data));
  
  }

  actualizar(){
    this.ngAfterViewInit();
  }

  exportar(){
    this.spinnerService.showLoading();

    this.repuestoingService.exportar()
      .subscribe(
        data => {
          this.spinnerService.hideLoading();

          let fecha = new Date();
          let anio = fecha.getFullYear()+""+fecha.getMonth()+1+""+fecha.getDay();

          let NomFile = "RpuestoIng" + anio + ".xlsx";

          let byteChar = atob(data);
          let byteArray = new Array(byteChar.length);
          for(let i = 0; i < byteChar.length; i++){
            byteArray[i] = byteChar.charCodeAt(i);
          }
          let uIntArray = new Uint8Array(byteArray);
          let blob = new Blob([uIntArray], {type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'});
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, `${NomFile}.xlsx`);
        }
      );
  }

}
