import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { responseModel } from '../_viewModel/responseModel';
import { viewModelSecurity } from '../_viewModel/viewModelSecurity';
import { UrlapiService } from './urlapi.service';

@Injectable({
  providedIn: 'root'
})
export class DatasecurityrolesService {

  constructor(private _http: HttpClient, private urlApi: UrlapiService) { }
   //acceso a datos de la tabla Roles
   getListarRol() {
    return this._http.get<any>(
      `${this.urlApi.getUrlApi()}/api/securityroles/ListarRolesAsync`
    );
  }

  getListarRolActivo(activo: boolean) {
    return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/securityroles/ListarRolesAsync/${activo}`);
  }

  //Guardar los datos del rol
  insertRol(dataRoles: viewModelSecurity): Observable<responseModel> {
    return this._http.post<responseModel>(
      `${this.urlApi.getUrlApi()}/api/securityroles/GuardarRolesAsync`,
      dataRoles
    );
  }

   //para el filtro por nombrerol en la pantalla de inicio del listado
   getDatosRolesPorNombre(nombreRol: string) {
    return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/securityroles/ObtenerRolPorNombre/${nombreRol}`);
  }

  //Obtener el ID para editar el registo de la tabla Roles oscar
  getDatosRolPorId(rolID: number): Observable<responseModel> {
    return this._http.get<responseModel>(
      `${this.urlApi.getUrlApi()}/api/securityroles/ObtenerRolPorIdAsync/${rolID}`
    );
  }

  //Para actualizar datos de rol
  updateRoles(rolID: number, dataRoles: viewModelSecurity) {
    return this._http.put(
      `${this.urlApi.getUrlApi()}/api/securityroles/ActualizarRolesAsync/${rolID}`,
      dataRoles
    );
  }

  //Elimina el rol en caso que sea necesario
  deleteRoles(rolid: number) {
    return this._http.delete(
      `${this.urlApi.getUrlApi()}/api/securityroles/EliminarRolesAsync/${rolid}`
    );
  }
}

