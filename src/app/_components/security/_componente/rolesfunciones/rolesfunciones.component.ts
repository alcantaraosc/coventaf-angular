import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { funciones } from 'src/app/_models/funciones';
import { funcionesRoles } from 'src/app/_models/funcionesRoles';
import { responseModel } from 'src/app/_viewModel/responseModel';
import { roles } from 'src/app/_models/roles';
import { rolesUsuarios } from 'src/app/_models/rolesUsuarios';
import { DatasecurityfuncionesService } from 'src/app/_services/datasecurityfunciones.service';
import { DatasecurityrolesService } from 'src/app/_services/datasecurityroles.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { ComunicacionService } from 'src/app/_utilidades/comunicacion.service';

@Component({
  selector: 'app-rolesfunciones',
  templateUrl: './rolesfunciones.component.html',
  styleUrls: ['./rolesfunciones.component.css']
})
export class RolesfuncionesComponent implements OnInit {

  tituloDeLista: string = "";
  tituloAsignado: string = "";
  busquedaRoles: string = "";

  //esta variable es utilizada para recibir el numero de identificacion del cliente que envia el componente modalclientes. 
  @Input() dataRolesFunciones: funcionesRoles[];
  @Input() dataRolesUsuarios: rolesUsuarios[];
  @Input() ventanaDelComponenteaMostrar: string;

  //aqui le estoy pasando informacion del hijo al padre   
  //creamos el evento mediante la clase EventEmitter junto al tipo de dato

  @Output() miEvento = new EventEmitter<string>();

  todalaLista: string[] = [];
  listAsignada: string[] = [];
  //funcionesAsingada:string[]=[];    

  constructor(private serviceSecurityFunciones: DatasecurityfuncionesService, private serviceSecurityRoles: DatasecurityrolesService,
    private notificationService: NotificationService, private serviceComunicacion: ComunicacionService) { }

  ngOnInit(): void {

    //si la ventana modal es funciones
    if (this.ventanaDelComponenteaMostrar === 'roles') {

      //listar todos los roles activos en la base de datos
      this.onListarRoles();
    }
    else if (this.ventanaDelComponenteaMostrar === 'funciones') {
      this.onListarFunciones()
      //this.filterItemsOfArray('an', this.rolesAsignado);
      //console.log(this.filterItems('ap'));
    }

    ///mostrar los roles del usuario
    else if (this.ventanaDelComponenteaMostrar === 'rolesusuarios') {
      this.onListarRolesDelUsuario()
    }
  }


  //evento que se dispara al momento de mover cada 
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }


    //(***Idreferencia=EviarDatosModalRolesFunciones***)
    //enviar el arreglo rolesAsignado[] al componente: [app/_components/security/funciones/modalfunciones/modalfunciones.component] por servicio     
    //se usa servicio

    //(***Idreferencia=EviarDatosModalRolesFunciones***)
    //enviar el arreglo rolesAsignado[] al componente: [app/_components/security/funciones/modalfunciones/modalfunciones.component] por servicio     
    //se usa servicio
    this.serviceComunicacion.EviarDatosModalRolesFunciones(this.listAsignada, this.ventanaDelComponenteaMostrar);
  }

  onEventoEnterBuscarRoles(dato: string) {
    //si el usuario presiona la tecla enter (13 es enter), entonces realizar la busqueda
    console.log(dato);

  }

  BuscarArray() {
    let user; // Por defecto es undefined

    for (let i = 0; i < this.todalaLista.length; i++) {
      const item = this.todalaLista[i];
      if (item.includes('Bauch')) {
        user = item;
        break;
      }
    }
  }

  filterItemsOfArray(query: string, array: string[]) {
    return array.filter(function (el) {
      return el.toUpperCase().indexOf(query.toUpperCase()) > -1;
    });
  }


  //Listar todos los roles
  onListarRoles() {
    //suscribirse 
    this.serviceSecurityRoles.getListarRolActivo(true).subscribe((response: responseModel) => {

      //obtener la lista de roles activos
      let listRoles: roles[];

      if (response.exito === 1) {

        listRoles = response.data;
        //listar todos los roles de la base de datos
        for (var item of listRoles) {
          this.todalaLista.push(item.nombreRol + '-' + item.rolID)
        }

        //luego verificar si existe roles asigandos
        if (this.dataRolesFunciones.length > 0) {
          //muestra los roles asignas
          this.onRolesAsingandos();
          this.onEliminarItemListaRoles();
        }

        this.serviceComunicacion.EviarDatosModalRolesFunciones(this.listAsignada, this.ventanaDelComponenteaMostrar);
      }


    });
  }

  //listar todas las funciones para la ventana modal roles
  onListarFunciones() {
    //suscribirse 
    this.serviceSecurityFunciones.getListarFuncionesActivo(true).subscribe((response: responseModel) => {

      //obtener la lista de roles activos
      let listFunciones: funciones[];

      if (response.exito == 1) {

        this.tituloDeLista = "Lista de Funciones";
        this.tituloAsignado = "Funciones Asignadas";

        listFunciones = response.data;
        //listar todos los roles de la base de datos
        for (var item of listFunciones) {
          this.todalaLista.push(item.nombreFuncion + '-' + item.funcionID)
        }

        //luego verificar si existe roloes asigandos
        if (this.dataRolesFunciones.length > 0) {
          //asignas los roles
          this.onFuncionesAsingandos();
          this.onEliminarItemListaFunciones();
        }

        this.serviceComunicacion.EviarDatosModalRolesFunciones(this.listAsignada, this.ventanaDelComponenteaMostrar);
      }


    });
  }

  //listar todas los roles del usuario para la ventana modal usuario
  onListarRolesDelUsuario() {
    //suscribirse 
    this.serviceSecurityRoles.getListarRolActivo(true).subscribe((response: responseModel) => {

      //obtener la lista de roles activos
      let listRolesDelUsuario: roles[];

      if (response.exito == 1) {

        this.tituloDeLista = "Lista de Roles";
        this.tituloAsignado = "Roles Asignados";

        listRolesDelUsuario = response.data;
        //listar todos los roles de la base de datos
        for (var item of listRolesDelUsuario) {
          this.todalaLista.push(item.nombreRol + '-' + item.rolID);
        }

        //luego verificar si existe roloes asigandos
        if (this.dataRolesUsuarios.length > 0) {
          //asignas los roles
          this.onRolesAsingandosDelUsuario();
          this.onEliminarItemListaRoles();
        }

        this.serviceComunicacion.EviarDatosModalRolesFunciones(this.listAsignada, this.ventanaDelComponenteaMostrar);
      }
    });
  }

  //asignar los roles.
  onRolesAsingandos() {
    for (var item of this.dataRolesFunciones) {
      this.listAsignada.push(item.nombreRol + '-' + item.rolID);
    }
  }

  //asignar los roles.
  onFuncionesAsingandos() {
    for (var item of this.dataRolesFunciones) {
      this.listAsignada.push(item.nombreFuncion + '-' + item.funcionID);
    }
  }


  //Mostrar los roles asignados del usuario
  onRolesAsingandosDelUsuario() {
    for (var item of this.dataRolesUsuarios) {
      this.listAsignada.push(item.nombreRol + '-' + item.rolID);
    }
  }


  //elimina la lista 
  onEliminarItemListaRoles() {
    //crear un arreglo temporal
    let listaRolesTemp: string[] = [];

    //en el siguiente ciclo lo que hago es agregar quitar de la lista los roles que ya estan asignados
    for (var index = 0; index < this.todalaLista.length; ++index) {
      let localizasteRol: boolean = false;

      for (let rows = 0; rows < this.listAsignada.length; ++rows) {

        if (this.todalaLista[index] == this.listAsignada[rows]) {
          localizasteRol = true;
        }
      }
      //comprobar si localizo el rol
      if (!localizasteRol) {
        //agregar un registro al arreglo
        listaRolesTemp.push(this.todalaLista[index]);
      }
    }

    //limpiar el arreglo de todos los roles
    this.todalaLista.splice(0, this.todalaLista.length);
    //asignar la nueva lista de roles
    this.todalaLista = listaRolesTemp;
  }


  //eliminar de la 
  onEliminarItemListaFunciones() {
    //crear un arreglo temporal
    let listaFuncionesTemp: string[] = [];

    //en el siguiente ciclo lo que hago es agregar quitar de la lista los roles que ya estan asignados
    for (var index = 0; index < this.todalaLista.length; ++index) {
      let localizasteRol: boolean = false;

      for (let rows = 0; rows < this.listAsignada.length; ++rows) {

        if (this.todalaLista[index] == this.listAsignada[rows]) {
          localizasteRol = true;
        }
      }
      //comprobar si localizo el rol
      if (!localizasteRol) {
        //agregar un registro al arreglo
        listaFuncionesTemp.push(this.todalaLista[index]);
      }
    }

    //limpiar el arreglo de todas funciones
    this.todalaLista.splice(0, this.todalaLista.length);
    //asignar la nueva lista de las funciones
    this.todalaLista = listaFuncionesTemp;
  }

}

