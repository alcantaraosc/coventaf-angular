import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppserviceService {

  constructor() { }


  
  public config = new EventEmitter<any>();
  public tipo$ = new EventEmitter<number>();

  /*
  private enviarOportunidadSubject = new Subject<parametros>();
  enviarOportunidadObservable$ = this.enviarOportunidadSubject.asObservable();*/

 

  //muestra la cargando
  public habilitarCargando() {
    this.config.emit(true);
  }

  //desactiva cargando
  public desactivarCargando() {
    this.config.emit(false);
  }


  public enviarNoOportunidad2(NoOportunidad: string) {
    this.config.emit(NoOportunidad);
  }


  enviarOportunidadToListaLlamadaVendendor(oportunidadIDParametro: string, fechaProximaLlamadaParametro: Date) {
/*
    let modelo: parametros = {
      oportunidadID: oportunidadIDParametro,
      fechaProximaLlamada: fechaProximaLlamadaParametro
    };

    this.enviarOportunidadSubject.next(modelo);*/
  }
}
