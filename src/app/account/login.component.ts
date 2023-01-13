import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService  } from '../_services/account.service';
import { AlertService } from '../_services/alert.service';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { responseModel } from '../_viewModel/responseModel';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../_services/notification.service';

//import { AccountService, AlertService } from '@app/_services';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })

//@Component({ templateUrl: 'login.component.html' })

export class LoginComponent implements OnInit {
    logo = './assets/img/login-1200x400.png';
    frmLoginForm: FormGroup    
    loading = false;
    submitted = false;
  
    user: User;
    
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private notificacion: ToastrService,
        private notificationService: NotificationService, 
    ) { }
  
    ngOnInit() {
        this.frmLoginForm = this.formBuilder.group({
            usuario: ['', Validators.required],
            password: ['', Validators.required]
        });
    }
  
    // convenience getter for easy access to form fields
    get f() { return this.frmLoginForm.controls; }
  
    onSubmit2() {       
        this.submitted = true;
  
        // reset alerts on submit
        this.alertService.error("");
  
       //validar el nombre del usuario y contraseña
      /*if (this.frmLoginForm.get('username') == null  && this.frmLoginForm.get('password')===null){
          this.notificacion.warning('Error Login', 'Username or password esta vacias');
          return;
      }*/
  
        // stop here if form is invalid
        if (this.frmLoginForm.invalid) {
          this.notificacion.error('Error Login', 'Debes de ingresar usuario y contraseña');
          return;
        }
  
      
        this.accountService.login2(this.f['usuario'].value, this.f['password'].value)
            .pipe(first())
            .subscribe({
                next: (user: User) => {

                    
                    
                  //this.router.navigateByUrl('/');
                    //window.location.reload();                    
                    // get return url from query parameters or default to home page
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';     
                    this.router.navigateByUrl(returnUrl);                 
                    //this.router.navigateByUrl('dashboard');                
                },

                error: (error: HttpErrorResponse) => {
                    this.notificacion.error(error.message);
                    console.log(error);
                    this.frmLoginForm.reset();                                                                           
                    this.loading = false;
                }
            });   
    }

    onSubmit() {       
        this.submitted = true;
  
        // reset alerts on submit
        this.alertService.error("");
  
       //validar el nombre del usuario y contraseña
      /*if (this.frmLoginForm.get('username') == null  && this.frmLoginForm.get('password')===null){
          this.notificacion.warning('Error Login', 'Username or password esta vacias');
          return;
      }*/
  
        // stop here if form is invalid
        if (this.frmLoginForm.invalid) {
          this.notificacion.error('Error Login', 'Debes de ingresar usuario y contraseña');
          return;
        }
       
        this.accountService.logIn(this.f['usuario'].value, this.f['password'].value)            
            .subscribe((response) =>{
                //asignar los datos que retorna el servidor
                var user = response.data;

                if (response.exito == 1){
                    console.log('login')
                    //this.router.navigateByUrl('/');
                    //window.location.reload();                    
                    // get return url from query parameters or default to home page
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';     
                    this.router.navigateByUrl(returnUrl);                 
                    //this.router.navigateByUrl('dashboard'); 
                }
                else {
                    
                    //comprobar si establecer el focus
                    if (response.setFocus){ 

                        switch (response.nombreInput){
                            case 'usuario': 
                                this.f['usuario'].setValue("");
                                this.f['password'].setValue("");
                                break;         
                                               
                            case 'password': this.f['password'].setValue("");
                                break;                           
                        }
                         
                        let input=document.getElementById(response.nombreInput) as HTMLInputElement;
                        input.focus();
                    }
                    
                    this.notificationService.warn(response.mensaje);                                                       
                }              
            });   
    }
  }