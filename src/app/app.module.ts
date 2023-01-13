import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
//import { routing } from "./app.routing";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//angular material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//componentes
import { MainmenuComponent } from './_components/mainmenu/mainmenu.component';


//servicios
import { EnviardatosService } from './_services/enviardatos.service';
import { EventemitService } from './_services/eventemit.service';
import { DatafacturaService } from './_services/datafactura.service';
import { DataloginService } from './_services/datalogin.service';

import { ToastrModule }from 'ngx-toastr';
import { SharedModule } from './_components/shared/shared.module';
import { DashboardModule } from './_components/dashboard/dashboard.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptor } from './guard/jwt.interceptor';

//Date Import
import localePy from '@angular/common/locales/es-NI';
import { registerLocaleData } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { ModalusuariosComponent } from './_components/security/_user/modalusuarios/modalusuarios.component';
import { ListasrolesComponent } from './_components/security/_roles/listasroles/listasroles.component';
import { ModalrolesComponent } from './_components/security/_roles/modalroles/modalroles.component';
import { RolesusuariosComponent } from './_components/security/_roles/rolesusuarios/rolesusuarios.component';
import { ListafuncionesComponent } from './_components/security/_funciones/listafunciones/listafunciones.component';
import { ModalfuncionesComponent } from './_components/security/_funciones/modalfunciones/modalfunciones.component';
import { RolesfuncionesComponent } from './_components/security/_componente/rolesfunciones/rolesfunciones.component';


//es para referirnos al español
registerLocaleData(localePy, 'es')


@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
        
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    //formGroup
    ReactiveFormsModule,
    HttpClientModule,   
    CommonModule, BrowserAnimationsModule,
    SharedModule,
    DashboardModule,
    ToastrModule.forRoot(), // ToastrModule added
    SweetAlert2Module.forRoot(),
    MatDatepickerModule,
  
  
  ],
  providers: [ CookieService,  
    // este es el proveedor de intercepcion JwtInterceptor (ng g interceptor JwtInterceptor)
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }  ,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    //proveedor de fecha de PIPE
    { provide: LOCALE_ID, useValue: 'es' },

  ],
            
  bootstrap: [AppComponent]
})
export class AppModule { }
