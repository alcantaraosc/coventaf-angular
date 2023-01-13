import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { facturas } from 'src/app/_models/facturas';
import { AppserviceService } from 'src/app/_utilidades/appservice.service';
import { ConvertidofechaService } from 'src/app/_utilidades/convertidofecha.service';
import { rangoFecha } from 'src/app/_viewModel/rangoFecha';
import { selectList } from 'src/app/_viewModel/selectList';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatafacturaService } from 'src/app/_services/datafactura.service';
import { ComunicacionService } from 'src/app/_utilidades/comunicacion.service';





@Component({
  selector: 'app-listabusqueda',
  templateUrl: './listabusqueda.component.html',
  styleUrls: ['./listabusqueda.component.css']
})
export class ListabusquedaComponent implements OnInit {

  public listaTipoFiltro: selectList[]=[
    { text:"Factura del dia" , value: "Factura_del_dia" },
    { text:"No de Factura" , value: "NodeFactura" },
    
  ];

  public listaFactura: facturas ;
  //value = 'Clear me';


  //variable para seleccionar por defecto 
  //el select del tipo de filtro
  public filltroSeleccionado: string;
  public textBusqueda: string;


  public dataRangoFechas: rangoFecha;
  start = new Date();
  end = new Date();

  //rango para fecha y de tipo FormGroup.
  range: FormGroup;
  //por defecto caundo instancia un tipo de datos Date se asignan fecha y hora de hoy
  fechaStart = new Date();
  fechaEnd = new Date();


  constructor(private appService: AppserviceService, private convertidorFecha: ConvertidofechaService, 
    private serviceFactura: DatafacturaService, serviceComunicacion: ComunicacionService,
    /*private accesoclientes: AccesoclientesService, private comunicacionService: ComunicacionService,
    private notificationService: NotificationService, private datePipe: DatePipe, private _adapter: DateAdapter<any>,
    private authorizado: AuthenticationService, */ ){
  }

  ngOnInit(): void {
      
    //emitir un valor true para mostrar cargando.
    this.appService.config.emit(true);

    console.log(this.fechaStart);
    console.log(this.fechaEnd);
   
    //instanciar el formGroup
    this.range = new FormGroup({
      start: new FormControl<Date | null>(this.fechaStart),
      end: new FormControl<Date | null>(this.fechaStart),
    });

    //this.datePipe.transform(fechaStart, "yyyy-MM-dd"); 
    // this.datePipe.transform(fechaEnd, "yyyy-MM-dd"); 


    //console.log('la fecha inicial:', fechaStart);
    //console.log('La fecha final es: ', fechaEnd);

    // this.range.controls['start'].setValue();
    // this.range.controls['end'].setValue(moment(fechaEnd).format('DD MM YYYY'));


    do{
      //seleccionar el valor del filtro (por defecto), cuando carga por primera vez
      this.filltroSeleccionado= this.onObtenerTipofiltroCache();

      if (this.filltroSeleccionado == null)
      {
        //guardar en la cache el tipo de filtro
        this.onGuardarTipoFiltroCache("Factura del dia");
      }


    } while (this.filltroSeleccionado == null);
 

    this.onLlenarTipoFiltro(this.filltroSeleccionado);
    this.onListarFacturas();
   
  }

  /*
  onAccesoSistema(itemAcceso: string[]): boolean{
    return this.authorizado.obtenerAccesoDelsistema(itemAcceso);
  }*/

  //guardar el tipo de filtro en la cache
  onGuardarTipoFiltroCache(value: string ){   

    //comprobar si el tipo de filtro de la cache es diferente al valor que se va a guardar
    if (this.onObtenerTipofiltroCache()!== value){
      //guardar el cache del navegador el tipo de filtro
      localStorage.setItem('tipofiltroCache', value);
    }    
  }

  //obtener el tipo de filtro de la cache
  onObtenerTipofiltroCache(): string {
    //obtener el ultimo tipo de filtro que se hizo
    var tipofiltroCache = localStorage.getItem('tipofiltroCache');
    return tipofiltroCache;    
  }

  //llenar el tipo de Filtro el DrownList
  onLlenarTipoFiltro(datoFiltro: string): void {

   /* this.accesoclientes.listarTipoFiltroCliente(datoFiltro).subscribe((response: dropDownList[]) => {
      this.listaTipoFiltro=response;
    }, (mensajeError: HttpErrorResponse) => {
      this.notificationService.warn(mensajeError.message);
    });*/
  }


  valueChanged(): void {  
    this.onListarFacturas();
  }



  /* Función que suma o resta días a una fecha, si el parámetro  días es negativo restará los días*/
  addDayDate(fecha: Date, dias: number) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }


  //Listar las fecha de rango
  onListarFacturas(): void {
    /*
    //declarar un arreglo de tipo fecha con la fecha de incio y fecha final
    let dataRango: Array<string> = [
      this.convertidorFecha.convertDateString(this.range.get('start').value),
      this.convertidorFecha.convertDateString(this.range.get('end').value)
    ]
    
    //comprobar si la fecha de inicio esta vacia y la fecha final esta vacio. (el filtro de fecha es la fecha de creacion del registro del cliente)
    if (this.range.get('start').value != null && this.range.get('end').value != null) {
      //habilitar la ruedita cargando 
      this.appService.habilitarCargando();

      this.accesoclientes.listarClientes(dataRango).subscribe(post => {
        (this.dataSource.data = post)
        this.appS.config.emit(false);

      }, (mensajeError: HttpErrorResponse) => {
        this.appS.config.emit(false);
        this.notificationService.warn(mensajeError.message);

      });
    }*/

  }

  //buscar datos del cliente 
  onBuscarCliente() {
    /*
    this.appService.habilitarCargando();
    //guardar el tpo de filtro para que la proxima vez me muestre la ultimo filtro
    this.onGuardarTipoFiltroCache(this.filltroSeleccionado);
   
    //llama al servicio
    this.serviceFactura.AgregarFacturaSubject.getListaClientesPorFiltros(this.filltroSeleccionado, this.textBusqueda).subscribe(post => {

      (this.dataSource.data = post);
      this.appS.config.emit(false);

    }, (mensajeError: HttpErrorResponse) => {
      this.appS.config.emit(false);
      this.notificationService.warn(mensajeError.message);

    });*/
  }


  //evento Key  KeyPress
  onEventoKeyPressBuscar(event, valor: string) {

    //si el usuario presiona la tecla enter (13 es enter), entonces realizar la busqueda
   if (event.keyCode === 13) {     
      this.onBuscarCliente();
    }
  }


  onReset() {
    this.textBusqueda="";
    //poner en el focus en la busqueda.
    document.getElementById("busquedaCliente").focus();
  }




  onEnviarDatosCliente(clienteID: string){
    //this.comunicacionService.enviarMensaje(clienteID);    
   /* this.comunicacionService.setNoIdentificacionCliente(clienteID);*/
    
  }


}
