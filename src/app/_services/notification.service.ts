import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public _snackBar: MatSnackBar) { }
  
  config :  MatSnackBarConfig ={
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
    //panelClass: ["background-color: tomato;"]
  }


  success(msg) {
    this.config['panelClass'] = ['notification', 'success'];
    this._snackBar.open(msg, 'cerrar', this.config);
  }

  warn(msg) {
    this.config['panelClass'] = ['notification', 'warn'];
    this._snackBar.open(msg, 'cerrar', this.config);
  }
}
