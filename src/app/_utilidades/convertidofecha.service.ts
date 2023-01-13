import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertidofechaService {

  constructor() { }
  

  //convertir a fecha 
  public convertDateHourString(fechaHora: Date): string
  {
    let strDateHour: string;
    try
    {
        strDateHour=fechaHora.getFullYear() + "-" + this.agregarZeroIzquierda((fechaHora.getMonth() + 1).toString()) + "-" + this.agregarZeroIzquierda(fechaHora.getDate().toString()) + 
        "T"+ fechaHora.getHours() + ":" + this.agregarZeroIzquierda(fechaHora.getMinutes().toString()) + ":" + this.agregarZeroIzquierda(fechaHora.getSeconds().toString()) +".000Z";
    }
    catch (e:any)
    {
      strDateHour="";
    }

    return strDateHour;
  }

  //convertir fecha a string
  public convertDateString(fecha: Date): string 
  {
    let strDate: string
    
    try
    {
        strDate=fecha.getFullYear() + "-" + this.agregarZeroIzquierda((fecha.getMonth()+1).toString()) + "-" + this.agregarZeroIzquierda(fecha.getDate().toString());
    }
    catch (e:any)
    {
      strDate="";
    }    
    return strDate;
  }

  //agregar un cero a la izquierda.
  private agregarZeroIzquierda(elemento: string){
    
    //comprobar si el rango esta entre 0-9 entonces se procede agregar un cero a la izquierda.
    if (parseInt(elemento)>0 && parseInt(elemento)<=9)
      elemento='0'+ elemento;

    return elemento;
  }
}

