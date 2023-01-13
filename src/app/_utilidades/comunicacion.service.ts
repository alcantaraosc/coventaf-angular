import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { facturas } from '../_models/facturas';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {

  //permite enviar mensaje a multiple observadoredes
  private enviarListaFacturaSubject = new Subject<facturas[]>();
  enviarListaFacturaObservable$ = this.enviarListaFacturaSubject.asObservable();


    //(***Idreferencia=EviarDatosModalRolesFunciones***)
  //enviar  datos desde el componente: _components/security/_funciones/rolesfunciones/rolesfunciones.component
  //al componente _components/security/_funciones/modalfunciones/modalfunciones.component
  private enviarDatosrolesfuncionesStringSubject = new Subject<string[]>();
  enviarDatosRolesFuncionesObservable = this.enviarDatosrolesfuncionesStringSubject.asObservable();

  //enviar un datos desde el componente: _components/security/_funciones/rolesfunciones/rolesfunciones.component
  //al componente _components/security/_roles/modalroles/modalroles.component
  private enviarDatosrolesfuncionesStringSubjectRoles = new Subject<string[]>();
  enviarDatosRolesFuncionesObservableRoles = this.enviarDatosrolesfuncionesStringSubjectRoles.asObservable();

    //enviar un datos desde el componente: _components/security/_funciones/rolesfunciones/rolesfunciones.component
  //al componente _components/security/_roles/modalroles/modalroles.component
  private enviarDatosRolesUsuariosStringSubject = new Subject<string[]>();
  enviarDatosRolesUsuariosObservable = this.enviarDatosRolesUsuariosStringSubject.asObservable();

  constructor() { }

  enviarListaFactura(listaFactura: facturas[]) {
    this.enviarListaFacturaSubject.next(listaFactura);
  }

  //enviar la informacion al usuario al logearse
  EviarDatosModalRolesFunciones(valor: string[], ventanaDelComponenteaMostrar: string) {

    if (ventanaDelComponenteaMostrar === 'roles') {

      this.enviarDatosrolesfuncionesStringSubject.next(valor);
    }
    else if (ventanaDelComponenteaMostrar === 'funciones') {
      this.enviarDatosrolesfuncionesStringSubjectRoles.next(valor);
    }
    else if (ventanaDelComponenteaMostrar === 'rolesusuarios') {
      //console.log('********** aqui esta enviando los roles por servicio **************');
      //console.log(valor);
      this.enviarDatosRolesUsuariosStringSubject.next(valor);
    }
  }
  
}
