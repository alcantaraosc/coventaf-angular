import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { responseModel } from 'src/app/_viewModel/responseModel';
import { DatasecurityrolesService } from 'src/app/_services/datasecurityroles.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { AppserviceService } from 'src/app/_utilidades/appservice.service';
import { viewModelSecurity } from 'src/app/_viewModel/viewModelSecurity';
import { ModalrolesComponent } from '../modalroles/modalroles.component';

@Component({
  selector: 'app-listasroles',
  templateUrl: './listasroles.component.html',
  styleUrls: ['./listasroles.component.css']
})
export class ListasrolesComponent implements OnInit {

  filtrarPorNombreRol: string;

  displayedColumns: string[] = [
    'rolID',
    'nombreRol',
    'descripcion',
    'activo',
    'accion',
  ];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog, private appService: AppserviceService, private serviceSecurityRoles: DatasecurityrolesService, 
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    //Listar los roles de los usuarios
    this.onlistaRolUsuarios();
  }

  //este metodo se ejecuta al momento de la visualizacion
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onReset() {
      //limpiar el filtro
      this.filtrarPorNombreRol = '';
      //poner el focus en el input de busqueda
      document.getElementById("busquedaRol").focus();
  }


  onRefrescar() {     
    //habilitar cargando
    this.appService.habilitarCargando();
    this.onlistaRolUsuarios();
  }

  //llamar al servicio para listar los roles
  onlistaRolUsuarios() {
    this.serviceSecurityRoles.getListarRol().subscribe(
      (post: any) => {
        this.dataSource.data = post;
        this.appService.desactivarCargando();
      },
      (error: HttpErrorResponse) => {
        this.appService.desactivarCargando();
        this.notificationService.warn(error.message);
      }
    );
  }

  //llamar el servicio para crear un nuevo rol
  onCreateRol() {
    if (confirm('¿ Estas seguro de crear un nuevo rol ?')) {

      const today = new Date();
      let dataRol : viewModelSecurity = {
        roles : {
          "rolID": 0,
          "nombreRol": null,
          "descripcion" : null,
          "activo" : true,
          "fechaCreacion": today,
          "fechaModificacion" : null,
          "titulo": 'Nuevo registro de rol'
        },

        funcionesRoles: []
      };

      this.openDialog(dataRol);
    }
  }

  //llamar al servicio para hacer un filtro por nombre del rol
  getDatosPorFiltro(e, nombre: string) {
    //si la tecla (13 es enter) es enter, entonces realizar la busqueda

    //console.log(nombre);
    if (e.keyCode === 13) {
      if (nombre.length > 0) {
        this.appService.habilitarCargando();
        this.serviceSecurityRoles.getDatosRolesPorNombre(nombre).subscribe((response: responseModel) => {
            this.appService.desactivarCargando();
            //comprobar si el filtro se encontro en la base de datos
            if (response.exito === 1) {
              this.dataSource.data = response.data;
            } else {
              this.dataSource.data = response.data;
              this.notificationService.warn(response.mensaje);
            }
          },
          (error: HttpErrorResponse) => {
            this.appService.desactivarCargando();
            this.notificationService.warn(error.message);
          }
        );
      } else {
        this.notificationService.warn('Digite el nombre del rol para hacer el filtro');
      }
    }
  }

  //Metodo el servicio para editar el registro
  onEditarDatosrol(rolID: number) {
    if (confirm('¿Estas seguro de editar los datos del Rol?')) {
      //llama al servicio
      this.serviceSecurityRoles.getDatosRolPorId(rolID).subscribe((response: responseModel) => {
          
          //si la respuesta del servidor es 1 es exito
          if (response.exito == 1) {
            //const today = new Date();

            //let dataRol: roles = response.data;
            let dataRol: viewModelSecurity = response.data;
            dataRol.roles.titulo = 'Editar los datos del Rol';
            
            this.openDialog(dataRol);
          } else {
            this.notificationService.warn(response.mensaje);
          }
        });
    }
  }

  //llamar el servicio para onEliminarDatosRol
  onEliminarDatosRol(rolID: number) {
    if (confirm('¿Esta seguro de eliminar el registro del Rol?')) {
      this.serviceSecurityRoles.deleteRoles(rolID).subscribe((response: responseModel) => {
          //si exito es 1
          if (response.exito === 1) {
            //mostrar un mesaje de exito
            this.notificationService.success('<< ' + response.mensaje + ' >>');
            //listar los usuarios
            this.onlistaRolUsuarios();
          } else {
            this.notificationService.warn(response.mensaje);
          }
        });
    }
  }

  //Metodo para abrir la ventana modal
  openDialog(dataRol: viewModelSecurity): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = dataRol;

    //dialogRef despues que se cierre la ventana modal se ejecuta
    const dialogRef = this.dialog.open(ModalrolesComponent, dialogConfig);

    //despues que se cierre la venta llama aun suscribirse
    dialogRef.afterClosed().subscribe((result) => {
      this.onlistaRolUsuarios();
    });
  }

}

