import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, throwError,  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { cliente } from '../_models/cliente';
import { responseModel } from '../_viewModel/responseModel';
import { UrlapiService } from './urlapi.service';

enum Militar { Credito_Descuento, Descuento};
enum Empleado { SoloCredito, Descuento }

@Injectable({
  providedIn: 'root'
})
export class DataclienteService {
  

  constructor(private _http: HttpClient, private urlApi: UrlapiService) { }

  getDatosDelClienteId(clienteID: string): Observable<responseModel> {
    return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/clientes/ObtenerClientePorIdAsync/${clienteID}`);   
  }

  /*
  getDatosDelClienteId(clienteID: string): Observable<responseModel> {
      return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/clientes/ObtenerClientePorIdAsync/${clienteID}`)
      .pipe(
          map( next => (resp: responseModel) => {

          } ), 
          catchError(this.manejarError))
      
  }*/

  manejarError(error: HttpErrorResponse){
    let errorMessage='';
    if (error.error instanceof ErrorEvent) {
      //cliente-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error code: ${error.status}\n Message: ${error.message}`
    }
  
    return  throwError(errorMessage);

  }

/*
  getDatosFinancieraPorId(id: number){
    return this._http.get(`${this.urlApi.getUrlApi()}/api/financieras/GetFinancieraAsync/${id}`);
  }

  getDatosFinancieraPorNombre(nombre: string){
    return this._http.get<any>(`${this.urlApi.getUrlApi()}/api/financieras/GetFinancieraPorNombreAsync/${nombre}`);
  }

  insertFinanciera(banco: financiera){
    return this._http.post(`${this.urlApi.getUrlApi()}/api/financieras/GuardarFinancieraAsync`, banco);
  }

  updateFinanciera(id: number, financiera: financiera){
    return this._http.put(`${this.urlApi.getUrlApi()}/api/financieras/ActualizarFinancieraAsync/${id}`, financiera);
  }*/

  /*
  0001	EFECTIVO
0002	CHEQUE
0003	TARJETA
0004 CREDITO*/

  //este metodo verifica si tiene derecho al descuento 
  public obtenerDescuento(datoCliente: cliente, formaPago: string): number{
    let descuento=0.0000;

      ///si eres militar entonces tiene derecho descuento
      if (datoCliente.u_EsMilitar =="S"){
        descuento=datoCliente.u_Descuento;

      }
      //si eres empleado y la forma de pago no es al credito entonces tienes derecho al descuento
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

    if (monto >= datosCliente.u_MontoInicial){
      aplicarDescuento=true;
    }

    return aplicarDescuento;
  }
}
