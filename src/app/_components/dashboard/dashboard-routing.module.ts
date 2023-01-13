import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/account/login.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { HomeComponent } from 'src/app/home';
import { LoginmaterialComponent } from '../loginmaterial/loginmaterial.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FacturacionComponent } from '../puntoDeventa/facturacion/facturacion/facturacion.component';
import { ListafacturacionComponent } from '../puntoDeventa/facturacion/listafacturacion/listafacturacion.component';
import { ListasrolesComponent } from '../security/_roles/listasroles/listasroles.component';
import { ListausuariosComponent } from '../security/_user/listausuarios/listausuarios.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [

  {
    path: '', component: DashboardComponent,
    children: [

        { path: '', component: HomeComponent, canActivate: [AuthGuard] },        
        { path:'punto-venta/lista-facturacion', component: ListafacturacionComponent, canActivate: [AuthGuard] },
        { path:'loginmaterial', component: LoginmaterialComponent, canActivate: [AuthGuard] },
        { path: 'seguridad/listar-usuario', component: ListausuariosComponent, canActivate: [AuthGuard] },
        { path: 'seguridad/listar-roles', component: ListasrolesComponent , canActivate: [AuthGuard] }
       
        //{ path: 'register', component: RegisterComponent }
    ]
}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
