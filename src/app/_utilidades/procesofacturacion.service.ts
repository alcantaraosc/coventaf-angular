import { Injectable } from '@angular/core';
import { bodega } from '../_models/bodega';
import { cliente } from '../_models/cliente';
import { condicionPago } from '../_models/condicionPago';
import { detalleFactura } from '../_models/detalleFactura';
import { forma_pagos } from '../_models/forma_pagos';
import { listarDwonList } from '../_models/listarDrownList';
import { varFacturacion } from '../_viewModel/varFacturacion';

@Injectable({
  providedIn: 'root'
})
export class ProcesofacturacionService {

  constructor() { }

  inicializarTodaslasVariable(listVarFactura: varFacturacion){
    listVarFactura.consecutivoActualFactura =0;
    listVarFactura.inputActivo = ""
    listVarFactura.idActivo =""
    //indica si el descuento esta aplicado o no esta aplicado
    listVarFactura.descuentoActivo=true;
    //indica si el descuento es del beneficio o descuento es de Linea
    listVarFactura.descBeneficioOrDescLinea = ""
    listVarFactura.visibleTipoTarjeta='none'
    listVarFactura.visibleCondicionPago ='none'
    //descuento que el cliente
    listVarFactura.tipoDeCambio =0.0000;
    listVarFactura.bodegaId =""
    listVarFactura.nivelPrecio ="GENERAL";

    /**Totales */
    listVarFactura.subTotalDolar =0.0000; 
    listVarFactura.subTotalCordoba =0.0000; 
    //descuento
    listVarFactura.descuentoDolar = 0.0000; 
    listVarFactura.descuentoCordoba = 0.0000;   
    listVarFactura.descuentoGeneral = 0.0000;
    //subtotales 
    listVarFactura.subTotalDescuentoDolar = 0.0000; 
    listVarFactura.subTotalDescuentoCordoba = 0.0000;
    listVarFactura.ivaCordoba = 0.0000;  
    listVarFactura.ivaDolar = 0.0000;
    listVarFactura.totalDolar = 0.0000; 
    listVarFactura.totalCordobas = 0.0000;
    listVarFactura.totalUnidades = 0.0000;
    //fecha de hoy
    listVarFactura.fechaFactura = new Date();

  }

  //inicializar las variables totales
  inicializarVariableTotales(listVarFactura: varFacturacion){ 
    /**Totales */
    listVarFactura.subTotalDolar =0.0000; listVarFactura.subTotalCordoba =0.0000; 
    //descuento
    listVarFactura.descuentoDolar = 0.0000; listVarFactura.descuentoCordoba = 0.0000; listVarFactura.descuentoGeneral = 0.0000;
    //subtotales 
    listVarFactura.subTotalDescuentoDolar = 0.0000; listVarFactura.subTotalDescuentoCordoba = 0.0000; 
    //iva
    listVarFactura.ivaCordoba = 0.0000;  listVarFactura.ivaDolar = 0.0000;
    //total
    listVarFactura.totalDolar = 0.0000; listVarFactura.totalCordobas = 0.0000;    
    listVarFactura.totalUnidades = 0.0000;  
  }


  //agregar un registro en el arreglo
  addNewRow(listDetFactura: detalleFactura[]){ 

    //obtener el numero consecutivo del
    const numConsecutivo= listDetFactura.length;
    var datosd_: detalleFactura = {
      consecutivo: numConsecutivo,
      articuloId: "",
      inputArticuloDesactivado: true,
      codigoBarra: "",
      descripcion: "",
      unidad: "unidad",
      cantidad: 1.00,
      cantidadExistencia: 0,
      inputCantidadDesactivado: false,
      precioDolar: 0.00,
      precioCordobas: 0.00,
      subTotalDolar: 0.00,
      subTotalCordobas: 0.00,
      porCentajeDescuento: 0.00,
      descuentoInactivo: 0.00,
      descuentoDolar: 0.00,
      descuentoCordoba: 0.00,  
      descuentoTotalGeneral:0.0000,                    
      totalDolar: 0.00,
      totalCordobas: 0.00,      
      inputActivoParaBusqueda: false,
      botonEliminarDesactivado: true,
      
    }

    //agregar push para agregar un nuevo registro en los arreglos.
    listDetFactura.push(datosd_);     
  }

  //asignar datos del cliente para mostrarlo en HTML
  public asignarDatoClienteParaVisualizarHtml(datosCliente: cliente, listVarFactura: varFacturacion){
    //nombre del cliente
    listVarFactura.nombreCliente = datosCliente.nombre;
    //saldo disponible del cliente
    listVarFactura.saldoDisponible = datosCliente.u_SaldoDisponible;
    //porcentaje del cliente
    listVarFactura.porcentajeDescCliente = datosCliente.u_Descuento      
  }

  public inicializarDatosClienteParaVisualizarHTML(listVarFactura: varFacturacion){ 
    //nombre del cliente
    listVarFactura.nombreCliente = "********";
    //saldo disponible del cliente
    listVarFactura.saldoDisponible = 0.0000
    //el porcentaje del clienteo, descrito 5.20 %
    listVarFactura.porcentajeDescCliente = 0.0000
  }

  //despues de obtener los datos del cliente del servidor el sistema inicia valores
  public asignarValoresDespuesConsultarCliente(listVarFactura: varFacturacion, descuentoSobreDescuento: boolean){
    //asignar el valor de Descuento del Beneficiario
    listVarFactura.descBeneficioOrDescLinea = this.getValorDescuentoDelBeneficiario(listVarFactura, descuentoSobreDescuento)
    //activar o desactivar los descuento por linea.
    listVarFactura.descuentoActivo = this.DescuentoLineaActivoIsOk(listVarFactura.descBeneficioOrDescLinea);         
  }

  //toma de decision del sistema si obtiene descuento de Linea del producto o el descuento del Beneficio
  getValorDescuentoDelBeneficiario(listVarFactura: varFacturacion, descuentoSobreDescuento: boolean  ){
    let valor="";

    if (descuentoSobreDescuento)
      valor = "Descuento_DSD";
    //si el saldo disponible del cliente es mayor que cero
    else if (listVarFactura.saldoDisponible  > 0)
      valor ="Descuento_Beneficio";
    else
      valor = "Descuento_Linea";

      /*
    //si es Descuento_DSD or Descuento_Beneficio y tiene saldo disponible y el metodo montoDescuentoBeneficioIsOk no es Ok entonces cambia automanticamente de descuento
    if (((valor == "Descuento_DSD") || (valor =="Descuento_Beneficio")) && (SaldoDisponible !=0) && (!this.montoDescuentoBeneficioIsOk(SaldoDisponible, descuentoFactura)))
      valor="Descuento_Linea";*/

    return valor;
  }

  //activar o desactivar el boton DSD(Descuento Sobre Descuento)
  activarBotonDSD( porcentajeDescTitular: number ): boolean {
    let activar = false;
    //si el porcentaje es mayor que cero entonces
    if (porcentajeDescTitular > 0)
      //activar el boton 
      activar=true;
    else
      //desactivar el boton DSD
      activar=false;

  
    return activar;
  }
      

   /* 0001	EFECTIVO, 0002	CHEQUE, 0003	TARJETA, 0004 CREDITO*/
  //este metodo verifica si tiene derecho al descuento 
  public obtenerDescuento(datoCliente: cliente, formaPago: string): number{
    let descuento=0.0000;

      ///si eres militar entonces tiene derecho descuento independientemente si es al credito
      if (datoCliente.u_EsMilitar =="S"){
        descuento=datoCliente.u_Descuento;

      }
      //si eres empleado y la forma de pago no es al credito (0004) entonces tienes derecho al descuento
      else if (datoCliente.u_EsEmpleado == "S" && formaPago !== '0004'){
        descuento=datoCliente.u_Descuento;
      }

      return descuento;
  }

  //verificar si el cliente paga IVA
  public obtenerIVA(datosCliente:cliente): number {
    let IVA=0.0000;

    if (datosCliente.codigo_Impuesto =="IVA"){
      IVA=0.15;
    }

    return IVA;
  }

  //  
  aplicaMontoParaDescuento(datosCliente: cliente, monto: number): boolean {
    let aplicarDescuento: boolean=false;

    if (monto > datosCliente.u_MontoInicial){
      aplicarDescuento=true;
    }

    return aplicarDescuento;
  }

  //verificar si debes de activar la linea de descuento o desactivar la linea de descuento
  DescuentoLineaActivoIsOk(descBeneficioOrDescLinea: string){
    if (descBeneficioOrDescLinea=="Descuento_Linea" ||  descBeneficioOrDescLinea=="Descuento_DSD")
      return true;
    else
      return false;
  }

  //verificar si DSD(Descuento Sobre Descuento) esta activado o no
  isActivoDSD(descBeneficioOrDescLinea: string): boolean {
    return (descBeneficioOrDescLinea=="Descuento_DSD" ? true : false);
  }

  //actualiza el estado e intercambia con los descuento de los registro del detalle de factura
  activarIntercambiarDescuentoLinea(listVarFactura: varFacturacion, detallefact: detalleFactura[]){
    
    //verifico que el estado de la variable descuentoActivo este desactivada
    if (!listVarFactura.descuentoActivo){
      //activar
      listVarFactura.descuentoActivo=true;     
      //intercarmbiar los descuentos si existiera 
      this.setAcitvoOrDesactivoDescPorLinea(detallefact, listVarFactura.descuentoActivo)
    }

  }

  //desactivar el intercambio de descuento de linea del producto
  desactivarIntercambioDescuentoLinea(listVarFactura: varFacturacion, detallefact: detalleFactura[]){
    //verifico que el estado de la variable descuentoActivo este desactivada
    if (listVarFactura.descuentoActivo){
      //desactivar
      listVarFactura.descuentoActivo=false;     
      //intercarmbiar los descuentos si existiera
      this.setAcitvoOrDesactivoDescPorLinea(detallefact, listVarFactura.descuentoActivo)
    }

  }

  //activa o desactiva (intercambiar) los descuento por linea
  setAcitvoOrDesactivoDescPorLinea(detallefact: detalleFactura[], descuentoActivo: boolean){       
    for(let detFactura of detallefact){
     
      //comprobar si se van activar los descuentos est
      if (descuentoActivo){

        const descuentoTemp =detFactura.descuentoInactivo;
        detFactura.descuentoInactivo=detFactura.porCentajeDescuento;
        detFactura.porCentajeDescuento=descuentoTemp;
        
      } else {
        const descuentoTemp =detFactura.porCentajeDescuento;
        detFactura.porCentajeDescuento=detFactura.descuentoInactivo;
        detFactura.descuentoInactivo=descuentoTemp;
        }
    
      }
  }

  changeCheckDSD(listVarFactura: varFacturacion, detalleFact: detalleFactura[], activoDSD: boolean){
    if (activoDSD){      
      listVarFactura.descBeneficioOrDescLinea="Descuento_DSD";
      //actualiza el estado e intercambia con los descuento de los registro del detalle de factura
      this.activarIntercambiarDescuentoLinea(listVarFactura, detalleFact);      
    }
    else{

      listVarFactura.descBeneficioOrDescLinea="Descuento_Beneficio"; 
       //actualiza el estado e intercambia con los descuento de los registro del detalle de factura
       this.desactivarIntercambioDescuentoLinea(listVarFactura, detalleFact);        
    }
  }

 //anilizar y cambiar el estado de los descuentos
  setAnalizar_CambiarEstadoDelDescuento(listVarFactura: varFacturacion, detalleFact: detalleFactura[] , 
                          datoCliente: cliente, formaPago: string, estadoDSD: boolean) {
    //obtener el descuento del Beneficio
    let porcentajeDescBeneficio = this.obtenerDescuento(datoCliente, formaPago);
    
    //si existe descuento entonces el cliente tiene el beneficio
    if ((porcentajeDescBeneficio > 0) && (estadoDSD)){
      //actualizar
      listVarFactura.descBeneficioOrDescLinea="Descuento_DSD";
      //activar el estado del descuento del beneficio si lo amerita
      this.activarIntercambiarDescuentoLinea(listVarFactura, detalleFact);     
    }
    else if ((porcentajeDescBeneficio > 0) && (!estadoDSD)){
      //actualizar
      listVarFactura.descBeneficioOrDescLinea="Descuento_Beneficio";
      //desactivar los intercambio de descuento si existiera
      this.desactivarIntercambioDescuentoLinea(listVarFactura, detalleFact)
     
    }
    else{
      //de lo contrario el cliente no tiene derecho al descuento del beneficio, solo al descuento del articulo(solo si existiera el descuento)
      listVarFactura.descBeneficioOrDescLinea="Descuento_Linea" ;
      //activar (mostrar) la linea del descuento del producto solo si existiera
      this.activarIntercambiarDescuentoLinea(listVarFactura, detalleFact)     
    }

  }


  desactivarBotonVerificarDescuento(listVarFactura: varFacturacion, detalleFactura: detalleFactura[], forma_Pago: string){
    //verifico que existe el cliente y si existe almenos un codigo de barra
    if ((listVarFactura.nombreCliente.length > 0) && (detalleFactura[0].codigoBarra.toString().length > 0) && (forma_Pago.length >0))
      return true;        
    else 
      return false;
  }

  //validar el boton validar descuento
  validarAntesActivarBotonValidarDesc(listVarFactura: varFacturacion, detalleFactura: detalleFactura[], 
                           forma_Pago: string, tipoTarjeta: string, condicionPago: string): string {
    
    //si la validacion esta correcta entonces devuelve un OK
    let mensaje: string="OK";
    let drownListVisible = '';
    
    if (forma_Pago=="0003")
      drownListVisible ='tipo_tarjeta';

    else if (forma_Pago=="0004")
      drownListVisible = 'condicion_pago';
    
  

     //verificar si almenos la primer fila del detalle de la factura tiene un producto
    if (detalleFactura[0].codigoBarra.toString().length == 0)
      mensaje="Debes de ingresar al menos un articulo";
        
    //verificar si es tarjeta y el tipo de tarjeta es igual al vacio
    else if ((forma_Pago == '0003') && (tipoTarjeta.length == 0) &&(drownListVisible == 'tipo_tarjeta')) 
      mensaje="Debes de seleccionar el tipo de tarjeta";
        
    //verificar si es credito y la condicion de pago es igual al vacio
    else if((forma_Pago == '0004') && (condicionPago.length == 0) && drownListVisible == 'condicion_pago') 
      mensaje="Debes de seleccionar la condicion de pago";
    
    return mensaje;
  }

  

  //obtener el nombre del forma de pago
  getNombreFormaPago(codigoFormaPago: string, listFormaPago: forma_pagos[], tipo_Tarjeta: string, condicion_Pago: string, 
    listaCondicionPago: condicionPago[]): string {
    let description: string="";
    let desciptCondicionPago: string="";

    description = listFormaPago.find(lf => lf.forma_Pago === codigoFormaPago).descripcion.toString();

    for(let datFormaPag of listFormaPago){
      //comprobar si existe el codigo de forma de pago
      if (datFormaPag.forma_Pago == codigoFormaPago){
        description = datFormaPag.descripcion
      }
    }

    for(let datCondicionPago of listaCondicionPago){
      //comprobar si existe el codigo de forma de pago
      if (datCondicionPago.condicion_Pago === condicion_Pago){
        desciptCondicionPago = datCondicionPago.descripcion
      }
    }

    //verificar si es tarjeta
    if (description == "TARJETA")
      //agregar el tipo de tarjeta
      description = description + " "+ tipo_Tarjeta;

    //verificar si es credito
    else if (description == "CREDITO")
      //agregar la condicion de pago
      description = description + " "+ desciptCondicionPago;

    return description;
  }

  //obtener el nombre del forma de pago
  getNombreBodega(codigoBodega: string, listBodega: bodega[]): string {
      let description: string="";
  
      for(let datBodega of listBodega){
        //comprobar si existe el codigo de forma de pago
        if (datBodega.vendedor == codigoBodega){
          description = datBodega.nombre
        }
      }
  
    return description;
  }




}
