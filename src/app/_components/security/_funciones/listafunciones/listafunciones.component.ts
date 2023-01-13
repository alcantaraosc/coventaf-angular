import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { responseModel } from 'src/app/_viewModel/responseModel';
import { DatasecurityfuncionesService } from 'src/app/_services/datasecurityfunciones.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { AppserviceService } from 'src/app/_utilidades/appservice.service';
import { viewModelSecurity } from 'src/app/_viewModel/viewModelSecurity';
import { ModalfuncionesComponent } from '../modalfunciones/modalfunciones.component';

@Component({
  selector: 'app-listafunciones',
  templateUrl: './listafunciones.component.html',
  styleUrls: ['./listafunciones.component.css']
})
export class ListafuncionesComponent implements OnInit {

  filtrarPorNombreFunciones: string;

  displayedColumns: string[] = ['funcionID', 'nombreFuncion', 'codigo', 'descripcion', 'activo', 'accion' ];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

   
  constructor(private serviceSeurityFunciones: DatasecurityfuncionesService, private dialog: MatDialog,
    private notificationService: NotificationService, private appService: AppserviceService
  ) {}

  ngOnInit(): void {
    this.onListarFunciones();
  }

  //este metodo se ejecuta al momento de la visualizacion
  ngAfterViewInit() {    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //metodo para resetear
  onReset() {
    //Limpiar el filtro
    this.filtrarPorNombreFunciones = '';
    //poner el focus en el buscador del input 
    document.getElementById("buscarFunciones").focus();

  }

  onRefrescar() {
   
    this.onListarFunciones();
  }

  //llamar al servicio para listar todas las funciones
  onListarFunciones() 
  {
     //habilitar la ruedita cargando
     this.appService.habilitarCargando();

    this.serviceSeurityFunciones.getListarFunciones().subscribe((post: any) => {
        this.dataSource.data = post;
        this.appService.desactivarCargando();
      },
      (error: HttpErrorResponse) => {
        this.appService.desactivarCargando();
        console.log(error.message);
        this.notificationService.warn(error.message);
        
      }
    );
  }

  //Crear una nueva funciones
  onCreateFunciones() {

    if (confirm('¿ Estas seguro de crear una nueva función ?')) {
     //obtener la fecha de hoy
      const today = new Date();

      let dataFunciones : viewModelSecurity = {
        funciones : {
          "funcionID" : 0,
          "nombreFuncion": null,
          "codigo" : null,
          "descripcion" : null,
          "activo" : true,
          "fechaCreacion": today,
          "fechaModificacion" : null,
          "titulo": 'Nuevo registro de funciones'
        },

        funcionesRoles: []
      };
     
      this.openDialog(dataFunciones);
    }
  }

  //método para editar los datos de las funciones
  onEditarDatosFunciones(funcionesID: number) {
    if (confirm('¿ Estas seguro de editar el registro de la funcion ?')) {
      //llama al servicio getDatoFuncionesPorId
      this.serviceSeurityFunciones.getDatoFuncionesPorId(funcionesID).subscribe((response: responseModel) => {
         
          //si la respuesta del servidor es 1 entonces significa que fue exitoso.
          if (response.exito === 1) {
            //asignar el registro que viene del servidor
            let dataSecurity: viewModelSecurity = response.data;
            dataSecurity.funciones.titulo = 'Editar el registro de la funcion';
            //llamar al metodo para abrir la ventana modal.
            this.openDialog(dataSecurity);
          } else {
            this.notificationService.warn(response.mensaje);
          }
        });
    }
  }

  //metodo para eliminar el registro funciones
  onEliminarDatosFunciones(funcionesID: number) {

    if (confirm('¿ Esta seguro de eliminar el registro funciones numero ' + funcionesID.toString() + ' ?')) {
      this.serviceSeurityFunciones
        .deleteFunciones(funcionesID)
        .subscribe((response: responseModel) => {
          //si exito es 1
          if (response.exito === 1) {
            //mostrar un mesaje de exito
            this.notificationService.success('<< ' + response.mensaje + ' >>');
            //listar sucursales
            this.onListarFunciones();
          } else {
            this.notificationService.warn(response.mensaje);
          }
        });
    }
  }

  //llamar al servicio para hacer un filtro por nombre de la función
  getDatosPorFiltro(e, nombrefunciones: string) {

    //si la tecla (13 es enter) es enter, entonces realizar la busqueda
    if (e.keyCode === 13) {
      if (nombrefunciones.length > 0) {
        //habilitar la ruedita cargando
        this.appService.habilitarCargando();
        this.serviceSeurityFunciones.getDatosFuncionesPorNombre(nombrefunciones).subscribe((response: responseModel) => {
              //habilitar 
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
               //Deshabilitar la ruedita cargando
              this.appService.desactivarCargando();
              this.notificationService.warn(error.message);
            }
          );
      } else {
        this.notificationService.warn('Digite el nombre de la función  para hacer el filtro');
      }
    }
  }

  //Metodo para abrir la ventana modal
  openDialog(dataFunciones: viewModelSecurity): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '850px';
    //dialogConfig.height='480px';        
    dialogConfig.data = dataFunciones;

    
    //llamar la ventana modal ModalfuncionesComponent
    const dialogRef = this.dialog.open(ModalfuncionesComponent, dialogConfig);

    //la constante dialogRef despues que se cierre la ventana modal llama a subscribirse
    //despues que se cierre la venta modal llama suscribirse
    dialogRef.afterClosed().subscribe((result) => {
      this.onListarFunciones();
    });

    

    
  }

  ngOnDestroy() {
    //this.dialogRef.unsubscribe();
  }

}

