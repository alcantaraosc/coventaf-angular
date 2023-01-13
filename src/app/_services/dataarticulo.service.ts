import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { responseModel } from '../_viewModel/responseModel';
import { UrlapiService } from './urlapi.service';

@Injectable({
  providedIn: 'root'
})
export class DataarticuloService {

  constructor(private _http: HttpClient, private urlApi: UrlapiService) { }

  getDatosDelArticuloId(articuloID: string, bodegaID: string): Observable<responseModel> {    
    console.log('bodegaID: ', bodegaID)
    return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/articulos/ObtenerArticuloPorIdAsync/${articuloID}/${bodegaID}`);   
  }

}
