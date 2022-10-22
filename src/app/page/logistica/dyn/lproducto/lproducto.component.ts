import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { FproductoComponent } from '../fproducto/fproducto.component';

import { Producto } from 'src/app/_model/dyn/producto';
import { Combobox } from 'src/app/_model/combobox';

import { environment } from 'src/environments/environment';
import jsonEstado from 'src/assets/json/estadodyn.json';

import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { ProductoService } from 'src/app/_service/ingenieria/producto.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';

@Component({
  selector: 'app-lproducto',
  templateUrl: './lproducto.component.html',
  styleUrls: ['./lproducto.component.css']
})
export class LproductoComponent implements OnInit {

  dataSource: Producto[] = [];
  displayedColumns: string[] = ['cod1', 'cod2', 'descripcion', 'unidadMed','uniNeg','linNeg','unidadMedComp', 'registro', 'temperatura','codEqv','cateCmd','subCateCmd','observaciones','estado','factConver','fecExpiraObligado'];

  loading = true;
  existRegistro = false;
  countRegistro = 0;
  estado = "";
  claseEstado = "";

  tablasMaestras = ['UMED|GINV|UNEG|LIN|TEMP|ESTG'];
  listaUnidadMed: Combobox[] = [];
  listaGrupoInv: Combobox[] = [];
  listaUnidadNeg: Combobox[] = [];
  listaUnidadMedComp: Combobox[] = [];
  listaLineaNeg: Combobox[] = [];
  listaTemmperatura: Combobox[] = [];
  listaEstado: Combobox[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private comboboxService: ComboboxService,
    private spinnerService: SpinnerService,
  ) { }


  ngOnInit(): void {
    this.listarOpciones()
  }

  cargarFiltro(){
    let filtro = this.usuarioService.sessionFiltro();
    
    if(filtro!=null){ 
      localStorage.setItem(environment.CODIGO_FILTRO, filtro![0]+"|"+filtro![1]+"|"+filtro![2]+"|"+filtro![3]);
    }else{
      localStorage.setItem(environment.CODIGO_FILTRO, ""+"|"+""+"|"+""+"|"+"Todos");
    }
  
    this.estado =filtro ==null? "Todos" : filtro![3];
    var objEstado = jsonEstado.find((e: any) => e.vDescripcion === this.estado);
    this.claseEstado = objEstado.class;

  }

  listarOpciones(){
    this.comboboxService.listarOpciones(this.tablasMaestras).subscribe(data=>{
        var tbCombobox: Combobox[] = data.items;
        this.listaUnidadMed = this.obtenerSubtabla(tbCombobox,'UMED');
        this.listaUnidadNeg = this.obtenerSubtabla(tbCombobox,'UNEG');

        this.listaLineaNeg = this.obtenerSubtabla(tbCombobox,'LIN');
        this.listaTemmperatura = this.obtenerSubtabla(tbCombobox,'TEMP');
        this.listaEstado = this.obtenerSubtabla(tbCombobox,'ESTG');
    });   
  }

  ngAfterViewInit() {  
    this.cargarFiltro();
    this.productoService = new ProductoService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          let filtro = this.usuarioService.sessionFiltro();

          return this.productoService!.listar(
            filtro![0],
            filtro![1],
            filtro![2],
            filtro![3],
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
    const dialogRef =this.dialog.open(FproductoComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){
        this.paginator.pageIndex = 0,
        this.paginator.pageSize = 12
        this.ngAfterViewInit();
        }
    })
  }

  actualizar(){
    this.ngAfterViewInit();
  }

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.codTabla?.toString()?.trim() === cod);
  }
  
  guardar(codigo: string, columna: string, event: any, select: boolean = false){
    let model = new Producto();

    model.codigo = codigo;
    model.columna = columna;
    model.valor = (select==true)? event : event.target.value;
    
    this.productoService.guardar(model).subscribe(data=>{
      });
  }

  exportar(){
    this.spinnerService.showLoading();
    let filtro = this.usuarioService.sessionFiltro();

    this.productoService.exportar(filtro![0],filtro![1],filtro![2], filtro![3],)
      .subscribe(
        data => {
          this.spinnerService.hideLoading();

          let fecha = new Date();
          let anio = fecha.getFullYear()+""+fecha.getMonth()+1+""+fecha.getDay();

          let NomFile = "ProductoDyn" + anio + ".xlsx";

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
