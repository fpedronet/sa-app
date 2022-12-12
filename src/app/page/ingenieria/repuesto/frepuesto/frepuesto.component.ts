import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Combobox } from 'src/app/_model/combobox';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { RepuestoingService } from 'src/app/_service/ingenieria/repuestoing.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-frepuesto',
  templateUrl: './frepuesto.component.html',
  styleUrls: ['./frepuesto.component.css']
})
export class FrepuestoComponent implements OnInit {

  dato? : string = "";

  fechaInicio = new Date();
  fechaSelectIni = new Date();
  listaIngeniero?: Combobox[] = [];

  constructor(
    private dialogRef: MatDialogRef<FrepuestoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinnerService : SpinnerService,
    private usuarioService: UsuarioService,
    private repuestoingService: RepuestoingService
  ) { }

  ngOnInit(): void {
    this.obtener();
  }

  obtener(){  
    this.spinnerService.showLoading();
    let filtro = this.usuarioService.sessionFiltro();

    this.repuestoingService.listarIngeniero().subscribe(data=>{
      
      this.listaIngeniero = data.items;

      if(filtro !== null){
        this.dato = filtro![0];
        this.fechaSelectIni = (filtro![1]=="")? null! :new Date(filtro![1]);
      }
      
    });   
    this.spinnerService.hideLoading();
  }

  selectestado(id: string){
    this.dato= id;
  }

  limpiar(){
    this.dato = "Todos";
    this.fechaSelectIni = null!;
  }

  buscar(){
    localStorage.setItem(environment.CODIGO_FILTRO, 
                        (this.dato===null?'':this.dato)+"|"+
                        (this.fechaSelectIni===null?'':this.fechaSelectIni));

    this.dialogRef.close();  
  }

}
