import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { facturas } from 'src/app/_models/facturas';
import { DatafacturaService } from 'src/app/_services/datafactura.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { AppserviceService } from 'src/app/_utilidades/appservice.service';
import { ComunicacionService } from 'src/app/_utilidades/comunicacion.service';
import { ConvertidofechaService } from 'src/app/_utilidades/convertidofecha.service';
import { filtroFactura } from 'src/app/_viewModel/filtroFactura';
import { rangoFecha } from 'src/app/_viewModel/rangoFecha';
import { selectList } from 'src/app/_viewModel/selectList';
import Swal from 'sweetalert2';
import { VentanamodalComponent } from '../../componentes/ventanamodal/ventanamodal.component';
import { FacturacionComponent } from '../facturacion/facturacion.component';

@Component({
  selector: 'app-listafacturacion',
  templateUrl: './listafacturacion.component.html',
  styleUrls: ['./listafacturacion.component.css']
})
export class ListafacturacionComponent implements OnInit {

  public listaTipoFiltro: selectList[]=[
    { text:"Factura del dia" , value: "Factura del dia" },
    { text: "Recuperar Factura", value: "Recuperar Factura"},
    { text:"No Factura" , value: "No Factura" },
    { text:"Devolucion" , value: "Devolucion" },
   
    
  ];

  public listaFactura: facturas ;
  //value = 'Clear me';


  //variable para seleccionar por defecto 
  //el select del tipo de filtro
  public filltroSeleccionado: string="";
  public textBusqueda: string;


  public dataRangoFechas: rangoFecha;
  /*start = new Date();
  end = new Date();*/

  //rango para fecha y de tipo FormGroup.
  frmRange: FormGroup;
  //por defecto caundo instancia un tipo de datos Date se asignan fecha y hora de hoy
  fechaStart = new Date();
  fechaEnd = new Date();

  private enviarListFacturacionRef: Subscription = null;
  displayedColumns: string[] = ['factura', 'cliente', 'nombre_Cliente', 'total_Factura', 'fecha', 'total_Unidades', 'accion'];
  dataSource = new MatTableDataSource();
  //dataSource = 

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private appService: AppserviceService, private convertidorFecha: ConvertidofechaService, 
              private serviceFactura: DatafacturaService, serviceComunicacion: ComunicacionService,
              private serviceNotification: NotificationService, private dialog: MatDialog,) { }

  ngOnInit(): void {

    //emitir un valor true para mostrar cargando.
    this.appService.config.emit(true);
  
    //instanciar el formGroup
    this.frmRange = new FormGroup({
      start: new FormControl<Date | null>(this.fechaStart),
      end: new FormControl<Date | null>(this.fechaStart)
    });


    do{
      //obtener el valor del filtro (por defecto), cuando carga por primera vez
      this.filltroSeleccionado= this.onObtenerTipofiltroCache();

      if (this.filltroSeleccionado == null)
      {
        //guardar en la cache el tipo de filtro
        this.onGuardarTipoFiltroCache("Factura del dia");
      }

    } while (this.filltroSeleccionado == null);


    //asignar el filtro 
    let filtroFacura: filtroFactura = {
      fechaInicio: this.convertidorFecha.convertDateString(this.frmRange.get('start').value),
      fechaFinal: this.convertidorFecha.convertDateString(this.frmRange.get('end').value),
      tipofiltro: 'Factura del dia',
      busqueda: ''
    };
 
    this.onListarGridFacturas(filtroFacura);
    
  }

  onCrearNuevaFacturas(){

    const dateNowToday = new Date();  
        
    /*
    let dataClientes: facturas = 
    {
        nuevoCliente: true, clienteID: null, nombreCliente: null, direccion: null, contacto: null, telefonos: null, edad: 0, tipoSexoID: 0, procesado: false,
        email: null, email2: null, email3: null, telefonoHab: null, tipoIdentificacionID: 0, estadoCivilID: 0,
        celular: null, departamentoID: 0, municipioID: 0, sucursalID: 0, ocupacion: null, fax: null, revisado: false, clienteIndeseable: false, personeriaID: 0,
        pep: null, fechaCreacion: this.utilidadService.convertDateHourString(dateNowToday)
    };
    dataClientes.titulo = "Nuevo cliente";*/
    let datos: string = "Nueva_factura"
    this.openDialog(datos);
    
  }


  //Metodo para abrir la ventana modal
  openDialog(data: string): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.height = '98%';
    dialogConfig.data = data;


    //despues que se cierre la venta modal se ejecuta 
    const dialogRef = this.dialog.open(FacturacionComponent, dialogConfig);

    //despues que se cierre la venta llama aun suscribirse 
    dialogRef.afterClosed().subscribe(result => {
      //this.onListarClientes();

    });

  }

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

 onSeleccionarFechaChanged(): void {
    //asignar el filtro 
    let filtroFacura: filtroFactura = {
      fechaInicio: this.convertidorFecha.convertDateString(this.frmRange.get('start').value),
      fechaFinal: this.convertidorFecha.convertDateString(this.frmRange.get('end').value),
      tipofiltro: 'Rango de Fecha',
      busqueda: ''
     
    }
    //
    this.onListarGridFacturas(filtroFacura);
  }
  
  /* Función que suma o resta días a una fecha, si el parámetro  días es negativo restará los días*/
  addDayDate(fecha: Date, dias: number) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  //validar si las busqueda es valida
  isValidaBusqueda(filtroFacura: filtroFactura): boolean {
    let valido: boolean=false;

    switch (filtroFacura.tipofiltro){
      case 'No de Factura':
        if (filtroFacura.busqueda.length < 0){
          this.serviceNotification.warn("Debes de digitar el N° de Factura");          
        }
      break;

      default:
        valido=true;      
    }

    return valido;
  }

  
  onListarGridFacturas(filtroFactura:filtroFactura): void {

    console.log('filtroFacura: ', filtroFactura)
    //comprobar si la fecha de inicio esta vacia y la fecha final esta vacio. (el filtro de fecha es la fecha de creacion del registro del cliente)
    //if (this.frmRange.get('start').value != null && this.frmRange.get('end').value != null) {
    //habilitar la ruedita cargando 
    this.appService.habilitarCargando();

    this.serviceFactura.listarFacturas(filtroFactura).subscribe(post => {
      console.log('post.data: ', post.data)
      this.dataSource.data = post.data;
      this.appService.config.emit(false);

    }, (mensajeError: HttpErrorResponse) => {
      this.appService.config.emit(false);
      this.serviceNotification.warn(mensajeError.message);

    }); 
  }

  //buscar datos del cliente 
  onBuscarFacturas() {
        
    //asignar el filtro 
    let filtroFacura: filtroFactura = {
      fechaInicio: this.convertidorFecha.convertDateString(this.frmRange.get('start').value),
      fechaFinal: this.convertidorFecha.convertDateString(this.frmRange.get('end').value),
      tipofiltro: this.filltroSeleccionado,
      busqueda: this.textBusqueda
    };

    this.onListarGridFacturas(filtroFacura);
    //guardar el tpo de filtro para que la proxima vez me muestre la ultimo filtro
    this.onGuardarTipoFiltroCache(this.filltroSeleccionado);
  }





  //evento Key  KeyPress
  onEventoKeyPressBuscar(event, valor: string) {

    //si el usuario presiona la tecla enter (13 es enter), entonces realizar la busqueda
    if (event.keyCode === 13) {     
      this.onBuscarFacturas();
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

  //editar la tarjeta del cliente
  onEditarFactura(clienteID: string) {
    /*
    if (confirm('¿ Estas seguro de editar los datos del cliente ?')) {

      //llama al servicio
      this.accesoclientes.getDatosClientePorId(clienteID).subscribe((response: responseModel) => {
        //si la respuesta del servidor es 1 es exito
        if (response.exito == 1) {

          const today = new Date();

          let dataCliente: clientes = response.data;
          dataCliente.titulo = 'Editar registro del cliente';
          this.openDialog(dataCliente);
        }
        else {
          this.notificationService.warn(response.mensaje);
        }

      });

    }*/

  }
  
  onEliminarClientes(clienteID: string) {

  }



}
