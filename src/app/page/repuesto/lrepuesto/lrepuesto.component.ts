import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { RepuestoIng } from 'src/app/_model/ingenieria/repuestoing';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';

import { RepuestoingService } from 'src/app/_service/repuesto/repuestoing.service';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '../../component/spinner/spinner.service';
import { FrepuestoComponent } from '../frepuesto/frepuesto.component';

@Component({
  selector: 'app-lrepuesto',
  templateUrl: './lrepuesto.component.html',
  styleUrls: ['./lrepuesto.component.css']
})
export class LrepuestoComponent implements OnInit {

  dataSource: RepuestoIng[] = [];
  displayedColumns: string[] = ['codProd', 'codEqv', 'repuesto', 'reF1', 'reF4', 'vUltEnvio', 'codIng', 'ingeniero','prestamo','devolucion','saldo'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private repuestoingService: RepuestoingService,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
  }

  cargarFiltro(){
    let filtro = this.usuarioService.sessionFiltro();
    
    if(filtro!=null){ 
      localStorage.setItem(environment.CODIGO_FILTRO, filtro![0]+"|"+filtro![1]);
    }else{
      localStorage.setItem(environment.CODIGO_FILTRO, "Todos"+"|"+"");
    }

  }

  ngAfterViewInit() {  
    this.cargarFiltro();
    this.repuestoingService = new RepuestoingService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          let filtro = this.usuarioService.sessionFiltro();
          let fecha = (filtro![1]==null || filtro![1]=="")?null:new Date(filtro![1]);

          return this.repuestoingService!.listar(
            filtro![0],
            fecha!,
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

  abrirBusqueda(){
    const dialogRef =this.dialog.open(FrepuestoComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){
        this.paginator.pageIndex = 0,
        this.paginator.pageSize = 10
        this.ngAfterViewInit();
        }
    })
  }

  actualizar(){
    this.ngAfterViewInit();
  }

  exportar(){
    this.spinnerService.showLoading();

    let filtro = this.usuarioService.sessionFiltro();
    let fecha = (filtro![1]==null || filtro![1]=="")?null:new Date(filtro![1]);

    this.repuestoingService.exportar(filtro![0], fecha!,)
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
          // const fileURL = URL.createObjectURL(blob);          

          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Uso de Repuestos.xlsx';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // window.open(fileURL, `${NomFile}.xlsx`);
        }
      );
  }

}
