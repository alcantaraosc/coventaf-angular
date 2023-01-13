import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class RolesdelsistemaService {

  private _rolesSistemaSubject:  BehaviorSubject<string[]>;
  public rolesSistema: Observable<string[]>;


  constructor() { 
    this._rolesSistemaSubject = new BehaviorSubject<string[]>(JSON.parse(localStorage.getItem('_rolesSistema')));
    this.rolesSistema = this._rolesSistemaSubject.asObservable();
  }

  public get rolesSistemaValue(): string[] {             
    return this._rolesSistemaSubject.value;
  }


  guardarToken(roles: string[]){
    localStorage.setItem('_rolesSistema', JSON.stringify(roles));                                            
    this._rolesSistemaSubject.next(roles);
  }

  cerrarToken(){
    localStorage.removeItem('_rolesSistema');                                            
    this._rolesSistemaSubject.next(null);
  }


  tienesAcceso(){
    let roles = this.rolesSistemaValue;    
  }



    
    
  


  
}
