import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class EventemitService {

/*private countdownEndSource = new Subject<void>();
  public countdownEnd$ = this.countdownEndSource.asObservable();*/

  //atributo
  private emitirCodigoBarraSubject = new Subject<string>();

  //emitirCodigoBarra$ = new EventEmitter<string>();

  //atributo
  private enviarMensajeSubject = new Subject<string>();
  enviarMensajeObservable = this.enviarMensajeSubject.asObservable();
  
  
  constructor() { }
   
  //observable
  //public emitirCodigoBarraObservable$ = this.emitirCodigoBarraSubject.asObservable();

  /*
  //metodo
  SendCodigoBarraArticulo(codigoBarra: string) { 
      console.log('codigo del articulo')   ;
      //emitir el codigo de barra al componente: detallefactura(_components/puntoventa/detallefactura)    
      this.emitirCodigoBarraSubject.next(codigoBarra);
  }*/

  enviarMensaje(mensaje: string){
    this.enviarMensajeSubject.next(mensaje);
  }


  public destroy(){
    //clean timeout reference
  }



}
