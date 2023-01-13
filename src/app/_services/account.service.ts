import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { responseModel } from '../_viewModel/responseModel';
import { User } from '../_models/user';
import { NotificationService } from './notification.service';
import { UrlapiService } from './urlapi.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

//import { environment } from '@environments/environment';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';
import { CookieService } from 'ngx-cookie-service';
import { DataloginService } from './datalogin.service';
import { Token } from '@angular/compiler';
import { RolesdelsistemaService } from '../_utilidades/rolesdelsistema.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    //indicar que el usuario esta logeado
    private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
    
  
    constructor( private router: Router, private _http: HttpClient,
        private notificationService: NotificationService, private AlertService: AlertService,
        private urlapi: UrlapiService, private cookies: CookieService, private seriveLogin: DataloginService,
        private serviceRolesSistema: RolesdelsistemaService
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();

       //this._isLoggedIn$.next(!!token)
        
    }
  
    public get userValue(): User {             
        return this.userSubject.value;
    }
  
  
    /*
    login(username: string, password: string) {
     
     return this.http.post<User>(`${this.urlapi.getUrlApi()}/api/login/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                console.log('servicio account usuario');
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }
    */
    
  
  
    login2(usuario: string, password: string) {
        
          
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
    }
    logIn2(usuario: string, password: string) {

    }

    logIn(usuario: string, password: string) {
        
        return this.seriveLogin.logearseIn(usuario, password).pipe(
            tap((response: responseModel) =>{
                //asignar los datos que retorna el servidor
                var user = response.data;
                var roles= response.dataAux;

                if (response.exito == 1){
                    //store user details and jwt token in local storage to keep user logged in between page refreshes                                        
                    localStorage.setItem('user', JSON.stringify(user));                                            
                    this.userSubject.next(user);
                    //indicar que el usuario esta en sesion.
                    this._isLoggedIn$.next(true);      
                    //guardar el token de los roles.              
                    this.serviceRolesSistema.guardarToken(roles);
                    //localStorage.setItem('profanis_auth', response.token);
                    //return user;
                }
                else{
                    //mostrar un mensaje de e                        
                    this.notificationService.warn(response.mensaje);                                        
                }

            })

        ) 
        



    }
  
    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');                     
        this.userSubject.next(null);
        this._isLoggedIn$.next(false);
        this.serviceRolesSistema.cerrarToken();
        
        this.router.navigate(['/account/login']);
    }
  
    
    register(user: User) {
        return this._http.post(`${this.urlapi.getUrlApi()}/users/register`, user);
    }
  
    getAll() {
        return this._http.get<User[]>(`${this.urlapi.getUrlApi()}/users`);
    }
  
    getById(id: string) {
        return this._http.get<User>(`${this.urlapi.getUrlApi()}/users/${id}`);
    }
  
    
    update(id: string, params: User) {
        return this._http.put(`${this.urlapi.getUrlApi()}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.usuario) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));
  
                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }
    
  
    
    delete(id: string) {
        return this._http.delete(`${this.urlapi.getUrlApi()}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.usuario) {
                    this.logout();
                }
                return x;
            }));
    }  
  
  
    setToken(token: string) {
      this.cookies.set("token", token);
    }
  
    getToken() {
      return this.cookies.get("token");
    }
  
    deleteToken(){
      this.cookies.delete("token");
    }
  
    getUserLogged() {
      const token = this.getToken();
      // Aquí iría el endpoint para devolver el usuario para un token
    }
  
  }
