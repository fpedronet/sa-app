import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';


import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { ProductoService } from 'src/app/_service/logistica/producto.service';

import { environment } from 'src/environments/environment';
import { Excel, Producto } from 'src/app/_model/dyn/producto';

@Component({
  selector: 'app-importarproducto',
  templateUrl: './importarproducto.component.html',
  styleUrls: ['./importarproducto.component.css']
})
export class ImportarproductoComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  // excelData: any;
  codigo: string = "";
  cantSub: number = 0;
  canEnc: number = 0;
  dataSource: Producto[] = [];
  excelData: Excel[] = [];
  excel?: string =environment.UrlImage + "excelicon.png";

  constructor(
    private notifierService : NotifierService,
    private spinnerService : SpinnerService,
    private productoService: ProductoService,
  ) { }

  ngOnInit(): void {
  }

  importar(event: any){
    let file = event.target.files[0];
    let fileReader = new FileReader();
    this.codigo = "";

    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) =>{
      var workBook = XLSX.read(fileReader.result,{type:'binary'});
      var sheetNames = workBook.SheetNames;

      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      this.cantSub = this.excelData.length;

      if(this.cantSub > 0){
        let producto = "";
        
        for (let index = 0; index < this.excelData.length; index++) {
          producto += this.excelData[index].CODIGOS_CREADOS + "|";          
        }
        
        this.spinnerService.showLoading();
        this.productoService.buscarproducto(producto).subscribe(data=>{

          this.dataSource = data.items;
          this.canEnc = data.items.length;          

          this.dataSource.forEach(element => {
            this.codigo += element.cod1?.trim() + "|";  
            var result = this.excelData?.filter(y=>y.CODIGOS_CREADOS==element.cod1?.trim())[0];
            result!.COLOR= "#ffffff";

          });

          this.spinnerService.hideLoading();
        });
      }

    }
  }

  guardar(){
    let model = new Producto();
    model.codigo = this.codigo;

    this.spinnerService.showLoading();
    this.productoService.guardarexcel(model).subscribe(data=>{
      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
      this.spinnerService.hideLoading();

      if(data.typeResponse==environment.EXITO){
               
        this.dataSource = [];
        this.excelData = [];
      }
    });
   }

}
