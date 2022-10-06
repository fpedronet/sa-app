import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-frepuesto',
  templateUrl: './frepuesto.component.html',
  styleUrls: ['./frepuesto.component.css']
})
export class FrepuestoComponent implements OnInit {

  dato? : string;
  fecha? : string;

  constructor(
    private dialogRef: MatDialogRef<FrepuestoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinnerService : SpinnerService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.obtener();
  }

  obtener(){  
    this.spinnerService.showLoading();
    let filtro = this.usuarioService.sessionFiltro();
    
    if(filtro !== null){
      this.dato = filtro![0];
      this.fecha = filtro![1];
    }
    this.spinnerService.hideLoading();
  }

  selectestado(id: string){
    this.dato= id;
  }

  limpiar(){
    this.dato = "Todos";
    this.fecha = "";
  }

  buscar(){
    localStorage.setItem(environment.CODIGO_FILTRO, 
                        (this.dato===undefined?'':this.dato)+"|"+
                        (this.fecha===undefined?'':this.fecha));

    this.dialogRef.close();  
  }

}
