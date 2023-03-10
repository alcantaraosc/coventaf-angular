import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot  } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})

//este es el guard que revisa si tiene permiso para acceder.
export class AuthGuard implements CanActivate {


  //inyectar en el constructor el route y 
  constructor(
    private router: Router, 
    private accountService: AccountService ){}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
      const user = this.accountService.userValue;
      if (user) {
          // authorised so return true
          return true;
      }

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
      return false;
  } 
}
