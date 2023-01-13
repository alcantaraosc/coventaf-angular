import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { responseModel } from '../_viewModel/responseModel';
import { viewModelSecurity } from '../_viewModel/viewModelSecurity';
import { UrlapiService } from './urlapi.service';

@Injectable({
  providedIn: 'root'
})
export class DatasecurityuserService {

  constructor(private _http: HttpClient, private urlApi: UrlapiService) { }

  //acceso a datos de la tabla Usuario
  getListadoUsuario() {
    return this._http.get<any>(
      `${this.urlApi.getUrlApi()}/api/securityusuario/ListarUsuariosAsync`
    );
  }

//para el filtroxnombreusuario en la pantalla de inicio del listado
getDatosUsuarioPorNombre(nombrerUsuario: string) {
  return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/securityusuario/ObtenerUsuarioPorNombre/${nombrerUsuario}`);
}


  //Para guardar un nuevo usuario
  insertUsuario(model: viewModelSecurity) {
    console.log(`${this.urlApi.getUrlApi()}/api/securityusuario/GuardarUsuarioAsync`);
    console.log('model=', model);
    return this._http.post<responseModel>(`${this.urlApi.getUrlApi()}/api/securityusuario/GuardarUsuarioAsync`, model );
  }

  //getDatosUsuarioPorId para editar los datos del usuario
  getDatosUsuarioPorId(usuarioID: string) {
    return this._http.get<responseModel>(
      `${this.urlApi.getUrlApi()}/api/securityusuario/ObtenerUsuarioPorIdAsync/${usuarioID}`
    );
  }
 //Actualizar los datos del usuario
  updateUsuario(usuarioID: string, usuario: viewModelSecurity) {
    return this._http.put(`${this.urlApi.getUrlApi()}/api/securityusuario/ActualizarUsuarioAsync/${usuarioID}`, usuario
    );
  }

   //Elimina el usuario
   deleteUsuario(usuarioID: string) {
    return this._http.delete(
      `${this.urlApi.getUrlApi()}/api/securityusuario/EliminarUsuarioAsync/${usuarioID}`
    );
  }
}