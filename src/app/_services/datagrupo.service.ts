import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { responseModel } from '../_viewModel/responseModel';
import { UrlapiService } from './urlapi.service';

@Injectable({
  providedIn: 'root'
})
export class DatagrupoService {
  

  constructor(private _http: HttpClient, private urlApi: UrlapiService) { }

     //acceso a datos de la tabla Roles
     getListarGrupo() {
      return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/grupo/ListarGruposAsync` );
    }
}
