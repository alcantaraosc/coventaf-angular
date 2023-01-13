import { ReturnStatement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { detalleFactura } from '../_models/detalleFactura';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  constructor() { }

  //toma de decision del sistema si obtiene descuento de Linea del producto o el descuento del Beneficio
  /*setTomaDecisionDescBeneficioOrDescLinea(SaldoDisponible: number, descuentoFactura: number, descuentoSobreDescuento: boolean  ){
    console.log("descuentoSobreDescuento: ", descuentoSobreDescuento)
    let valor="";

    if (descuentoSobreDescuento)
      valor = "Descuento_DSD";
    //si el saldo disponible del cliente es mayor que cero
    else if (SaldoDisponible > 0)
      valor ="Descuento_Beneficio";
    else
      valor = "Descuento_Linea";

      /*
    //si es Descuento_DSD or Descuento_Beneficio y tiene saldo disponible y el metodo montoDescuentoBeneficioIsOk no es Ok entonces cambia automanticamente de descuento
    if (((valor == "Descuento_DSD") || (valor =="Descuento_Beneficio")) && (SaldoDisponible !=0) && (!this.montoDescuentoBeneficioIsOk(SaldoDisponible, descuentoFactura)))
      valor="Descuento_Linea";*/

    /*return valor;
  }*/

    //toma de decision del sistema si obtiene descuento de Linea del producto o el descuento del Beneficio
    setTomaDecisionicioOrDescLinea(SaldoDisponible: number, descuentoSobreDescuento: boolean  ){
      if (descuentoSobreDescuento)
        return 'Descuento_DSD';
      //si el saldo disponible del cliente es mayor que cero
      if (SaldoDisponible > 0)
        return 'Descuento_Beneficio';
      else
        return 'Descuento_Linea';
    }

  //verificar el saldo Disponible
  setValorDescuento(saldoDisponible: number, descuentoFactura: number){
    let valor=""
    if (descuentoFactura <= saldoDisponible)
      valor="Descuento_Beneficio";
    else if (descuentoFactura > saldoDisponible)
      valor="Descuento_Linea";
   
    return valor;
  }

  //verificar el saldo Disponible
  montoDescuentoBeneficioIsOk(saldoDisponible: number, descuentoFactura: number) {
    
    if (descuentoFactura <= saldoDisponible)
      return true;
    else //if (descuentoFactura > saldoDisponible)
      return false;      
  }

  //hacer calculo para el DSD(descuento sobre descuento)
  setHacerCalculosDSD(saldoDisponible: number, descuentoFactura: number){
    if (this.montoDescuentoBeneficioIsOk(saldoDisponible, descuentoFactura))
      return true;
    else
      return false;
  }

  //poner el descuento
  setDescuentoDetalleFactura(descuento: number, descuentoActivo: boolean, activarDSD: boolean=false): number {
      let valorDescuento: number=0.0000;

      //si descuentoActivo es true y activar descuento sobre descuento (activarDSD) es true
      if ((descuentoActivo) || (activarDSD)){
        valorDescuento=(descuento/100.0000);
      }
      else if ((descuentoActivo) && !(activarDSD)){
        valorDescuento=0.00;          
      }

      return valorDescuento;
  }






  }




    //setActivarOrDesactivarDescuento()



    

