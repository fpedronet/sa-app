import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { ConfigPermisoService } from './../../../_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { Menu } from 'src/app/_model/configuracion/menu';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {


  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  menus: Menu[] = [];
  codigo?:string;
  panelOpenState = false;
  count=false;
  empresa?: string = "";
  logo?: string =environment.UrlImage + "logoMenu.png";
  user?: string =environment.UrlImage + "userMenu.png";
  iconSharePoint?: string =environment.UrlImage + "sharePoint-2.png";
  username: string = "";
  userdni: string = "";
  isshow: boolean = false;
  interval:any;

  ngOnInit(): void {
    this.listar();   
  }

  listar(){
 
    let session = this.usuarioService.sessionUsuario();

    if(session!=null){
      this.username= session.nombreConocido.toUpperCase();
      this.userdni =  session.dniEmp;
      this.user = session.strFoto !== ''?session.strFoto : this.user;
      
      this.menus = this.configPermisoService.listar();

    }else{
      localStorage.clear();
      this.router.navigate(['']);
    }  
  }

  clearLocalStore(){
    this.isshow = false;
    localStorage.setItem(environment.CODIGO_FILTRO, "");    
  }

  closeLogin(){
    this.isshow = false;
    localStorage.clear();
    window.location.reload();
  }


  abrirmenu(){

    if(this.isshow){
      this.isshow = false; 
    }else{
      this.isshow = true;  
    }
  }

}
