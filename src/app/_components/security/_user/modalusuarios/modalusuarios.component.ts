import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { grupos } from 'src/app/_models/grupos';
import { responseModel } from 'src/app/_viewModel/responseModel';
import { rolesUsuarios } from 'src/app/_models/rolesUsuarios';
import { DatagrupoService } from 'src/app/_services/datagrupo.service';
import { DatasecurityuserService } from 'src/app/_services/datasecurityuser.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { ComunicacionService } from 'src/app/_utilidades/comunicacion.service';
import { viewModelSecurity } from 'src/app/_viewModel/viewModelSecurity';

@Component({
  selector: 'app-modalusuarios',
  templateUrl: './modalusuarios.component.html',
  styleUrls: ['./modalusuarios.component.css']
})
export class ModalusuariosComponent implements OnInit {

  frmUsuario: FormGroup;
  textBotonGuardar: string = "Guardar";
  listGrupo: grupos[];

  //declarar esta variable para luego describirse y poder liberar recurso
  datosRolesUsuarioSubscription: Subscription;
  submitted = false;

  //en esta variable me indica si el registro del usuario es nuevo o se está editando
  nuevoUsuario: boolean;

  rolesAsignado: number[]=[];

  //esta es la variable que le transfiere el datos ventana rolesusuarios
  // IdUsuario: number;
  //public valorEstadoBotonRolUsuario: boolean

  constructor(
    private serviceSecurityUser: DatasecurityuserService, private serviceGrupo: DatagrupoService,
    public dialogRef: MatDialogRef<ModalusuariosComponent>,
    //@Inject(MAT_DIALOG_DATA) para inyectar los datos del componente que se esta llamando a la ventana modal
    //data: es de tipo DialogData( DialogData es una interface)
    @Inject(MAT_DIALOG_DATA) public data: viewModelSecurity,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private datosComunicacion: ComunicacionService
    ) { 

      
   //(***Idreferencia=EviarDatosModalRolesFunciones***)
    //aqui se esta suscribiendo
    //aqui recibe el datos que envia el componente: app/_components/security/_componentegenerico/rolesfunciones/rolesfunciones
    //se usa servicio
    //(***Idreferencia=EviarDatosModalRolesFunciones***)
    //aqui se esta suscribiendo
    //aqui recibe el datos que envia el componente: app/_components/security/_funciones/rolesfunciones/rolesfunciones
    //se usa servicio
    this.datosRolesUsuarioSubscription=this.datosComunicacion.enviarDatosRolesUsuariosObservable.subscribe((datos: string[])=>{
       
      this.limpiarArreglo();
    
      //comproba si el arreglo tiene datos
      if (datos.length>0){
        for(let item of datos){
          //obtener la posicion del guion
          let indexGuion=item.lastIndexOf("-");
          let nuevoNumero: string="";

          for(let index=indexGuion+1; index < item.length; ++index){
            nuevoNumero=nuevoNumero + item[index];              
          }

          if (Number.isInteger(parseInt(nuevoNumero))){
            this.rolesAsignado.push(parseInt(nuevoNumero));                 
          }
        }
      }      
    });

  }


  ngOnInit(): void {

    console.log('Clave: ', this.data.usuarios.clave);

    //llenar select del grupo
    this.listarGrupo();

    this.submitted = true;
    //cambiar el estado
    this.cambiarEstadoUsuario(this.data.usuarios.nuevoUsuario);

      this.frmUsuario = this.formBuilder.group({
        usuario: [this.data.usuarios.usuario, Validators.required],
        nombre: [this.data.usuarios.nombre, Validators.required],
        correo_Electronico: this.data.usuarios.correo_Electronico,       
        claveCifrada: [this.data.usuarios.claveCifrada, Validators.required],
        confirmarClaveCifrada: [this.data.usuarios.claveCifrada, Validators.required],
        activo: [(this.data.usuarios.activo =='S' ? true: false ), Validators.required],
        grupo: [this.data.usuarios.grupo, Validators.required],       
        fechaCreacion: [this.data.usuarios.createDate, Validators.required],        
    });
  }

  //Para cerrar la venta del modal
  onClose() {
    this.dialogRef.close();
  }

  //vaciar el arreglo
  limpiarArreglo(){
    //en este ciclo vacio el arreglo
    for (let i = this.rolesAsignado.length; i > 0; i--) {
      //vaciar el arreglo
      this.rolesAsignado.pop();
    }
  }

  get f() { return this.frmUsuario.controls }

  //boton guardar de la ventana modal usuario
  onGuardar(){
    
    //validar los textbox
    if(!this.frmUsuario.invalid){

      let dataUsuario: viewModelSecurity = {
        usuarios : {      
          'usuario':  this.f['usuario'].value,
          'nuevoUsuario': this.data.usuarios.nuevoUsuario,
          'nombre': this.f['nombre'].value,
          'tipo': this.data.usuarios.tipo,
          'activo':(this.f['activo'].value ? 'S' : 'N'),
          'req_Cambio_Clave': this.data.usuarios.req_Cambio_Clave,    
          'frecuencia_Clave': this.data.usuarios.frecuencia_Clave,
          'fecha_Ult_Clave': this.data.usuarios.fecha_Ult_Clave,
          'max_Intentos_Conex':  this.data.usuarios.max_Intentos_Conex,
          'clave': this.data.usuarios.clave,
          'correo_Electronico':  this.f['correo_Electronico'].value,
          'tipo_Acceso': this.data.usuarios.tipo_Acceso,
          'noteExistsFlag': this.data.usuarios.noteExistsFlag,
          'recordDate': this.data.usuarios.recordDate,
          'rowPointer': this.data.usuarios.rowPointer,
          'createdBy': this.data.usuarios.createdBy,
          'updatedBy': this.data.usuarios.updatedBy,
          'createDate': this.data.usuarios.createDate,
          'claveCifrada': this.f['claveCifrada'].value,
          'grupo': this.f['grupo'].value,
          'confirmarClaveCifrada': this.f['confirmarClaveCifrada'].value
        },
        rolesUsuarios: []
      };

      
      for (var index=0; index < this.rolesAsignado.length ; index ++){
        var datosd_: rolesUsuarios = {                
          "rolID": this.rolesAsignado[index],
          "usuarioID" :this.f['usuario'].value,            
          "fechaCreacion": this.data.usuarios.fecha_Ult_Clave, 
          "fechaModificacion" : this.data.usuarios.fecha_Ult_Clave
        } 
        //agregar push para agregar un nuevo registro en los arreglos.
        dataUsuario.rolesUsuarios.push(datosd_);        
      }

       //activar el boton Oportunidad
       //this.valorEstadoBotonRolUsuario = false;

      if (this.nuevoUsuario) {
        if (confirm('¿ Estas seguro de guardar los Datos del usuario ?')) {
          this.ServicioGuardar(dataUsuario);
        }
      }
      else if (confirm('¿ Estas seguro de actualizar los datos del usuario ?')) {
        this.ServicioActualizar(dataUsuario);
      }
    }
  }

  //llamar el servicio Guardar
  ServicioGuardar(dataUsuario: viewModelSecurity): void {

    this.serviceSecurityUser.insertUsuario(dataUsuario).subscribe((response: responseModel) => {
      //comprobar si fue exito ==1
      if (response.exito === 1) {
        console.log('aqui vamos');
        //mostrar la notificacion exitoso
        this.notificationService.success('<< ' + response.mensaje + ' >>');
        this.onClose();

      }
      else {

        this.notificationService.warn(response.mensaje);
        
      }
    }, (dataError: HttpErrorResponse) => {
      if (dataError.status == 404) {
        alert(dataError["mensaje"]);
      } else {
        console.log(dataError);
      }

    });
  }


  //actualizar el estado del Usuario
  cambiarEstadoUsuario(isUsuarioNuevo: boolean ) {

    //en esta variable me indica si el registro del Usuario es nuevo o se esta editando
    // o indicar que ya no es nuevo registro
    this.nuevoUsuario = isUsuarioNuevo
    this.data.usuarios.nuevoUsuario = isUsuarioNuevo;
    this.data.usuarios.titulo =(isUsuarioNuevo) ? 'Nuevo usuario': 'Editar registro del usuario';

    //cambiar nombre a la etiqueta
    this.textBotonGuardar = (isUsuarioNuevo) ? "Guardar" : "Actualizar";
  }

  //llamar al servicio actualizar
  ServicioActualizar(dataUsuario: viewModelSecurity): void {

    this.serviceSecurityUser.updateUsuario(dataUsuario.usuarios.usuario, dataUsuario).subscribe((response: responseModel) => {
      //comprobar si fue exito ==1
      if (response.exito === 1) {
        //mostrar la notificacion exitoso
        this.notificationService.success('<< ' + response.mensaje + ' >>');
        this.onClose();
      }
      else {
        this.notificationService.warn(response.mensaje);
      }
    }, (dataError: HttpErrorResponse) => {
      if (dataError.status == 404) {
        alert(dataError["mensaje"]);
      } else {
        console.log(dataError);
      }

    });

  }

  listarGrupo(){
    this.serviceGrupo.getListarGrupo().subscribe((response: responseModel) => {
      //comprobar si fue exito ==1
      if (response.exito === 1) {
        //asignar la lista de Grupo de la base de datos
        this.listGrupo = response.data;
                
      }
      else {

        this.notificationService.warn(response.mensaje);
      }
    }, (dataError: HttpErrorResponse) => {

      if (dataError.status == 404) {
        alert(dataError["mensaje"]);
      } else {
        console.log(dataError);
      }
    });
  }
  

  validarStatuActivo() {
    if ((this.data.usuarios.usuario.length === 0) && (this.f['activo'].value)) {
      //establecer true
      this.frmUsuario.get('activo').patchValue(false);
      this.notificationService.success('<< no puedes cambiar el estatus del campo activo cuando es registro nuevo >>');
    }
  }
}
