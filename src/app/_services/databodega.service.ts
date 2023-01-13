import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { responseModel } from '../_viewModel/responseModel';
import { UrlapiService } from './urlapi.service';

@Injectable({
  providedIn: 'root'
})
export class DatabodegaService {

  constructor(private _http: HttpClient, private urlApi: UrlapiService) { }

  getListaBodegaActivas(): Observable<responseModel> {  
    
    return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/bodegas/ListarBodegasAsync/`);   
  }
}
