import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { responseModel } from '../_viewModel/responseModel';
import { viewModelSecurity } from '../_viewModel/viewModelSecurity';
import { UrlapiService } from './urlapi.service';

@Injectable({
  providedIn: 'root'
})
export class DatasecurityfuncionesService {

  constructor(private _http: HttpClient, private urlApi: UrlapiService) { }

    // Listar a datos de la tabla FUNCIONES
    getListarFunciones() {
      return this._http.get<any>(`${this.urlApi.getUrlApi()}/api/securityfunciones/ListarFuncionesAsync`);
    }

    //Lista de datos de la funciones activo
    getListarFuncionesActivo(activo: boolean) {
      return this._http.get<responseModel>(
        `${this.urlApi.getUrlApi()}/api/securityfunciones/ListarfuncionesAsync/${activo}`
      );
    }
    
    //Esto es para buscar el filtro x nombre rol
    getDatosFuncionesPorNombre(nombrefuncion: string){
    return this._http.get<any>(`${this.urlApi.getUrlApi()}/api/securityfunciones/ObtenerFuncionesPorNombre/${nombrefuncion}`);
    }
    
      //Obtener el ID para editar el registo de las funciones
      getDatoFuncionesPorId(funcionID: number): Observable<responseModel> {
        return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/securityfunciones/ObtenerFuncionesPorIdAsync/${funcionID}`);
      }
    
      //Insertar datos en la tabla funciones
      insertfunciones(dataFunciones: viewModelSecurity){
        return this._http.post<responseModel>(`${this.urlApi.getUrlApi()}/api/securityfunciones/GuardarFuncionesAsync`, dataFunciones);
      }
    
     //Para actualizar datos de las funciones
      updateFunciones (funcionesID: number, datafunciones: viewModelSecurity) {
        return this._http.put<responseModel>(`${this.urlApi.getUrlApi()}/api/securityfunciones/ActualizarFuncionesAsync/${funcionesID}`, datafunciones);
      }
    
      //Elimina el rol en caso que sea necesario
      deleteFunciones(funcionesID: number) {
        return this._http.delete(`${this.urlApi.getUrlApi()}/api/securityfunciones/EliminarFuncionesAsync/${funcionesID}`);
      }
}
