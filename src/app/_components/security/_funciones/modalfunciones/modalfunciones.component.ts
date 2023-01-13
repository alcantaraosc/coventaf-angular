import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { funcionesRoles } from 'src/app/_models/funcionesRoles';
import { responseModel } from 'src/app/_viewModel/responseModel';
import { DatasecurityfuncionesService } from 'src/app/_services/datasecurityfunciones.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { AppserviceService } from 'src/app/_utilidades/appservice.service';
import { ComunicacionService } from 'src/app/_utilidades/comunicacion.service';
import { viewModelSecurity } from 'src/app/_viewModel/viewModelSecurity';

@Component({
  selector: 'app-modalfunciones',
  templateUrl: './modalfunciones.component.html',
  styleUrls: ['./modalfunciones.component.css']
})
export class ModalfuncionesComponent implements OnInit {

  textBotonGuardar: string="";
  funcionesForm!: FormGroup;
  //declarar esta variable para luego describirse y poder liberar recurso
  datosRolesFuncionesSubscription: Subscription;
  rolesAsignado: number[]=[];
  

  constructor(
    private serviceSecurityFunciones: DatasecurityfuncionesService, private app: AppserviceService,
    public dialogRef: MatDialogRef<ModalfuncionesComponent>,
    //@Inject(MAT_DIALOG_DATA) para inyectar los datos del componente que se esta llamando a la ventana modal
    //data: es de tipo DialogData( DialogData es una interface)
    @Inject(MAT_DIALOG_DATA) public data: viewModelSecurity,
    private formBuilder: FormBuilder, private notificationService: NotificationService,
    private serviceComunicacion: ComunicacionService
  ) { 


    
     //(***Idreferencia=EviarDatosModalRolesFunciones***)
    //aqui se esta suscribiendo
    //aqui recibe el datos que envia el componente: app/_components/security/_funciones/rolesfunciones/rolesfunciones
    //se usa servicio
    this.datosRolesFuncionesSubscription=this.serviceComunicacion.enviarDatosRolesFuncionesObservable.subscribe((datos: string[])=>{
      
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
            this.rolesAsignado.push(parseInt(nuevoNumero));            
          }
        }
      }      
    });

    //this.datosComunicacion.user.subscribe(x => this.user = x);
  }


  ngOnInit(): void {

    this.textBotonGuardar = this.data.funciones.funcionID === 0 ? 'Guardar' : 'Actualizar';

    this.funcionesForm = this.formBuilder.group({
      funcionID: [this.data.funciones.funcionID, Validators.required],
      nombreFuncion: [this.data.funciones.nombreFuncion, Validators.required],
      codigo:[this.data.funciones.codigo, Validators.required],
      descripcion: [this.data.funciones.descripcion, Validators.required],
      activo: [this.data.funciones.activo, Validators.required],
      fechaCreacion: this.data.funciones.fechaCreacion,
      fechaModificacion: this.data.funciones.fechaModificacion,
      funcionesRoles: []  
    });
  }

  get f() { return this.funcionesForm.controls }

  limpiarArreglo(){
      //en este ciclo vacio el arreglo
      for (let i = this.rolesAsignado.length; i > 0; i--) {
        //vaciar el arreglo
        this.rolesAsignado.pop();
      }
  }

  //Guardar los datos de la función
  onGuardar(){ 
    
    if(!this.funcionesForm.invalid){

       let dataFunciones : viewModelSecurity = {
        funciones : {
          "funcionID" : this.f["funcionID"].value,
          "nombreFuncion": this.f["nombreFuncion"].value,
          "codigo" : this.f["codigo"].value,
          "descripcion" : this.f["descripcion"].value,
          "activo" : this.f["activo"].value,
          "fechaCreacion": this.data.funciones.fechaCreacion,
          "fechaModificacion" : this.data.funciones.fechaModificacion      
      },

      funcionesRoles: []
    }; 

    
        
    for (var index=0; index < this.rolesAsignado.length ; index ++){
      var datosd_:funcionesRoles = { 
        funcionID: this.f['funcionID'].value, 
        rolID : this.rolesAsignado[index], 
        fechaCreacion : this.data.funciones.fechaCreacion, 
        fechaModificacion : this.data.funciones.fechaCreacion 
      }
      //agregar push para agregar un nuevo registro en los arreglos.
      dataFunciones.funcionesRoles.push(datosd_);
    }

    /*
    //comprobar si existe registro en funcionesRoles
    if (dataFunciones.funcionesRoles.length==0)
    {
      this.notificationService.warn("Agregue a la lista los tipos de roles");
      return;  
    }*/

  

    if (this.f["funcionID"].value == 0){

      if (confirm('¿ Estas seguro de guardar los datos de la nueva función ?')){
        this.app.habilitarCargando();
        this.ServicioGuardar(dataFunciones);
      }
    }
    else if (confirm('¿ Estas seguro de actualizar los datos de la función ?')){
      this.app.habilitarCargando();
      this.ServicioActualizar(dataFunciones);
    }
    
  
    
      //dataFunciones.funciones.activo.
/*
      dataFunciones.funciones.funcionID=this.f.funcionID.value();
      dataFunciones.funciones.nombreFuncion =this.f.nombreFuncion.value();
      dataFunciones.funciones.codigo = this.f.codigo.value();
      dataFunciones.funciones.descripcion = this.f.descripcion.value();
      dataFunciones.funciones.activo = this.f.activo.value;
      dataFunciones.funciones.fechaCreacion = this.data.funciones.fechaCreacion;
      dataFunciones.funciones.fechaModificacion = this.data.funciones.fechaModificacion; */

  
     // dataFunciones.funcionesRoles;
      
        //"fechaModificacion": this.data.fechaModificacion

      
    }
  }

  //Llamar el servicio de guardar el registro funciones
  ServicioGuardar(dataFunciones: viewModelSecurity):void{
    
    
    //Llamar al servicio para guardar
    this.serviceSecurityFunciones.insertfunciones(dataFunciones).subscribe((response: responseModel) => {

      //si la respuesta del servidor es 1 entonces es exitoso.
      if (response.exito === 1) 
      {
        //mostrar al usuario una notificacion de exitoso.
        this.notificationService.success('<< ' + response.mensaje + ' >>');
         //llamar al metodo (onClose) y cierra la ventana modal
        this.onClose();
      }

      else 
      {
        this.app.desactivarCargando();
        this.notificationService.warn(response.mensaje);
      }

    }, (dataError: HttpErrorResponse) => {

      this.app.desactivarCargando();
      if (dataError.status == 404) 
      {
        this.notificationService.warn(dataError["mensaje"]);    
      } 
      else 
      {
        this.notificationService.warn(dataError["mensaje"]);    
      }

    });
  }

  
  //llamar al servicio actualizar
  ServicioActualizar(dataFunciones: viewModelSecurity): void {

    this.serviceSecurityFunciones.updateFunciones(dataFunciones.funciones.funcionID, dataFunciones).subscribe((response: responseModel) => {
      if (response.exito === 1) {
        this.notificationService.success('<< ' + response.mensaje + ' >>');
        //llamar al metodo (onClose) y cierra la ventana modal
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

  //validar el estatus del activo
  validarStatuActivo() {
    if ((this.data.funciones.funcionID === 0) && (this.f["activo"].value)) {
      //establecer true
      this.funcionesForm.get('activo').patchValue(false);
      this.notificationService.success('<< no puedes cambiar el estatus del campo activo cuando es registro nuevo >>');
    }
  }

  //cerrar la venta modal
  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
     this.datosRolesFuncionesSubscription.unsubscribe();
  }

}
