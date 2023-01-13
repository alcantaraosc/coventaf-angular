import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { roles } from 'src/app/_models/roles';

@Component({
  selector: 'app-rolesusuarios',
  templateUrl: './rolesusuarios.component.html',
  styleUrls: ['./rolesusuarios.component.css']
})
export class RolesusuariosComponent implements OnInit {

/*
  frmRolUsuario: FormGroup;
  textBotonAplicar: string = "Aplicar";*/




    //esta variable es utilizada para recibir el ID del usuario que envia el componente modalUsuarios.
  @Input() IdUsuario: string;
  @Input() estadoBotonNuevoRolUsuario: boolean;
  @Input() estadoBotonNuevoRol: boolean;

  constructor(
    //@Inject(MAT_DIALOG_DATA) para inyectar los datos del componente que se esta llamando a la ventana modal
    //data: es de tipo DialogData( DialogData es una interface)
    @Inject(MAT_DIALOG_DATA) public dataRoles: roles,

    private formBuilder: FormBuilder

  ) { }

  ngOnInit(): void {


   /* this.frmRolUsuario = this.formBuilder.group({


      rolID: [this.dataRoles.rolID,Validators.required],

      //clienteID: [this.data.clienteID, Validators.required],



    });*/




  }



  onCrearNuevaRol()
  {


  }


 /* onAplicar(cerrarVentanaModal: boolean){

  }*/

}
