import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { facturas } from 'src/app/_models/facturas';
import { responseModel } from 'src/app/_viewModel/responseModel';
import { ComunicacionService } from 'src/app/_utilidades/comunicacion.service';

@Component({
  selector: 'app-listagrid',
  templateUrl: './listagrid.component.html',
  styleUrls: ['./listagrid.component.css']
})
export class ListagridComponent implements OnInit {

  private enviarListFacturacionRef: Subscription = null;
  displayedColumns: string[] = ['factura', 'codigoCliente', 'Cliente', 'totalFactura', 'fecha', 'totalUniddes', 'totalFactura', 'accion'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private serviceComunicacion: ComunicacionService) { }

  ngOnInit(): void {

    //recibe el numero de la oportunidad del componente: _components/vendedores/consultasllamadas/consultas.component.ts
    this.enviarListFacturacionRef = this.serviceComunicacion.enviarListaFacturaObservable$.subscribe((listaFactura: facturas[] ) => {

      this.dataSource.data = listaFactura;

    });
  }

  //este metodo se ejecuta al momento de la visualizacion
  ngAfterViewInit() {
    //this.fech = new Date();    
    /*this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;*/

  }


  
  //Listar las fecha de rango
  onListarClientes(): void {
  }

  //nuevo cliente
  onCrearNuevoClientes() {
    /*
    if (confirm('¿ Estas seguro de crear un nuevo factura ?')) 
    {
      const dateNowToday = new Date();      
      
      let dataClientes: clientes = 
      {
          nuevoCliente: true, clienteID: null, nombreCliente: null, direccion: null, contacto: null, telefonos: null, edad: 0, tipoSexoID: 0, procesado: false,
          email: null, email2: null, email3: null, telefonoHab: null, tipoIdentificacionID: 0, estadoCivilID: 0,
          celular: null, departamentoID: 0, municipioID: 0, sucursalID: 0, ocupacion: null, fax: null, revisado: false, clienteIndeseable: false, personeriaID: 0,
          pep: null, fechaCreacion: this.utilidadService.convertDateHourString(dateNowToday)
      };
      dataClientes.titulo = "Nuevo cliente";
      this.openDialog(dataClientes);
    }*/

  }

  //Metodo para abrir la ventana modal
  /*
  openDialog(dataClientes: clientes): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '980px';
    dialogConfig.data = dataClientes;


    //despues que se cierre la venta modal se ejecuta 
    const dialogRef = this.dialog.open(ModalclientesComponent, dialogConfig);

    //despues que se cierre la venta llama aun suscribirse 
    dialogRef.afterClosed().subscribe(result => {
      this.onListarClientes();

    });

  }*/


  
  //editar la tarjeta del cliente
  onEditarClientes(clienteID: string) {
    /*
    if (confirm('¿ Estas seguro de editar los datos del cliente ?')) {
      
      //llama al servicio
      this.accesoclientes.getDatosClientePorId(clienteID).subscribe((response: responseModel) => {
        //si la respuesta del servidor es 1 es exito
        if (response.exito == 1) {

          const today = new Date();

          let dataCliente: clientes = response.data;
          dataCliente.titulo = 'Editar registro del cliente';
          this.openDialog(dataCliente);
        }
        else {
          this.notificationService.warn(response.mensaje);
        }

      });

    }*/

  }

  onEliminarClientes(clienteID: string) {

  }

}
