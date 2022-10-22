import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fproducto',
  templateUrl: './fproducto.component.html',
  styleUrls: ['./fproducto.component.css']
})
export class FproductoComponent implements OnInit {

  linea? : string;
  division? : string;
  producto? : string;
  estado?: string;

  constructor(
    private dialogRef: MatDialogRef<FproductoComponent>,
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
      this.linea = filtro![0];
      this.division = filtro![1];
      this.producto = filtro![2];
      this.estado = filtro![3];
    }
    this.spinnerService.hideLoading();
  }

  selectestado(id: string){
    this.estado= id;
  }

  limpiar(){
    this.linea = "";
    this.division = "";
    this.producto = "";
    this.estado = "Todos";
  }

  buscar(){
    localStorage.setItem(environment.CODIGO_FILTRO, 
                        (this.linea===undefined?'':this.linea)+"|"+
                        (this.division===undefined?'':this.division)+"|"+
                        (this.producto===undefined?'':this.producto)+"|"+                     
                        (this.estado));

    this.dialogRef.close();  
  }

}
