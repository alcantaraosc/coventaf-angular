import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { responseModel } from 'src/app/_viewModel/responseModel';
import { DatasecurityuserService } from 'src/app/_services/datasecurityuser.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { AppserviceService } from 'src/app/_utilidades/appservice.service';
import { viewModelSecurity } from 'src/app/_viewModel/viewModelSecurity';
import { ModalusuariosComponent } from '../modalusuarios/modalusuarios.component';


@Component({
  selector: 'app-listausuarios',
  templateUrl: './listausuarios.component.html',
  styleUrls: ['./listausuarios.component.css']
})
export class ListausuariosComponent implements OnInit {

  filtrarPorNombreUsuario: string;
  loading:boolean=false;

  displayedColumns: string[] = ['usuario', 'nombre', 'activo', 'accion'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private serviceSecurityUser: DatasecurityuserService,
    private notificationService: NotificationService, private emitirDatosService: AppserviceService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    //llamar al método Listar los usuarios existentes
    this.listarUsuario();
  }

  //Este método se ejecuta al momento de la visualización
  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

 //Listar los usuarios existentes
  listarUsuario()  {

     //habilitar cargando
     this.emitirDatosService.habilitarCargando();

    this.serviceSecurityUser.getListadoUsuario().subscribe((response: responseModel)=>{
      
      this.dataSource.data = response.data;     
      //Dehabilitar cargando
      this.emitirDatosService.desactivarCargando();

    }, (error: HttpErrorResponse)=>{
      //Dehabilitar cargando
      this.emitirDatosService.desactivarCargando();
      this.notificationService.warn(error.message);
    });
    
  }


  onReset(){
    //limpiar el filtro
    this.filtrarPorNombreUsuario = "";
    document.getElementById("buscarUsuario").focus();
  }

  onRefrescar(){
    //habilitar cargando
    this.emitirDatosService.habilitarCargando();
    this.listarUsuario();
  }

  //crear nuevo usuario
  onCreateNuevoUsuario(){

    if (confirm('¿Estas seguro de crear un nuevo usuario ?')){

      let today = new Date();

      let dataUsuario : viewModelSecurity = {
        usuarios : {
          nuevoUsuario: true,           
          usuario: null, 
          nombre: null,   
          tipo: 'U',   
          activo: "S",  
          req_Cambio_Clave: 'N',
          frecuencia_Clave: 0,
          fecha_Ult_Clave: today,
          max_Intentos_Conex: 5,
          clave: 'sinclave',
          correo_Electronico: null, 
          tipo_Acceso: 'C',
          noteExistsFlag: 0,
          recordDate: today,
          rowPointer:'53C9F06E-6AFE-4766-A14B-F2152479E96F',
          createdBy: 'usuario',
          updatedBy: 'usuario',
          createDate: today,
          claveCifrada: null,  
          grupo: null,   
          titulo: 'Nuevo Usuario'
        },

        rolesUsuarios: []
      };   
          
      this.openDialog(dataUsuario);
    }

  }

 //llamar al servicio para hacer un filtro por nombre del usuario
  getDatosPorFiltro(e, nombreUsuario: string){

     //si la tecla (13 es enter) es enter, entonces realizar la busqueda
    //console.log(nombre);
    if (e.keyCode === 13) {
      if (nombreUsuario.length > 0) {
        this.emitirDatosService.habilitarCargando();
        this.serviceSecurityUser.getDatosUsuarioPorNombre(nombreUsuario).subscribe(
            (response: responseModel) => {
              this.emitirDatosService.desactivarCargando();
              //comprobar si el filtro se encontro en la base de datos
              if (response.exito === 1) {
                this.dataSource.data = response.data;
              } else {
                this.dataSource.data = response.data;
                this.notificationService.warn(response.mensaje);
              }
            },
            (error: HttpErrorResponse) => {
              this.emitirDatosService.desactivarCargando();
              this.notificationService.warn(error.message);
            }
          );
      } else {
        this.notificationService.warn('Digite el usuario o nombre para hacer el filtro');
      }
    }

  }

  //editar los datos del usuario
  onEditarDatosUsuario(usuarioID: string) {

    if (confirm('¿ Estas seguro de editar los datos del usuario ?')) {

      //llama al servicio
      this.serviceSecurityUser.getDatosUsuarioPorId(usuarioID).subscribe((response: responseModel) => { 
        
               
        //si la respuesta del servidor es 1 es exito
        if (response.exito == 1) {      
          
          //const today = new Date();
          let dataUser: viewModelSecurity = response.data;
         console.log(dataUser);
          dataUser.usuarios.titulo = 'Editar registro del usuario';
          this.openDialog(dataUser);
        }
        else {
          this.notificationService.warn(response.mensaje);
        }

      },


      );

    }

  }

  //eliminar el registro del usuario
  onEliminarDatosUsuario(usuarioID: string){

    if (confirm('¿ Estas seguro de eliminar los datos del usuario ?')){

      this.serviceSecurityUser.deleteUsuario(usuarioID).subscribe((response: responseModel)=>{
        //si exito es 1
        if (response.exito === 1){
          //mostrar un mesaje de exito
          this.notificationService.success('<< ' + response.mensaje + ' >>');
          //listar todos los usuarios
          this.listarUsuario();

        }
        else {
          this.notificationService.warn(response.mensaje);
        }
      });

    }

  }

  //Metodo para abrir la ventana modal
  openDialog(dataUsuario: viewModelSecurity): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = dataUsuario;


    //despues que se cierre la venta modal se ejecuta
    const dialogRef = this.dialog.open(ModalusuariosComponent, dialogConfig);

    //despues que se cierre la ventana,  llama aun suscribirse
    dialogRef.afterClosed().subscribe(result => {
      this.listarUsuario();

    });

  }

}
