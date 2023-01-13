import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { funcionesRoles } from 'src/app/_models/funcionesRoles';
import { responseModel } from 'src/app/_viewModel/responseModel';
import { DatasecurityrolesService } from 'src/app/_services/datasecurityroles.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { AppserviceService } from 'src/app/_utilidades/appservice.service';
import { ComunicacionService } from 'src/app/_utilidades/comunicacion.service';
import { viewModelSecurity } from 'src/app/_viewModel/viewModelSecurity';

@Component({
  selector: 'app-modalroles',
  templateUrl: './modalroles.component.html',
  styleUrls: ['./modalroles.component.css']
})
export class ModalrolesComponent implements OnInit {

  rolesForm: FormGroup;
  textBotonGuardar: string;
  //declarar esta variable para luego describirse y poder liberar recurso
  datosRolesFuncionesSubscriptionRoles: Subscription;
  funcionesAsignado: number[]=[];

  constructor(
    private serviceSecurityRoles: DatasecurityrolesService, private app: AppserviceService,
    public dialogRef: MatDialogRef<ModalrolesComponent>,
    //@Inject(MAT_DIALOG_DATA) para inyectar los datos del componente que se esta llamando a la ventana modal
    //data: es de tipo DialogData( DialogData es una interface)
    @Inject(MAT_DIALOG_DATA) public data: viewModelSecurity ,
    private formBuilder: FormBuilder, private notificationService: NotificationService, private datosComunicacion: ComunicacionService
  ) { 

    
     //(***Idreferencia=EviarDatosModalRolesFunciones***)
    //aqui se esta suscribiendo
    //aqui recibe el datos que envia el componente: app/_components/security/_componentegenerico/rolesfunciones/rolesfunciones
    //se usa servicio
    //(***Idreferencia=EviarDatosModalRolesFunciones***)
    //aqui se esta suscribiendo
    //aqui recibe el datos que envia el componente: app/_components/security/_funciones/rolesfunciones/rolesfunciones
    //se usa servicio
    this.datosRolesFuncionesSubscriptionRoles=this.datosComunicacion.enviarDatosRolesFuncionesObservableRoles.subscribe((datos: string[])=>{
    
        this.limpiarArreglo();
      
        //comproba si el arreglo tiene datos
        if (datos.length>0)
        {
          for(let item of datos)
          {
            //obtener la posicion del guion
            let indexGuion=item.lastIndexOf("-");
            let nuevoNumero: string="";

            for(let index=indexGuion+1; index < item.length; ++index)
            {
              nuevoNumero=nuevoNumero + item[index];              
            }

            if (Number.isInteger(parseInt(nuevoNumero)))
            {
              this.funcionesAsignado.push(parseInt(nuevoNumero));            
            }
          }
        }      
    });
  }

  ngOnInit(): void {

    this.textBotonGuardar = this.data.roles.rolID === 0 ? 'Guardar' : 'Actualizar';

    this.rolesForm = this.formBuilder.group({
      rolID: [this.data.roles.rolID, Validators.required],
      nombreRol: [this.data.roles.nombreRol, Validators.required],
      descripcion: [this.data.roles.descripcion, Validators.required],
      activo: [this.data.roles.activo, Validators.required],
      fechaCreacion: this.data.roles.fechaCreacion,
      fechaModificacion: this.data.roles.fechaModificacion,
      //funcionesRoles:[]

    });

    console.log(this.data);   
  }

  //Para cerrar la ventana del modal
  onClose() {
    this.dialogRef.close();
  }

  limpiarArreglo(){
    //en este ciclo vacio el arreglo
    for (let i = this.funcionesAsignado.length; i > 0; i--) {
      //vaciar el arreglo
      this.funcionesAsignado.pop();
    }
  }


  get f() { return this.rolesForm.controls }

  //metodo para poder guardar el registro roles
  onGuardar(){
    if(!this.rolesForm.invalid){
               
      let dataRoles : viewModelSecurity= { 
        roles: {
          "rolID": this.f['rolID'].value,
          "nombreRol": this.f['nombreRol'].value,
          "descripcion": this.f['descripcion'].value,
          "activo": this.f['activo'].value,
          "fechaCreacion": this.data.roles.fechaCreacion,
          "fechaModificacion": this.data.roles.fechaModificacion
        },

        funcionesRoles: []
      };

      for (var index=0; index < this.funcionesAsignado.length ; index ++){
        var datosd_:funcionesRoles = {
          rolID: this.f['rolID'].value, 
          funcionID : this.funcionesAsignado[index], 
          fechaCreacion : this.data.roles.fechaCreacion, 
          fechaModificacion : this.data.roles.fechaModificacion 
        } 
        //agregar push para agregar un nuevo registro en los arreglos.
        dataRoles.funcionesRoles.push(datosd_);
      }

      if (this.f['rolID'].value == 0)
      {
        if (confirm('¿Estas seguro de guardar los datos del nuevo rol?')){
          this.app.habilitarCargando();
          this.ServicioGuardar(dataRoles);
        }
      }
      else if (confirm('¿Estas seguro de actualizar los datos del rol?')){
        this.app.habilitarCargando();
        this.ServicioActualizar(dataRoles);
      }

    }
  }

  //Llamar el servicio de guardar
  ServicioGuardar(dataRoles: viewModelSecurity ):void {

    //Llamar al servicio para guardar
    this.serviceSecurityRoles.insertRol(dataRoles).subscribe((response: responseModel) => {

      if (response.exito === 1)
      {
        this.notificationService.success('<< ' + response.mensaje + ' >>');
        this.onClose()
      }
      else 
      {
        this.app.desactivarCargando();
        this.notificationService.warn(response.mensaje);
      }

    }, (dataError: HttpErrorResponse) => {

      this.app.desactivarCargando();
      if (dataError.status == 404) {

        alert(dataError["mensaje"]);
      } else {

        console.log(dataError);
      }

    });

  }

  //llamar al servicio actualizar
  ServicioActualizar(dataRol: viewModelSecurity): void 
  {

    this.serviceSecurityRoles.updateRoles(dataRol.roles.rolID, dataRol).subscribe((response: any) => {
      if (response.exito === 1) {
        this.notificationService.success('<< ' + response.mensaje + ' >>');
        this.onClose();
      }
      else {
        this.app.desactivarCargando();
        this.notificationService.warn(response.mensaje);
      }
    }, (dataError: HttpErrorResponse) => {
      this.app.desactivarCargando();
      if (dataError.status == 404) {
        alert(dataError["mensaje"]);
      } else {
        console.log(dataError);
      }
    });
  }

  //Validar el status activo
  validarStatuActivo() {
    if ((this.data.roles.rolID === 0) && (this.f['activo'].value)) {
      //establecer true
      this.rolesForm.get('activo').patchValue(false);
      this.notificationService.success('<< no puedes cambiar el estatus del campo activo cuando es registro nuevo >>');
    }
  }

}

