import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { UrlapiService } from '../_services/urlapi.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService, private apiUrl: UrlapiService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
     //obtener el usuario
     const user = this.accountService.userValue;
     //verificar si el usuario y token existen
     const isLoggedIn = user && user.token;
     const isApiUrl = request.url.startsWith(this.apiUrl.getUrlApi());
     //verificando si el usuario esta logeado
     if (isLoggedIn && isApiUrl) {
         //obtener la Authorization
         request = request.clone({
             setHeaders: {
                 Authorization: `Bearer ${user.token}`
             }
         });
     }
    return next.handle(request);
  }
}
