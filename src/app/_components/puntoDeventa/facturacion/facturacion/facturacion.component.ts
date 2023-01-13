import { FocusMonitor } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';

import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Output, ElementRef, OnDestroy, OnInit, ViewChild, Renderer2, LOCALE_ID, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { elementAt, Subscription } from 'rxjs';
import { bodega } from 'src/app/_models/bodega';
import { cliente } from 'src/app/_models/cliente';

//modelo
import { detalleFactura } from 'src/app/_models/detalleFactura';
import { viewModelfacturacion } from 'src/app/_viewModel/viewModelfacturacion';
import { facturaTemporal } from 'src/app/_models/facturaTemporal';
import { forma_pagos } from 'src/app/_models/forma_pagos';
import { listarDwonList } from 'src/app/_models/listarDrownList';
import { responseModel } from 'src/app/_viewModel/responseModel';
import { tipo_tarjeta } from 'src/app/_models/tipo_tarjeta';
import { viewArticulo } from 'src/app/_models/viewArticulo';
//servicio
import { DataarticuloService } from 'src/app/_services/dataarticulo.service';
import { DatabodegaService } from 'src/app/_services/databodega.service';
import { DataclienteService } from 'src/app/_services/datacliente.service';
import { DatafacturaService } from 'src/app/_services/datafactura.service';
import { DatamonedahistService } from 'src/app/_services/datamonedahist.service';
import Swal from 'sweetalert2';
import { factura_linea } from 'src/app/_models/factura_linea';
import { ImprimirticketService } from 'src/app/_services/imprimirticket.service';
import { encabezadoFactura } from 'src/app/_models/encabezadoFactura';
import { condicionPago } from 'src/app/_models/condicionPago';

import { CalculosService } from 'src/app/_services/calculos.service';
import { varFacturacion } from 'src/app/_viewModel/varFacturacion';
import { ProcesofacturacionService } from 'src/app/_utilidades/procesofacturacion.service';
import { ConvertidofechaService } from 'src/app/_utilidades/convertidofecha.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit, OnDestroy  {

  listVarFactura: varFacturacion= { consecutivoActualFactura: 0, inputActivo: "", idActivo:"", descuentoActivo:true, 
                        //indica si el descuento es del beneficio o descuento es de Linea
                        descBeneficioOrDescLinea : "",     visibleTipoTarjeta: 'none', visibleCondicionPago: 'none',
                        //descuento que el cliente
                        tipoDeCambio : 0.0000, bodegaId :"", nivelPrecio :"GENERAL",
                        //mostrar los datos del cliente en el html
                        nombreCliente:"", saldoDisponible:0.0000, porcentajeDescCliente:0.0000,
                        /**Totales */
                        subTotalDolar: 0.0000, subTotalCordoba:0.0000, 
                        //descuento
                        descuentoDolar: 0.0000, descuentoCordoba: 0.0000, descuentoGeneral: 0.0000,
                        //subtotales 
                        subTotalDescuentoDolar: 0.0000, subTotalDescuentoCordoba: 0.0000, ivaCordoba: 0.0000,  ivaDolar: 0.0000,
                        totalDolar: 0.0000, totalCordobas: 0.0000,  totalUnidades: 0.0000,
                        //fecha de hoy
                        fechaFactura: new Date(), checkDisabledDSD: true, desactivarBotonValDes:true, desactivarBotonGuardar: true
                      };
  suscriptions: Subscription[]=[];  
  fechaFacturaStr: string;
  consecutivoActualFactura: number;
  inputActivo:string="";
  idActivo: string="";
  //indica si el descuento esta aplicado o no esta aplicado
  //descuentoActivo: boolean=true;
  //indica si el descuento es del beneficio o descuento es de Linea
  //descBeneficioOrDescLinea: string ="";  
  //visibleTipoTarjeta: string='none';
  //visibleCondicionPago: string='none';

  
  /*********** variables globales para mostrar nombre del cliente y monto disponible **************/
  //mostrar los datos del cliente en el html
  /*public nombreCliente: string="********";
  public saldoDisponible: number=0.0000;
  public porcentajeDescCliente: number=0.0000;*/
  //*********** fin ******************************************************************************/

  /************* formularios reactivos ****************************/
  public frmFacturacion: FormGroup;  
  /************************************************************/
  public listaBodega: bodega[];
  public listFormaPago: forma_pagos[];
  public listaTipoTarjeta: tipo_tarjeta[];
  public listaCondicionPago: condicionPago[]
  public datoCliente: cliente;
  
  //fechaFacturacion: Date = new Date();
  datePipeEn: DatePipe = new DatePipe('en-US')
  dPipe = new DatePipe('es-NI');
   
  

  //descuento que el cliente
  private tipoDeCambio: number=0.000000;
  private bodegaId: string;
  private nivelPrecio: string="GENERAL";
  
  //arreglo detalle de la factura
  listDetFactura: detalleFactura[]=[{ consecutivo:0, articuloId: "",  inputArticuloDesactivado: true,  codigoBarra: "",
                                      descripcion: "", unidad: "", cantidad: 1.00, cantidadExistencia: 0, inputCantidadDesactivado: false,
                                      precioDolar: 0.00, precioCordobas: 0.00, subTotalDolar: 0.00, subTotalCordobas: 0.00,   
                                      porCentajeDescuento: 0.00, descuentoInactivo: 0.00, descuentoDolar: 0.00, descuentoCordoba: 0.00, descuentoTotalGeneral: 0.0000,
                                      totalDolar: 0.00, totalCordobas: 0.00, inputActivoParaBusqueda: true, botonEliminarDesactivado: true
                                    }
                                  ];
  
  @ViewChild('myInput') myInputNat: ElementRef;

  //public codigoBarraArticulo: string

  focused = false;
/*
  formArray:FormArray;
  getControl(index: number, controlName: string): FormControl {
    return (this.formArray.at(index) as FormGroup)
                .get(controlName) as FormControl;
  }
  */
  
  constructor(private formBuilder: FormBuilder, private notificacion: ToastrService, private serviceCliente: DataclienteService, 
          private serviceArticulo: DataarticuloService, private serviceBodega: DatabodegaService, private serviceTipoCambio: DatamonedahistService,
          private fm: FocusMonitor, private rederer2: Renderer2, private serviceFactura: DatafacturaService, private imprimirPdfMake: ImprimirticketService,
          private serviceCalculo: CalculosService, private procesoFacturacion: ProcesofacturacionService, private conversionfecha: ConvertidofechaService,
          //hace referencia al ventana modal abierta
          public dialogRef: MatDialogRef<FacturacionComponent>,
  //@Inject(MAT_DIALOG_DATA) para inyectar los datos del componente que se esta llamando a la ventana modal
  //data: es de tipo DialogData( DialogData es una interface)
  @Inject(MAT_DIALOG_DATA) public data: string,)
  { 
       
     //llenar los combox de facturacion: tipo de cambio, listar todas bodegas activas
     this.onLlenarCombox();
  } 

  ngOnInit(): void {

    this.fechaFacturaStr=this.conversionfecha.convertDateHourString(this.listVarFactura.fechaFactura);
    this.listVarFactura.fechaFactura= new Date(this.fechaFacturaStr);
  
    //inicializar las variblae de la interfaz
    this.procesoFacturacion.inicializarTodaslasVariable(this.listVarFactura);
    //crear una nueva fila en detalle
    this.procesoFacturacion.addNewRow(this.listDetFactura);  
    
   /*
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    console.log(hoy);*/

      
     //this.toastr.success("Bienvenido");
      this.frmFacturacion = this.formBuilder.group({
        noFactura:'',
        fecha: this.datePipeEn.transform(this.listVarFactura.fechaFactura, 'dd/MM/YYYY, hh:mm a'),
        tipoCambioDelDia:0.0000,
        //busqueda del cliente.
        codigoCliente:['', Validators.required],
        //busqueda del articulo
        codigoBarra:['', Validators.required],
        cantidad:0.00,
        bodegaID: 'EXHI',  
        descuentoSobreDescuento: false,      
        //dolares
        subTotalDolar:"U$ 0.00",
        descuentoDolar:"U$ 0.00",
        subTotalDescuentoDolar:"U$ 0.00",
        ivaDolar: "U$ 0.00",
        totalDolar: "U$ 0.00",        
        //cordobas
        subTotalCordoba:"C$ 0.00",
        descuentoCordoba:"C$ 0.00",
        subTotalDescuentoCordoba: "C$ 0.00",
        ivaCordoba: "C$ 0.00",
        totalCordoba: "C$ 0.00", 
        observaciones:"",
        
        forma_Pago:"",
        descripcion: "",
        tipo_Tarjeta:"",
        condicion_Pago: ""   
      });             
  }
  
  ngOnDestroy(): void {
    console.log('unsubscribe');
    //this.suscriptions.forEach((s))=>s.unsubscribe());
    //unsubscribe
    this.suscriptions.forEach((s)=>s.unsubscribe());           
  }  

  get f() { return this.frmFacturacion.controls }
 

  //obtener el tipo de cambio del servidor
  onLlenarCombox() {
    this.suscriptions.push(this.serviceFactura.llenarComboxFactura().subscribe((response: listarDwonList) => {
      //si la respuesta del servidor es 1(1= consulta exitoso)
      if (response.exito == 1) {

          this.tipoDeCambio = response.tipoDeCambio;
        this.f['noFactura'].setValue(response.noFactura);
        //asignar el tipo de cambio
        this.f['tipoCambioDelDia'].setValue(this.tipoDeCambio);     
        //asignar la lista de bodega
        this.listaBodega = response.bodega;
        //asignar la forma de pago
        this.listFormaPago = response.formaPagos;
        //asignar el tipo de tarjeta
        this.listaTipoTarjeta = response.tipoTarjeta;  
        //asignar las condiciones de pagos
        this.listaCondicionPago = response.condicionPago;
      }

      //si la respuesta del servidor es (0=la consulta no fue exitosa; o registro encontrado)
      else if (response.exito == 0) {
        //notifica al usuario q no existe el tipo de cambio del dia
        this.notificacion.error(response.mensaje);
        //redirigir al usuario a una pagina
        this.notificacion.success("sera redirigido a otra pagina para no continuar con la facturacion");         
      }
      else {
        //cualquier tipo de error enviado por el servidor.
        this.notificacion.error(response.mensaje);        
      }
    }));
  }

  //Listar las bodegas activas
  onObtenerNoFactura(){
    //agregar a la variable suscription
    this.suscriptions.push(this.serviceFactura.obtenerNoFactura().subscribe((response:responseModel)=>{
        if (response.exito==1){
          this.f['noFactura'].setValue(response.data);          
        }
    }));
    
  }

  //buscar los datos del cliente
  onBuscarDatosCliente(e){
      //comprobar si el usuario presiono la tecla enter
    if (e.keyCode === 13) {
      
      //obtener el codigo de barra 
      const codigo= this.frmFacturacion.value.codigoCliente;
      //comprobar si el no has digitado el codigo del cliente    
      if (codigo.length ==0){
        this.notificacion.error('Debes de Ingresar el codigo del Cliente!' );
        return ;
      }

      this.suscriptions.push(this.serviceCliente.getDatosDelClienteId(this.frmFacturacion.value.codigoCliente).subscribe((response: responseModel)=>{    
          //si la respuesta del servidor es 1 (exitosa) entonces es exitosa
          if (response.exito==1){
            //asignar los datos del cliente
            this.datoCliente=response.data;
           
            //asignar datos para visualizarlos en HTML
            this.procesoFacturacion.asignarDatoClienteParaVisualizarHtml(this.datoCliente, this.listVarFactura);
    
            //comprobar si es necesario desactivar el chech DSD (descuento sobre descuento)
            if (this.procesoFacturacion.activarBotonDSD(this.listVarFactura.porcentajeDescCliente)){                
              //desactivar el check
              this.listVarFactura.checkDisabledDSD=false;
              //this.f['descuentoSobreDescuento'].disable();
            }
            //obtener el valor del descuento si del beneficio o la linea del producto
            this.procesoFacturacion.asignarValoresDespuesConsultarCliente(this.listVarFactura, this.f["descuentoSobreDescuento"].value);
            //desactivar el input de busqueda de cliente
            this.f['codigoCliente'].disable();
            //poner el focus en el textboxarticulo              
            this.listDetFactura[0].inputArticuloDesactivado=true;
            //
            let inputCodigo=document.getElementById("codigoBarra_0")  as HTMLInputElement;
            //activar el foco
            inputCodigo.focus()
          }   
          //en caso que exito sea 0 (0= no se encontro el cliente en la base de datos)              
          else if (response.exito==0){

            //inicializar los datos del cliente para luego mostrarlo en HTML
            this.procesoFacturacion.inicializarDatosClienteParaVisualizarHTML(this.listVarFactura)                     
            this.notificacion.error(response.mensaje);

          } else {
            //cualquier error que mande el servidor aqui lo notifica
            this.notificacion.error(response.mensaje);
          }            
      }));      
    }
  }

    //buscar los datos del articulo
  onBuscarArticulo(e){       
      //comprobar si el usuario presiono la tecla enter
      if (e.keyCode === 13) {

        //obtener el codigo de barra 
        const codigoArticulo= e.target.value;
        //comprobar si el no has digitado el codigo de barra del articulo   
        if (codigoArticulo.length == 0){
          this.notificacion.error('¿ Debes de ingresar el codigo de barra del articulo ?', );
          return ;
        }
        //obtener el articulo del servidor               
        this.suscriptions.push(this.serviceArticulo.getDatosDelArticuloId(codigoArticulo, this.f['bodegaID'].value).subscribe((response: responseModel)=>{
         
          //respuesta exitosa
          if (response.exito==1){

            let articulo: viewArticulo;
            //obtener los datos de la vista del articulo
            articulo= response.data;
            //comprobar si hay en existencia
            /*if (articulo.existencia >0)
            {*/
              //agregar a la tabla del detalle de la factura
              this.onAgregarArticuloDetalleFactura(articulo);

              //activar el focus en el siguiente input y se dispara el evento focus
              /*document.getElementById(this.idActivo).focus();

              //this.onMoverFocusInputUnicoBusqueda();
              //limpiar el input del codigo del articulo
              //this.frmArticulo.value.codigoBarra='';
              //this.f['codigoBarra'].setValue('');
            }
            else{
              this.notificacion.error("no existe en el inventario el articulo");
            }   */

          }        
          //si el servidor responde exito con 0 (0= el articulo no existe en la base de dato)         
          else if (response.exito==0){ 
            //mostrar un mensaje de notificacion                  
            this.notificacion.info(response.mensaje);
            //limpiar el input del codigo del articulo
            let ipuntActual = document.getElementById(this.idActivo) as HTMLInputElement;
            ipuntActual.value='';
            //this.f['codigoBarra'].setValue('');
            //this.f['cantidad'].setValue('');   
          }
          else {
            //notifica cualquier error que el servidor envia
            this.notificacion.error(response.mensaje);
            //limpiar el input del codigo del articulo
            let ipuntActual = document.getElementById(this.idActivo) as HTMLInputElement;
            ipuntActual.value='';
          }           
        }));     
      } 
      
      //presionar la tacla suprimir.
      if (e.keyCode === 46){
        this.notificacion.success('tecla suprimir');
      }
  }

  //resetear los colores de toda la tabla
  resetColorTable(){
    //let input = document.getElementById()
        
    for(let fact of this.listDetFactura){
      document.getElementById(fact.consecutivo.toString()).style.background="";
    }
  }

  //evento focus
  onFocusEvent(event){

    this.listVarFactura.desactivarBotonGuardar=true;
    //obtener el nombre del id por medio del evento focus
    this.idActivo = event.target.attributes.id.value;
    //toma el nombre del input (cantidad_1= cantidad)
    let nombreInput = this.idActivo.split('_')[0];
    //toma el numero consecutivo (cantidad_1= 1)
    let valorConsecutivo = this.idActivo.split('_')[1] //toma los valores que tiene despues del guion(_)
  
    //asignar el numero consecutivo donde el usuario puso el focus
    this.consecutivoActualFactura=parseInt(valorConsecutivo);
    //asignar el nombre del input donde el usuario puso el focus
    this.inputActivo = nombreInput;   

    //si el nombre del input es codigo de barra y el onInputParaBusquedaEsValido no es valido 
    if ((nombreInput=="codigoBarra") && (!this.serviceFactura.onInputParaBusquedaEsValido(this.listDetFactura, this.consecutivoActualFactura))){
      //entonces mover el cursor al input correspondiente
      this.onMoverFocusInputUnicoBusqueda(); 
    }
    else {

      //activar el color de fondo del input
      event.target.style.background = "#F0F4E5";  
      //aplicar un color de fondo a la fila
      document.getElementById(this.consecutivoActualFactura.toString()).style.background="#D6EAF8"; 
    }   
  }

  //este envento se dispara cuando sales del evento focus
  onBlurEvent(event, value: string){

    this.listVarFactura.desactivarBotonGuardar=true;

    switch(this.inputActivo)
    {
      /************************************ input cantidad ******************************************************/
      //si el input es cantidad entonces validad el input de cantidad
      case 'cantidad': {
        //obtener el valor del input (cantidad)
        const datCantidad: number = parseFloat(event.target.value);
        //validar que el input cantidad 
        if (datCantidad <= 0 || datCantidad.toString() == 'NaN' ){  
          //poner el focus en el input de cantidad  
          document.getElementById(this.idActivo).focus();          
          this.notificacion.error('Debes digitar la cantidad del Articulo');
          //finalizar la instruccion
          return ;
        }

        //actualizar las cantidades
        this.ActualizarCantidades(datCantidad); 
        break;
      }
      /***********************************************************************************************************/

      /************************************ input porcentaje ******************************************************/
      case 'porCentajeDescuento' :{
        //obtener el valor del input (cantidad)
        const datPorCentaje: number = parseFloat(event.target.value);
        //validar que el input porcentaje 
        if (datPorCentaje < 0 || datPorCentaje.toString() == 'NaN' ){  
          //poner el focus en el input de porCentajeDescuento  
          document.getElementById(this.idActivo).focus();          
          this.notificacion.error('Digite el % de descuento');
          //finalizar la instruccion
          return ;
        }

        //actualizar el porcentaje
        this.onActualizarDescuentoLinea(datPorCentaje); 
        break;
      }
      /***********************************************************************************************************/
    }
       
    event.target.style.background="";
    document.getElementById(this.consecutivoActualFactura.toString()).style.background="";
     
  }

  //evento onChange
  onKeypressActualizarCantidad(e){
    if (e.keyCode === 13) {           
      let cant: number ;
      cant =parseFloat(e.target.value);
      this.listVarFactura.desactivarBotonGuardar=true;

      //si la cantidades es menor que cero
      if (cant <= 0 || cant.toString() == 'NaN'){
        this.notificacion.error('Digite la cantidad del articulo');
      }
      else {
        this.ActualizarCantidades(cant);
      }
    }     
  }


  //evento Keypress para actualizar el descuento de linea
  onKeypressActualizarDescLinea(e){
    if (e.keyCode === 13) {           
      let porcentaje: number ;
      porcentaje =parseFloat(e.target.value);
      console.log('porcentaje: ', porcentaje)
      this.listVarFactura.desactivarBotonGuardar=true;

      //si la cantidades es menor que cero
      if (porcentaje < 0 || porcentaje.toString() == 'NaN'){
        this.notificacion.error('Digite el % de descuento del articulo');
      }
      else {
        this.onActualizarDescuentoLinea(porcentaje);
      }
    }     
  }


  //eliminar el articulo de la lista de detalle de factura
  onEliminarArticulo(event, codigo: string, consecutivo: number){     
    event.preventDefault();

    this.listVarFactura.desactivarBotonGuardar=true;

   //asignar el numero consecutivo del articulo
    this.consecutivoActualFactura= consecutivo;
    let noFactura = this.f['noFactura'].value;
    
    //document.getElementById(this.consecutivoActualFactura.toString()).style.background="#F49082";  
    
    Swal.fire({
      title: '¿ Estas seguro de eliminar el articulo: ' + this.listDetFactura[consecutivo].descripcion.toString() + ' ?',
      text: "-",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) { 
        //proceder a eliminar el articulo        
        this.serviceFactura.eliminarProductoFactura(this.listDetFactura, noFactura, codigo, consecutivo );
        //calcular los totales        
        this.onCalcularTotales();    
        
        Swal.fire({ position: 'top-end', icon: 'success', title: 'Articulo eliminado de la lista', showConfirmButton: false, timer: 1000 });

        this.onMoverFocusInputUnicoBusqueda();
      }
    });      
  }  

  //poner el focus en el input unico de busqueda
  onMoverFocusInputUnicoBusqueda(){

    for(let det of this.listDetFactura){
      //verificar en que posicion esta el input
      if(det.inputActivoParaBusqueda){
        this.consecutivoActualFactura= det.consecutivo;        
        break;
      }
    }  
    //generar el id del input mas agregar el consecutivo
    this.idActivo=this.inputActivo + "_"+this.consecutivoActualFactura.toString();    
    //activar el focus en el siguiente input
    document.getElementById(this.idActivo).focus();
    
  }

  //actualizar las cantidades
  ActualizarCantidades(cantidad: number){

    //validar la existencia en inventario.
    if (this.listDetFactura[this.consecutivoActualFactura].cantidadExistencia < cantidad){
      document.getElementById(this.idActivo).focus();
      //aplicar un color de fondo a la fila
      document.getElementById(this.consecutivoActualFactura.toString()).style.background="#D6EAF8";       
      this.notificacion.error('La cantidad digitada supera la existencia'); 
      return;
    }

    this.listDetFactura[this.consecutivoActualFactura].cantidad= cantidad;

    /*
    let precioDolar:number =0.0000, descuento: number =0.0000, subTotalDolar: number =0.000, totalDolar:number =0.000;
    let precioCordoba:number=0.0000, subTotalCordoba: number=0.0000, totalCordoba:number=0.0000;
    //obtener el precio en Dolar
    precioDolar = this.listDetFactura[this.consecutivoActualFactura].precioDolar;
    //obtener el precio en cordoba
    precioCordoba = this.listDetFactura[this.consecutivoActualFactura].precioCordobas;
    //obtener el descuento
    descuento = this.listDetFactura[this.consecutivoActualFactura].porCentajeDescuento
    //obtener el subtotal dolar
    subTotalDolar = this.listDetFactura[this.consecutivoActualFactura].subTotalDolar;
    //obtener el subtotal cordoba
    subTotalCordoba = this.listDetFactura[this.consecutivoActualFactura].subTotalCordobas;
      //obtener el total dolar
    totalDolar = this.listDetFactura[this.consecutivoActualFactura].totalDolar
    //obtener el total cordoba
    totalCordoba = this.listDetFactura[this.consecutivoActualFactura].totalCordobas 
    //hacer el calculo del subtotal Dolar
    subTotalDolar = precioDolar * cantidad;
      //hacer el calculo del subtotal Dolar
    subTotalCordoba = precioCordoba * cantidad;
    //obtener el total Dolar
    totalDolar = subTotalDolar - (subTotalDolar * (descuento / 100.0000));
    //obtener el total cordoba
    totalCordoba = subTotalCordoba - (subTotalCordoba * (descuento / 100.0000));      
    //asignar la cantidad
    this.listDetFactura[this.consecutivoActualFactura].cantidad= cantidad;
    //asignar el calculo de subTotal
    this.listDetFactura[this.consecutivoActualFactura].subTotalDolar = subTotalDolar
    //asignar el calculo de subTotal
    this.listDetFactura[this.consecutivoActualFactura].subTotalCordobas = subTotalCordoba
    //asignar el calculo de total
    this.listDetFactura[this.consecutivoActualFactura].totalDolar= totalDolar;   
    //asignar el calculo de total
    this.listDetFactura[this.consecutivoActualFactura].totalCordobas= totalCordoba;   */
    
    //hacer los calculos de totales
    this.onCalcularTotales();   
    
    this.guardarBaseDatosFacturaTemp();
  }

  //actualizar descuento Linea
  onActualizarDescuentoLinea(porCentajeDescuento: number){

    /*let precioDolar:number =0.0000, descuento: number =0.0000, subTotalDolar: number =0.000, totalDolar:number =0.000;
    let precioCordoba:number=0.0000, subTotalCordoba: number=0.0000, totalCordoba:number=0.0000;
    //obtener el precio en Dolar
    precioDolar = this.listDetFactura[this.consecutivoActualFactura].precioDolar;
    //obtener el precio en cordoba
    precioCordoba = this.listDetFactura[this.consecutivoActualFactura].precioCordobas;
    //obtener el descuento
    descuento = this.listDetFactura[this.consecutivoActualFactura].porCentajeDescuento
    //obtener el subtotal dolar
    subTotalDolar = this.listDetFactura[this.consecutivoActualFactura].subTotalDolar;
    //obtener el subtotal cordoba
    subTotalCordoba = this.listDetFactura[this.consecutivoActualFactura].subTotalCordobas;
      //obtener el total dolar
    totalDolar = this.listDetFactura[this.consecutivoActualFactura].totalDolar
    //obtener el total cordoba
    totalCordoba = this.listDetFactura[this.consecutivoActualFactura].totalCordobas 
    //hacer el calculo del subtotal Dolar
    subTotalDolar = precioDolar * cantidad;
      //hacer el calculo del subtotal Dolar
    subTotalCordoba = precioCordoba * cantidad;
    //obtener el total Dolar
    totalDolar = subTotalDolar - (subTotalDolar * (descuento / 100.0000));
    //obtener el total cordoba
    totalCordoba = subTotalCordoba - (subTotalCordoba * (descuento / 100.0000));      
    //asignar la cantidad
    this.listDetFactura[this.consecutivoActualFactura].cantidad= cantidad;
    //asignar el calculo de subTotal
    this.listDetFactura[this.consecutivoActualFactura].subTotalDolar = subTotalDolar
    //asignar el calculo de subTotal
    this.listDetFactura[this.consecutivoActualFactura].subTotalCordobas = subTotalCordoba
    //asignar el calculo de total
    this.listDetFactura[this.consecutivoActualFactura].totalDolar= totalDolar;   
    //asignar el calculo de total
    this.listDetFactura[this.consecutivoActualFactura].totalCordobas= totalCordoba;*/
    //asignar el nuevo % descuento
    this.listDetFactura[this.consecutivoActualFactura].porCentajeDescuento=porCentajeDescuento;
    //hacer los calculos de totales
    this.onCalcularTotales();   
    
    this.guardarBaseDatosFacturaTemp();
  }

  //agregar el articulo al detalle de la factura
  onAgregarArticuloDetalleFactura(articulo: viewArticulo): void {   
    //comprobar si no existe el articulo en la detalle de factura
    if (!this.onExisteArticuloDetFactura(this.listDetFactura, articulo.codigoBarra)){
      
      //cantidad del articulo
      let cantidad: number = parseFloat(this.listDetFactura[this.consecutivoActualFactura].cantidad.toString());
      //precio del articulo
      let precioDolar: number = articulo.precio;
      let precioCordoba: number = articulo.precio * this.tipoDeCambio;
      //calculo del subTotal dolares
      let subTotalDolar: number = cantidad * precioDolar;
       //calculo del subTotal Cordoba
       let subTotalCordoba: number = cantidad * precioCordoba;
      //establecer el descuento del articulo o descuento 
      let Descuento: number = this.serviceCalculo.setDescuentoDetalleFactura(articulo.descuento, this.listVarFactura.descuentoActivo, this.f['descuentoSobreDescuento'].value)
      //(this.ocultarDescuento ? 0.00 : (articulo.descuento/100.0000));

      //obtener el calculo del subtotal del descuento
      let descuentoDolar : number = subTotalDolar * Descuento;
      let descuentoCordoba : number = subTotalCordoba * Descuento;
      //let subTotalDescuentoDolar: number = subTotalDolar - descuentoDolar;
      //let subTotalDescuentoCordoba: number = subTotalCordoba - descuentoCordoba;
      let totalDolar: number = subTotalDolar - descuentoDolar ;
      let totalCordobas: number = subTotalCordoba - descuentoCordoba ;

      //agregar a la lista los calculos realizados
      this.listDetFactura[this.consecutivoActualFactura].articuloId= articulo.articuloID;
      this.listDetFactura[this.consecutivoActualFactura].codigoBarra= articulo.codigoBarra;
      //bloquear el input de busqueda
      this.listDetFactura[this.consecutivoActualFactura].inputArticuloDesactivado= true;
      //el siguiente
      this.listDetFactura[this.consecutivoActualFactura].descripcion = articulo.descripcion;
      this.listDetFactura[this.consecutivoActualFactura].unidad = "Unidad";
      this.listDetFactura[this.consecutivoActualFactura].cantidad= cantidad;
      //existencia en inventario
      this.listDetFactura[this.consecutivoActualFactura].cantidadExistencia= articulo.existencia;
      this.listDetFactura[this.consecutivoActualFactura].inputCantidadDesactivado= true;
      this.listDetFactura[this.consecutivoActualFactura].precioDolar = precioDolar;
      this.listDetFactura[this.consecutivoActualFactura].precioCordobas = precioCordoba;
      this.listDetFactura[this.consecutivoActualFactura].subTotalDolar = subTotalDolar
      this.listDetFactura[this.consecutivoActualFactura].subTotalCordobas = subTotalCordoba
      this.listDetFactura[this.consecutivoActualFactura].porCentajeDescuento= (this.listVarFactura.descuentoActivo ? articulo.descuento : 0.00)
      this.listDetFactura[this.consecutivoActualFactura].descuentoInactivo= (this.listVarFactura.descuentoActivo ?  0.00 : articulo.descuento);
      this.listDetFactura[this.consecutivoActualFactura].descuentoDolar = descuentoDolar;//articulo.precio * this.listDetFactura[this.consecutivoActualFactura].cantidad;  
      this.listDetFactura[this.consecutivoActualFactura].descuentoCordoba = descuentoCordoba;
      this.listDetFactura[this.consecutivoActualFactura].totalDolar = totalDolar; //this.listDetFactura[this.consecutivoActualFactura].subTotal - (this.listDetFactura[this.consecutivoActualFactura].subTotal * (articulo.descuento/100.00));
      this.listDetFactura[this.consecutivoActualFactura].totalCordobas = totalCordobas;
      this.listDetFactura[this.consecutivoActualFactura].botonEliminarDesactivado = false
      //cambio el estado del input indicando que ya no es el input unico del articulo para buscar
      this.listDetFactura[this.consecutivoActualFactura].inputActivoParaBusqueda= false;
           
      //comprobar si no existe el input unico para el proximo articulo
      if (!this.serviceFactura.onExisteInputUnicoParaProximaArticulo(this.listDetFactura)) {        
          //crear una nueva fila en la tabla
          this.procesoFacturacion.addNewRow(this.listDetFactura)       
         
          var inputCodigoBarra= document.getElementById(this.idActivo) as HTMLInputElement;        
          //accedo al atributo para deshabilitar y desactivo el input de codigo de barra          
          inputCodigoBarra.setAttribute("disabled", "false");
          //guardar la factura temporalmente
          this.guardarBaseDatosFacturaTemp();
          
          //sumar uno mas al consecutivo
          this.consecutivoActualFactura += 1;
          this.idActivo='codigoBarra_' + this.consecutivoActualFactura.toString();
          //activar la busqueda de inputActivoParaBusqueda
          this.listDetFactura[this.consecutivoActualFactura].inputActivoParaBusqueda=true;       
          //activar el focus en el siguiente input y se dispara el evento focus
          document.getElementById(this.idActivo).focus();             
      }


    } else {
      //llamar al input
      const nameInput = document.getElementById(this.idActivo) as HTMLInputElement;
      //asignarle un nuevo valor
      nameInput.value=""
    }
     //hacer los calculos
     this.onCalcularTotales();         
  }
  
  //comprobar si existe el articulo en detalle factura
  onExisteArticuloDetFactura(listDetFactura: detalleFactura[] ,codigoBarra: string ): boolean {
      let consecutivoLocalizado:number;
      //esta variable indica si existe el articulo en la lista
      let existeArticulo: boolean=false;
      for(let detFact of listDetFactura){
        //comprobar si existe el codigo de barra en la lista
        if (detFact.codigoBarra == codigoBarra){
          consecutivoLocalizado=detFact.consecutivo;
          //sumarle un producto mas
          detFact.cantidad= detFact.cantidad + 1.00;
          //obtener el subtotal en dolares
          detFact.subTotalDolar = detFact.precioDolar * detFact.cantidad;
            //obtener el subtotal en cordoba
          detFact.subTotalCordobas = detFact.precioCordobas * detFact.cantidad;
          detFact.totalDolar = detFact.subTotalDolar;
          detFact.totalCordobas = detFact.subTotalCordobas;
          //indicador para saber que existe el articulo en la lista
          existeArticulo=true;
          //rompe el ciclo
          break;
        }
      }

      if (existeArticulo){
        this.guardarBaseDatosFacturaTemp(consecutivoLocalizado)
      }

      
      return existeArticulo;
  }

   //metodo para calcular los totales. la variable calculoIsAutomatico es automatico es para que el sistema tome desiciones 
  onCalcularTotales(calculoIsAutomatico: boolean =true){

    let calcularOtraVez: boolean;
    
    do {
      //es una bandera para detener el ciclo
      calcularOtraVez=false;
      //inicializar valor de la       
      this.procesoFacturacion.inicializarVariableTotales(this.listVarFactura);
     /* this.subTotalDolar=0.0000; this.subTotalCordoba=0.0000;
      //let descuento:number=0.00;
      this.descuentoDolar=0.0000; this.descuentoCordoba = 0.0000;    
      this.subTotalDescuentoDolar=0.0000; this.subTotalDescuentoCordoba =0.0000;
      this.ivaCordoba = 0.0000; this.ivaDolar= 0.0000;    
      this.totalDolar= 0.0000; this.totalCordobas=0.0000;
      this.totalUnidades=0; */

      let sumaTotalDolar: number= 0.0000, sumaTotalCordoba: number=0.0000;

      for(let detfact of this.listDetFactura){
        //precio en cordobas 
        detfact.precioCordobas = (detfact.precioDolar * this.tipoDeCambio)

        //cantidad * precio en Dolares  por cada fila
        detfact.subTotalDolar =  detfact.cantidad * detfact.precioDolar;
        //precio cordobas 
        detfact.subTotalCordobas= detfact.precioCordobas * detfact.cantidad;

        //suma de los subTotales de la lista en dolares
        this.listVarFactura.subTotalDolar += detfact.subTotalDolar;
        //suma de los subTotales de la lista en cordobas
        this.listVarFactura.subTotalCordoba += detfact.subTotalCordobas;

        //inicializar en cero
        detfact.descuentoTotalGeneral=0.0000;

        if (this.listVarFactura.descBeneficioOrDescLinea=="Descuento_DSD" || this.listVarFactura.descBeneficioOrDescLinea=="Descuento_Beneficio") {
          //cordobas
          detfact.descuentoTotalGeneral = (detfact.subTotalCordobas * (this.listVarFactura.porcentajeDescCliente/100.0000));  
        }

        //asignar el descuento por cada fila para el descuentoDolar
        detfact.descuentoDolar =  (detfact.subTotalDolar * (detfact.porCentajeDescuento/100.0000));
        //asignar el descuento por cada fila para el descuentoCordoba
        detfact.descuentoCordoba =  (detfact.subTotalCordobas * (detfact.porCentajeDescuento/100.0000));

        //obtener la suma de los descuento de la lista
        this.listVarFactura.descuentoDolar += detfact.descuentoDolar;
        //obtener la suma de los descuento de la lista
        this.listVarFactura.descuentoCordoba += detfact.descuentoCordoba;

        //la resta del subTotal menos y subTotal de descuento            
        detfact.totalDolar = detfact.subTotalDolar - detfact.descuentoDolar;
        //la resta del subTotal menos y subTotal de descuento cordoba
        detfact.totalCordobas = detfact.subTotalCordobas - detfact.descuentoCordoba;      
        //suma total dolar
        sumaTotalDolar += detfact.totalDolar;
        //suma total cordobas
        sumaTotalCordoba += detfact.totalCordobas;

        //sumar el total de las unidades
        this.listVarFactura.totalUnidades += detfact.cantidad;
      }
    
  
      /******* TEXTBOX SUBTOTAL DESCUENTO ********************************************/
      this.listVarFactura.subTotalDescuentoDolar = this.listVarFactura.subTotalDolar - this.listVarFactura.descuentoDolar;
      this.listVarFactura.subTotalDescuentoCordoba = this.listVarFactura.subTotalCordoba - this.listVarFactura.descuentoCordoba;
      /*****************************************************************************/
      
      /*************************** DESCUENTO DEL BENEFICIO *********************************************/
      let descuentoBeneficioDolar=0.0000;
      let descuentoBeneficioCordoba=0.0000;

      
     
      if (this.listVarFactura.descBeneficioOrDescLinea=="Descuento_DSD" || this.listVarFactura.descBeneficioOrDescLinea=="Descuento_Beneficio") {
        //dolares
        descuentoBeneficioDolar = this.listVarFactura.subTotalDescuentoDolar * (this.listVarFactura.porcentajeDescCliente/100.0000);
        //cordobas
        descuentoBeneficioCordoba =  this.listVarFactura.subTotalDescuentoCordoba * (this.listVarFactura.porcentajeDescCliente/100.0000);  
        this.listVarFactura.descuentoGeneral = descuentoBeneficioCordoba;

      }
      /****************************************************************************************************/

      /******* TEXTBOX DESCUENTO DEL BENEFICIO SI APLICA ********************************************/
      //Dolar: descuentoDolar puede estar en cero (0) o descuento de la linea del producto
      //y luego ssumar el descuento del beneficio (por ej.: 5%)
      this.listVarFactura.descuentoDolar += descuentoBeneficioDolar
      
      //Cordoba: descuentoCordoba puede estar en cero (0) o descuento de la linea del producto
      //y luego ssumar el descuento del beneficio (por ej.: 5%)
      this.listVarFactura.descuentoCordoba += descuentoBeneficioCordoba;
      /*****************************************************************/

      /******* TEXTBOX SUB TOTAL DESCUENTO ********************************************/
      //restar del subtotal descuento Dolar - descuento del beneficio Dolar
      this.listVarFactura.subTotalDescuentoDolar = this.listVarFactura.subTotalDescuentoDolar - descuentoBeneficioDolar
      ////restar del subtotal descuento Cordoba - descuento del beneficio Cordoba
      this.listVarFactura.subTotalDescuentoCordoba = this.listVarFactura.subTotalDescuentoCordoba - descuentoBeneficioCordoba;
      /*****************************************************************************/

      //llamar al metodo obtener iva para identificar si al cliente se le cobra iva
      this.listVarFactura.ivaDolar=this.listVarFactura.subTotalDescuentoDolar * this.serviceCliente.obtenerIVA(this.datoCliente);
      this.listVarFactura.ivaCordoba=this.listVarFactura.subTotalDescuentoCordoba * this.serviceCliente.obtenerIVA(this.datoCliente);
      this.listVarFactura.totalDolar = this.listVarFactura.subTotalDescuentoDolar + this.listVarFactura.ivaDolar;
      this.listVarFactura.totalCordobas = this.listVarFactura.subTotalDescuentoCordoba + this.listVarFactura.ivaCordoba;

    
      /*si el monto del descuento del beneficio no esta OK entonces el sistema cambia 
        automaticamente a los descuentos de linea del producto*/
      if (calculoIsAutomatico){
        //verificar si el estado es Descuento_DSD y que el saldo disponible sea diferente que cero y
        if ((this.listVarFactura.descBeneficioOrDescLinea == "Descuento_DSD") && (this.listVarFactura.porcentajeDescCliente > 0) && (!this.serviceCalculo.montoDescuentoBeneficioIsOk(this.listVarFactura.saldoDisponible, this.listVarFactura.descuentoCordoba))){    
          //actualozar el estado
          this.listVarFactura.descBeneficioOrDescLinea="Descuento_Linea";
          //indicar al sistema que vuelva a realizar los calculos            
          calcularOtraVez=true;
          Swal.fire({ position: 'center', icon: 'success', title: 'El cliente se sobre pasa del monto disponible', showConfirmButton: true, /*timer: 1000*/ });
          //desactivar automaticamente
          this.f["descuentoSobreDescuento"].setValue(false);
          
        } 
        else if ((this.listVarFactura.descBeneficioOrDescLinea =="Descuento_Beneficio") && (this.listVarFactura.saldoDisponible !=0) && (!this.serviceCalculo.montoDescuentoBeneficioIsOk(this.listVarFactura.saldoDisponible, this.listVarFactura.descuentoCordoba))){    
          this.listVarFactura.descBeneficioOrDescLinea="Descuento_Linea";
          this.procesoFacturacion.activarIntercambiarDescuentoLinea(this.listVarFactura, this.listDetFactura);
          //indicar al sistema que vuelva a realizar los calculos                 
          calcularOtraVez=true;        
        }
      }

      //moneda en dolares
      this.f['subTotalDolar'].setValue('U$ ' + this.listVarFactura.subTotalDolar.toFixed(2).toString());
      this.f['descuentoDolar'].setValue('U$ ' + this.listVarFactura.descuentoDolar.toFixed(2).toString());      
      this.f['subTotalDescuentoDolar'].setValue('U$ ' + this.listVarFactura.subTotalDescuentoDolar.toFixed(2).toString());
      this.f['ivaDolar'].setValue('U$ ' + this.listVarFactura.ivaDolar.toFixed(2).toString());
      this.f['totalDolar'].setValue('U$ '+ this.listVarFactura.totalDolar.toFixed(2).toString());

      //moneda en cordobas
      this.f['subTotalCordoba'].setValue('C$ ' + this.listVarFactura.subTotalCordoba.toFixed(2).toString());
      this.f['descuentoCordoba'].setValue('C$ ' + this.listVarFactura.descuentoCordoba.toFixed(2).toString());
      this.f['subTotalDescuentoCordoba'].setValue('C$ ' + this.listVarFactura.subTotalDescuentoCordoba.toFixed(2).toString());
      this.f['ivaCordoba'].setValue('C$ ' + this.listVarFactura.ivaCordoba.toFixed(2).toString());
      this.f['totalCordoba'].setValue('C$ ' + this.listVarFactura.totalCordobas.toFixed(2).toString());

    } while (calcularOtraVez)
    
  }

  //evento cuando cambiar el chech en HTML
  onChange_CheckDescuentoSobreDescuento(){
    this.listVarFactura.desactivarBotonGuardar=true;
    var activoDSD = this.f["descuentoSobreDescuento"].value;
    this.procesoFacturacion.changeCheckDSD(this.listVarFactura, this.listDetFactura, activoDSD)
    this.onCalcularTotales();      
  }

  onValidarCantidades(){
    for(let rows: number=0; rows <= this.listDetFactura.length-1; rows ++){
      let cantidd = document.getElementById('cantidad_'+ rows.toString());      
    }
  }

  //guardar el registro temporalmente mientra esta haciendo la factura
  guardarBaseDatosFacturaTemp(consecutivo:number=-1){
    //si la variable del parametro es (-1) entoneces toma el valor de la variable consecutivoActualFactura
    //de lo contrario toma el valor que viene del parametro y ese sera el consecutivo
    let consecut = consecutivo==-1 ? this.consecutivoActualFactura : consecutivo;
    
    //comprobar si no si es inputUnicoSigArticulo activo
    if (! this.listDetFactura[consecut].inputActivoParaBusqueda ){

        let facturaTemp: facturaTemporal={
          factura: this.f['noFactura'].value,    
          tipoCambio: this.tipoDeCambio,
          bodega: this.f['bodegaID'].value,
          consecutivo: this.listDetFactura[consecut].consecutivo,
          articuloID: this.listDetFactura[consecut].articuloId,
          codigoBarra: this.listDetFactura[consecut].codigoBarra,
          cantidad: this.listDetFactura[consecut].cantidad,
          descripcion: this.listDetFactura[consecut].descripcion,
          unidad: this.listDetFactura[consecut].unidad,
          precio: this.listDetFactura[consecut].precioDolar,
          descuento: this.listDetFactura[consecut].porCentajeDescuento      
        }
        
        //obtener el articulo del servidor               
        this.suscriptions.push(this.serviceFactura.insertOrUpdateFacturaTemporal(facturaTemp).subscribe((response: responseModel)=>{

        }));
    }

  }

  //seleccionar la forma de pago
  onChange(event) {   
    //console.log(deviceValue);
    let codigoValue=event.target.value;
    //desativar el boton guardar
    this.listVarFactura.desactivarBotonGuardar=true;
  
    //comprobar si es tarjeta
    if (codigoValue ==='0003'){
      console.log(codigoValue)
      this.listVarFactura.visibleTipoTarjeta="";
    }   
    else {
      this.listVarFactura.visibleTipoTarjeta='none';
    }

    //comprobar si es tarjeta
    if (codigoValue ==='0004'){
      console.log(codigoValue)
      this.listVarFactura.visibleCondicionPago="";
    }   
    else {
      this.listVarFactura.visibleCondicionPago='none';
    }

    this.listVarFactura.desactivarBotonValDes=!this.procesoFacturacion.desactivarBotonVerificarDescuento(this.listVarFactura, this.listDetFactura, codigoValue )
    
    if (codigoValue.length > 0) this.listVarFactura.desactivarBotonValDes=false;
  }

  onClickValidarDescuento(){

    let formaPago=this.f['forma_Pago'].value;
    let tipoTarjeta=this.f['tipo_Tarjeta'].value;
    let condicionPago=this.f['condicion_Pago'].value

    let mensaje=this.procesoFacturacion.validarAntesActivarBotonValidarDesc(this.listVarFactura, this.listDetFactura, formaPago, tipoTarjeta, condicionPago);
   
      if (mensaje == "OK"){
        /*****************************************************************************************************************/
        /*el sistema analizara por ultima vez si el cliente tiene derecho al descuento 
        o solo tiene derecho al descuento del producto por linea*/
        this.procesoFacturacion.setAnalizar_CambiarEstadoDelDescuento(this.listVarFactura, this.listDetFactura,
                                                          this.datoCliente, this.f['forma_Pago'].value , 
                                                          this.f['descuentoSobreDescuento'].value);
        console.log(this.listVarFactura);
        //activar o desactivar descuento sobre descuento;
        this.f['descuentoSobreDescuento'].setValue(this.procesoFacturacion.isActivoDSD(this.listVarFactura.descBeneficioOrDescLinea));
        //realizar calculos de los totales y que no haga nada en automatico
        this.onCalcularTotales(false);
        //activar el boton de guardar
        this.listVarFactura.desactivarBotonGuardar=false;
        /*****************************************************************************************************************/
      }
      else
      {
        //mostrar un mensaje
        Swal.fire({ position: 'top', icon: 'success', title: mensaje, showConfirmButton: true });
      }


                                                  
    


    /*console.log("aqui inicia");
    const documentDefinition ={
      content: [
        {text: 'Este es un parrafo con el tamaño de fuente grande', fontSize: 15 },
        {
          text: [
            'Este parrafo esta definodo en un arreglo'
          ]
        }
      ]
    }

    pdfMake.createPdf(documentDefinition).open();

    console.log("aqui finaliza");*/

  }

  //evento guardar factura
  onGuardarFactura(){

    let datoEncabezadoFact: encabezadoFactura = {
      noFactura: this.f['noFactura'].value,
      fecha: this.f['fecha'].value,
      bodega: this.f['bodegaID'].value,
      caja: 'T1C9',
      tipoCambio: this.tipoDeCambio,
      codigoCliente: this.f['codigoCliente'].value,
      cliente: this.listVarFactura.nombreCliente,      
      subTotalDolar: this.f['subTotalDolar'].value,
      descuentoDolar: this.f['descuentoDolar'].value,
      ivaDolar: this.f['ivaDolar'].value,
      totalDolar: this.f['totalDolar'].value,

      subTotalCordoba: this.f['subTotalCordoba'].value,
      descuentoCordoba: this.f['descuentoCordoba'].value,
      ivaCordoba: this.f['ivaCordoba'].value,
      totalCordoba: this.f['totalCordoba'].value,

      atentidoPor: "Oscar Alcantara",
      formaDePago: this.procesoFacturacion.getNombreFormaPago(this.f['forma_Pago'].value, this.listFormaPago, 
                      this.f['tipo_Tarjeta'].value, this.f['condicion_Pago'].value, this.listaCondicionPago ),
      observaciones: this.f['observaciones'].value
    }
   
    this.imprimirPdfMake.imprimirTicketFactura(this.listDetFactura, datoEncabezadoFact);

    let dataFactura: viewModelfacturacion={
       factura : {    
          tipo_Documento : "F",
          factura : this.f['noFactura'].value,
          audit_Trans_Inv: null,
          esta_Despachado : "N",
          en_Investigacion : "N",
          trans_Adicionales : "N",
          estado_Remision : "N",
          asiento_Documento : "",
          descuento_Volumen : 0.00000000,
          moneda_Factura : "L",
          comentario_Cxc : null,
          fecha_Despacho : this.listVarFactura.fechaFactura,
          clase_Documento : "N",
          fecha_Recibido : this.listVarFactura.fechaFactura,
          pedido : null,
          factura_Original : null,
          tipo_Original : null,
          comision_Cobrador : 0.00000000,      
          tarjeta_Credito : ((this.f['forma_Pago'].value =='0003') ? this.f['tipo_tarjeta'].value : null),
          total_Volumen :  0.00000000,
          numero_Autoriza : null,
          total_Peso : 0.00000000,
          monto_Cobrado : 0.00000000,
          total_Impuesto1 : 0.00000000,
          fecha : this.listVarFactura.fechaFactura,
          fecha_Entrega : this.listVarFactura.fechaFactura,
          total_Impuesto2 : 0.00000000,
          porc_Descuento2 : 0.00000000,
          monto_Flete : 0.00000000,
          monto_Seguro : 0.00000000,
          monto_Documentacio : 0.00000000,
          tipo_Descuento1 : "P",
          tipo_Descuento2 : "P",
          //* preguntar
          monto_Descuento1 : 0.00000000,
          //*
          monto_Descuento2 : 0.00000000,
          //*
          porc_Descuento1 : 0.00000000,
          //*
          total_Factura : this.listVarFactura.totalCordobas,
          fecha_Pedido : this.listVarFactura.fechaFactura,
          fecha_Hora_Anula : null,
          fecha_Orden : this.listVarFactura.fechaFactura,
          //*
          total_Mercaderia : this.listVarFactura.totalCordobas,
          comision_Vendedor : 0.00000000,
          orden_Compra : null,
          fecha_Hora : this.listVarFactura.fechaFactura,        
          total_Unidades : this.listVarFactura.totalUnidades,
          numero_Paginas : 1,
          tipo_Cambio : this.tipoDeCambio,
          anulada : "N",
          modulo : "FA",
          //PREGUNTAR A JUAN
          cargado_CG : "S",
          //PREGUNTAR a JUAN
          cargado_CXC : "N",
          embarcar_A : this.listVarFactura.nombreCliente,
          direc_Embarque : "ND",
          direccion_Factura : "",
          multiplicador_Ev : 1,
          observaciones : this.f['observaciones'].value,
          rubro1 : null,
          rubro2 : null,
          rubro3 : null,
          rubro4 : null,
          rubro5 : null,
          version_NP : 1,
          moneda : 'D',
          nivel_Precio : this.nivelPrecio,
          cobrador : "ND",
          ruta : "ND",
          /* */
          usuario : "Oscar",
          usuario_Anula : null,
          //si la condicion de pago es CREDITO entonces seleccionar la condicion de pago, sino por defecto es contado (0)
          condicion_Pago : (this.f['forma_Pago'].value =='0004' ? this.f['condicion_Pago'].value : '0'),        
          zona : this.datoCliente.zona,
          vendedor : this.f['bodegaID'].value,
          doc_Credito_Cxc : "",
          cliente_Direccion : this.datoCliente.cliente,
          cliente_Corporac : this.datoCliente.cliente,
          cliente_Origen : this.datoCliente.cliente,
          cliente : this.datoCliente.cliente,
          pais : "505",
          subtipo_Doc_CXC : 0,
          //preguntar a juan
          tipo_Credito_Cxc : null,
          tipo_Doc_CXC : "FAC",
          //monto_Anticipo ES VARIABLE
          monto_Anticipo : 0.00000000,
          total_Peso_Neto : 0.00000000,
          fecha_Rige : this.listVarFactura.fechaFactura,
          //contrato : null,
          porc_Intcte :0.00000000,
          usa_Despachos : "N",
          cobrada : "S",
          descuento_Cascada : "N",
          direccion_Embarque : "ND",
          consecutivo : null,
          reimpreso : 0,
          division_Geografica1 : null,
          division_Geografica2 : null,
          base_Impuesto1 : 0.00000000,
          base_Impuesto2 : 0.00000000,
          nombre_Cliente : this.datoCliente.nombre,
          doc_Fiscal : null,
          nombremaquina : "nombre_maquina",
          serie_Resolucion : null,
          consec_Resolucion : null,
          genera_Doc_Fe : "N",
          tasa_Impositiva : null,
          tasa_Impositiva_Porc : 0.00000000,
          tasa_Cree1 : null,
          tasa_Cree1_Porc : 0.00000000,
          tasa_Cree2 : null, 
          tasa_Cree2_Porc : 0.00000000,
          tasa_Gan_Ocasional_Porc : 0.00000000,
          contrato_Ac : null,
          ajuste_Redondeo : null,
          uso_Cfdi : null,
          forma_Pago : null,
          clave_Referencia_De : null,
          fecha_Referencia_De : null,
          justi_Dev_Haciend : null,
          incoterms : null,
          u_Ad_Wm_Numero_Vendedor : null,
          u_Ad_Wm_Enviar_Gln : null,
          u_Ad_Wm_Numero_Recepcion : null,
          u_Ad_Wm_Numero_Reclamo : null,
          u_Ad_Wm_Fecha_Reclamo : null,
          u_Ad_Pc_Numero_Vendedor : null,
          u_Ad_Pc_Enviar_Gln : null,
          u_Ad_Gs_Numero_Vendedor : null,
          u_Ad_Gs_Enviar_Gln : null,
          u_Ad_Gs_Numero_Recepcion : null,
          u_Ad_Gs_Fecha_Recepcion : null,
          u_Ad_Am_Numero_Proveedor : null,
          u_Ad_Am_Enviar_Gln : null,
          u_Ad_Am_Numero_Recepcion : null,
          u_Ad_Am_Numero_Reclamo : null,
          u_Ad_Am_Fecha_Reclamo : null,
          u_Ad_Am_Fecha_Recepcion : null,
          tipo_Operacion : null,
          noteExistsFlag : 0,
          recordDate : this.listVarFactura.fechaFactura,
          rowPointer : "F1929B9E-5CB4-476D-AFCC-0CC3D7D0D159",
          createdBy : "preguntar a juan",
          updatedBy : "preguntar a juan",
          createDate : this.listVarFactura.fechaFactura,
          clave_De : null,
          actividad_Comercial : null,
          monto_Otro_Cargo : null,
          monto_Total_Iva_Devuelto : null,
          codigo_Referencia_De : null,
          tipo_Referencia_De : null,
          cancelacion : null,
          estado_Cancelacion : null,
          tiene_Relacionados : null,
          prefijo : null,
          fecha_Inicio_Resolucion : null,
          fecha_Final_Resolucion : null,
          clave_Tecnica : null,
          matricula_Mercantil : null,
          es_Factura_Reemplazo : null,
          factura_Original_Reemplazo : null,
          consecutivo_Ftc : null,
          numero_Ftc : null,
          nit_Transportador : null,
          ncf_Modificado : null,
          num_Oc_Exenta : null,
          num_Cons_Reg_Exo : null,
          num_Irsede_Agr_Gan : null,
          u_Ad_Wm_Tipo_Nc : null,
          cuenta_Asiento : null,
          tipo_Pago : null,
          tipo_Descuento_Global : null,
          tipo_Factura : null,
          tipo_Nc : null,
          tipo_Detrac : null,
          act_Detrac : null,
          porc_Detrac : null
        },

        facturaLinea: []
      }
  

    for (let detFactura of this.listDetFactura){
      if (detFactura.articuloId !== ""){
          var datosd_: factura_linea = {   
            factura: this.f['noFactura'].value,
            tipo_Documento: "F",
            linea: detFactura.consecutivo,
            bodega: this.f['bodegaID'].value,
            //preguntar a juan
            costo_Total_Dolar: 0.00,
            //pedido?: string
            articulo: detFactura.articuloId,
            //localizacion?: string
            //lote?: string
            anulada: "N",
            fecha_Factura: this.listVarFactura.fechaFactura,
            cantidad: detFactura.cantidad,

            precio_Unitario: detFactura.precioCordobas,
            total_Impuesto1: 0.00000000,
            total_Impuesto2: 0.00000000,
            //revisar
            desc_Tot_Linea: detFactura.descuentoCordoba,
            //revisar
            desc_Tot_General: detFactura.descuentoTotalGeneral,
            //revisar
            costo_Total: 0.000,
            //revisar
            precio_Total: 0.00,
            descripcion: detFactura.descripcion,
            //comentario?: string
            cantidad_Devuelt: 0.00000000,
            descuento_Volumen: 0.00000000,
            tipo_Linea: "N",
            cantidad_Aceptada: 0.00000000,
            cant_No_Entregada: 0.00000000,
            //revisar
            costo_Total_Local: 0.00,
            pedido_Linea: 0,
            multiplicador_Ev: 1,
            /*serie_Cadena?: number
            serie_Cad_No_Acept?: number
            serie_Cad_Aceptada?: number
            documento_Origen?: string
            linea_Origen?: number
          
            tipo_Origen?: string
            unidad_Distribucio?: string*/
            cant_Despachada: 0.00000000,
            costo_Estim_Local: 0.00000000,
            costo_Estim_Dolar: 0.00000000,
            cant_Anul_Pordespa: 0.00000000,
            monto_Retencion: 0.00000000,
            base_Impuesto1: 0.00000000,
            base_Impuesto2: 0.00000000,
            /*proyecto?: string
            fase?: string
            centro_Costo?: string
            cuenta_Contable?: string*/
            //revisar
            costo_Total_Comp: 0,
            //revisar
            costo_Total_Comp_Local: 0,
            //revisar
            costo_Total_Comp_Dolar: 0,        
            costo_Estim_Comp_Local: 0.00000000,
            costo_Estim_Comp_Dolar: 0.00000000,
            cant_Dev_Proceso: 0.00000000,
            noteExistsFlag: 0,
            recordDate: this.listVarFactura.fechaFactura,
            rowPointer: "D083E752-86BD-41E9-BDAC-12A0B2D865E7",
            //revisar
            createdBy: "string",
            //revisar
            updatedBy: "string",
            createDate: this.listVarFactura.fechaFactura

            /*tipo_Impuesto1?: string
            tipo_Tarifa1?: string
            tipo_Impuesto2?: string
            tipo_Tarifa2?: string
            porc_Exoneracion?: number
            monto_Exoneracion?: number
            es_Otro_Cargo?: string
            es_Canasta_Basica?: string
            es_Servicio_Medico?: string
            monto_Devuelto_Iva?: number
            porc_Exoneracion2?: number
            monto_Exoneracion2?: number
            tipo_Descuento_Linea?: string */         
          } 
          //agregar push para agregar un nuevo registro en los arreglos.
         dataFactura.facturaLinea.push(datosd_);             
      }     
    }

    console.log('dataFactura: ', dataFactura);
    console.log(this.datoCliente);
    this.serviceFactura.insertOrUpdateFacturacion(dataFactura).subscribe((response: responseModel)=>{
      //comprobar si el servidor respondio con exito (1)
      if (response.exito == 1){
        
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Factura guardada correctamente',
            showConfirmButton: false,
            timer: 1000
          });

          this.refrescarPagina();

      }
      else
      {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: response.mensaje,
          showConfirmButton: false,
          timer: 1000
        });
      }

    });
    
  }

  refrescarPagina(){
    window.location.reload();
  }

  onClose() {
    this.dialogRef.close();
  }



/*

       if (valor === "Si") 
        {
            //deshabilitar la seleccion
            this.isDisabledSelecccion = false;
            this.f['leInteresaAvaluoValorString'].setValue("Si");
            this.f['anoModelo'].setValue("2010 O MAYOR");
            this.f['realizoAvaluoValorString'].setValue("No");
            this.f['aplicaAvaluoValorString'].setValue("No");
            //this.f.modeloVHquePosee.setValue("");
            this.frmGroupOportunidad.controls['leInteresaAvaluoValorString'].enable();
            this.frmGroupOportunidad.controls['anoModelo'].enable();
            this.frmGroupOportunidad.controls['realizoAvaluoValorString'].enable();
            this.frmGroupOportunidad.controls['modeloVHquePosee'].enable();
            this.frmGroupOportunidad.controls['aplicaAvaluoValorString'].enable();

        }
        else if (valor === "No") 
        {
            //deshabilitar la seleccion
            this.isDisabledSelecccion = true;
            this.f['leInteresaAvaluoValorString'].setValue("No");
            this.f['anoModelo'].setValue("2010 O MAYOR");
            this.f['realizoAvaluoValorString'].setValue("No");
            this.f['modeloVHquePosee'].setValue("");
            this.f['aplicaAvaluoValorString'].setValue("No");
            this.frmGroupOportunidad.controls['leInteresaAvaluoValorString'].disable();
            this.frmGroupOportunidad.controls['anoModelo'].disable();
            this.frmGroupOportunidad.controls['realizoAvaluoValorString'].disable();
            this.frmGroupOportunidad.controls['modeloVHquePosee'].disable();
            this.frmGroupOportunidad.controls['aplicaAvaluoValorString'].disable();
        }

*/
  

  /*
  recargarDetalleFacturaAsync(){

    this.serviceFactura.recargarFacturaDetalle(this.listDetFactura).subscribe((x=>{
      this.listDetFactura=x;
    }))          
  }*/
}

