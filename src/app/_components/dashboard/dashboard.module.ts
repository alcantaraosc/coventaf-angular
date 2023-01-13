import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FacturacionComponent } from '../puntoDeventa/facturacion/facturacion/facturacion.component';
import { SharedModule } from '../shared/shared.module';
import { EncabezadofacturaComponent } from '../puntoDeventa/facturacion/encabezadofactura/encabezadofactura.component';
import { ListabusquedaComponent } from '../puntoDeventa/componentes/listabusqueda/listabusqueda.component';
import { ListagridComponent } from '../puntoDeventa/componentes/listagrid/listagrid.component';
import { ListafacturacionComponent } from '../puntoDeventa/facturacion/listafacturacion/listafacturacion.component';
import { LoginmaterialComponent } from '../loginmaterial/loginmaterial.component';
import { VentanamodalComponent } from '../puntoDeventa/componentes/ventanamodal/ventanamodal.component';
import { ListausuariosComponent } from '../security/_user/listausuarios/listausuarios.component';
import { ModalusuariosComponent } from '../security/_user/modalusuarios/modalusuarios.component';
import { RolesfuncionesComponent } from '../security/_componente/rolesfunciones/rolesfunciones.component';
import { ListafuncionesComponent } from '../security/_funciones/listafunciones/listafunciones.component';
import { ModalfuncionesComponent } from '../security/_funciones/modalfunciones/modalfunciones.component';
import { ListasrolesComponent } from '../security/_roles/listasroles/listasroles.component';
import { ModalrolesComponent } from '../security/_roles/modalroles/modalroles.component';
import { RolesusuariosComponent } from '../security/_roles/rolesusuarios/rolesusuarios.component';




@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    FacturacionComponent,
    EncabezadofacturaComponent,
    ListabusquedaComponent,
    ListagridComponent,
    ListafacturacionComponent,
    LoginmaterialComponent,
    VentanamodalComponent,
    ListausuariosComponent, 
    ModalusuariosComponent,
    RolesfuncionesComponent,
    ListafuncionesComponent,
    ModalfuncionesComponent,
    ListasrolesComponent,
    ModalrolesComponent,
    RolesusuariosComponent, 
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
    
  ]
})
export class DashboardModule { }
