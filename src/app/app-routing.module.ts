import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';


const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const dashboard =()=> import('./_components/dashboard/dashboard.module').then(x=>x.DashboardModule);

const routes: Routes = [

      //esta es la pagina de inicio, el sistema de obliga que estes auntenticado
     //{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
      
     //s { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
      { path: 'account', loadChildren: accountModule, },
      //menu principal del sistema
      { path: 'dashboard', loadChildren: dashboard, canActivate: [AuthGuard] },
      { path: '**', redirectTo: 'accountModule', pathMatch: 'full' },
    
/*
  //esta ruta es de primero'
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path:'./seg1', component: Seg1Component },
  { path: './seg2', component: Seg2Component },
  { path: 'mainmenu' , component: MainmenuComponent },
  { path: 'login', component: LoginComponent },*/

   // otherwise redirect to home
  //{ path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
