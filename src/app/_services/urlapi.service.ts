import { Injectable } from '@angular/core';

//url de la API
const api_url: string='https://localhost:44383'

@Injectable({
  providedIn: 'root'
})
export class UrlapiService {

  constructor() { }

  //obtener la url de la api
  getUrlApi(): string {
    return api_url;
  }
}
