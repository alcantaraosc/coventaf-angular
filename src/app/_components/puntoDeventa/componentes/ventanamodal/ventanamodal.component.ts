import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { facturas } from 'src/app/_models/facturas';

@Component({
  selector: 'app-ventanamodal',
  templateUrl: './ventanamodal.component.html',
  styleUrls: ['./ventanamodal.component.css']
})
export class VentanamodalComponent implements OnInit {

  constructor(//hace referencia al ventana modal abierta
  public dialogRef: MatDialogRef<VentanamodalComponent>,
  //@Inject(MAT_DIALOG_DATA) para inyectar los datos del componente que se esta llamando a la ventana modal
  //data: es de tipo DialogData( DialogData es una interface)
  @Inject(MAT_DIALOG_DATA) public data: string,) { }

  ngOnInit(): void {
  }

}
