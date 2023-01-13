import { Injectable } from '@angular/core';
//jwtHelper: JwtHelperService
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  //aqui inyectar npm install --save @auth0/angular-jwt
  constructor(public jwtHelper: JwtHelperService) { }

  //este metodo verifica si el usuario esta autenticado
  public isAuthenticated(): boolean {
    //obtener el token que esta aloja en el navegador
    const token = localStorage.getItem('token');
    //comprobar si el token a caducado
    return !this.jwtHelper.isTokenExpired(token);
  }
}
