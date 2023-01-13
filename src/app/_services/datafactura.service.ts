import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { bodega } from '../_models/bodega';
import { detalleFactura } from '../_models/detalleFactura';
import { facturas } from '../_models/facturas';
import { facturaTemporal } from '../_models/facturaTemporal';
import { factura_linea } from '../_models/factura_linea';
import { forma_pagos } from '../_models/forma_pagos';
import { listarDwonList } from '../_models/listarDrownList';
import { responseModel } from '../_viewModel/responseModel';
import { viewModelfacturacion } from '../_viewModel/viewModelfacturacion';
import { filtroFactura } from '../_viewModel/filtroFactura';
import { NotificationService } from './notification.service';
import { UrlapiService } from './urlapi.service';

@Injectable({
  providedIn: 'root'
})
export class DatafacturaService {
  //declarar la factura como BehaviorSubject
  private detfacturaSubject: BehaviorSubject<detalleFactura>;
  //dec
  public detFactura: Observable<detalleFactura>;

  constructor( 
    private _http: HttpClient,
    private notificationService: NotificationService,
    private urlApi: UrlapiService) { 
  
       /* this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      this.user = this.userSubject.asObservable();*/
    }


    public get detalleFacturaValue(): detalleFactura {
      return this.detfacturaSubject.value;
    }


   //verifico si existe en el detalle de factura el proximo input unico para ingresar el 
   onExisteInputUnicoParaProximaArticulo(listDetFactura: detalleFactura[]){
      let existeInput: boolean = false;
      for(let detFact of listDetFactura){      
        //verifico si ya existe el unico input para hacer la busqueda en el detalle factura
        if ( detFact.inputActivoParaBusqueda ){
            //indico que existe el input unico en el detalle de factura.
            existeInput= true;
            //romper el ciclo
            break;
        }
      }

      return existeInput;
  }

 insertOrUpdateFacturaTemporal(model: facturaTemporal): Observable<responseModel> {
    return this._http.post<responseModel>( `${this.urlApi.getUrlApi()}/api/factura/GuardarDatosFacturaTemporal`, model);
  }

  listarFormaDePago(){
    return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/formapago/ListarFormaPagoAsync`);
  }

  llenarComboxFactura(): Observable<listarDwonList> {
    return this._http.get<listarDwonList>(`${this.urlApi.getUrlApi()}/api/factura/llenarComboxFacturaAsync/`);   
  }

  
  obtenerNoFactura(): Observable<responseModel> {
    return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/factura/ObtenerNoFacturaAsync/`);
  }

  AgregarFacturaSubject(detFact: detalleFactura){
    this.detfacturaSubject.next(detFact);
  }

  eliminarArticuloDetalleFactura(noFactura: string, articuloId: string): Observable<responseModel> {
    return this._http.delete<responseModel>(`${this.urlApi.getUrlApi()}/api/factura/EliminarArticuloDetalleFacturaAsync/${noFactura}/${articuloId}`);   
  }

  //eliminar el articulo del detalle de factura
  public eliminarProductoFactura(producto: detalleFactura[], noFactura: string, articuloId: string, consecutivo: number)  {
  
    //eliminar 
    producto.splice(consecutivo, 1);    
    let rows: number=0;
    
    for(let prod of producto){
      //actualizar el consecutivo al array
      prod.consecutivo=rows
      rows += 1; 
    }

    this.eliminarArticuloDetalleFactura(noFactura,  articuloId).subscribe((response: responseModel)=>{    
     
    });
    
  }

  listarFacturas(filtroFactura: filtroFactura){
    return this._http.post<responseModel>( `${this.urlApi.getUrlApi()}/api/factura/ListarFacturas`, filtroFactura);
  }


  insertOrUpdateFacturacion(model: viewModelfacturacion): Observable<responseModel> {
    return this._http.post<responseModel>( `${this.urlApi.getUrlApi()}/api/factura/GuardarFacturaAsync`, model);
  }
  /*
  recargarFacturaDetalle(model: detalleFactura[]): Observable<detalleFactura[]> {

    return model;
  }*/


  //verificar si el input en donde puso el cursor el usuario es el input valido para busqueda
  onInputParaBusquedaEsValido(detalleFactura: detalleFactura[], index: number): boolean {
    let esValido: boolean;
    let indiceEncontrad: number=-1;
    
    for(let det of detalleFactura){
      //verificar si esta activo el input de busqueda 
      if(det.inputActivoParaBusqueda && det.consecutivo == index){
        indiceEncontrad = det.consecutivo;        
        break;
      }
    } 

    return (index == indiceEncontrad ? true: false);    
  }
}

  
  

