import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { responseModel } from "../_viewModel/responseModel";
import { UrlapiService } from "./urlapi.service";

@Injectable({
  providedIn: 'root'
})
export class DataloginService {
 

  constructor( private _http: HttpClient,private urlApi: UrlapiService) { }

  logearseIn(usuario: string, password: string): Observable<responseModel> {
    return this._http.post<responseModel>( `${this.urlApi.getUrlApi()}/api/login/Authenticate`, { usuario, password });
  }

/*
  logearseIN(){
    return this._http.post<responseModel>(`${this.urlapi.getUrlApi()}/api/login/authenticate`, { usuario, password })
    .pipe(map((response: responseModel) => {     
        var user = response.data;

        if (response.exito == 1){
            //store user details and jwt token in local storage to keep user logged in between page refreshes                                        
            localStorage.setItem('user', JSON.stringify(user));                                            
            this.userSubject.next(user);                 
            return user;
        }
        else{
            //mostrar un mensaje de e                        
            this.notificationService.warn("Usuario o Contraseña incorrecta");                                        
        }
    }));
  }*/

}
