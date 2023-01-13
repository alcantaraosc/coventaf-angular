import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { responseModel } from '../_viewModel/responseModel';
import { UrlapiService } from './urlapi.service';

@Injectable({
  providedIn: 'root'
})
export class DatamonedahistService {

  constructor(private _http: HttpClient, private urlApi: UrlapiService ) { }

  getTipoCambioDelDia(): Observable<responseModel> {
    return this._http.get<responseModel>(`${this.urlApi.getUrlApi()}/api/monedahist/ObtenerTipoCambioDelDiaAsync/`);   
  }
}
