import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
  selector: 'app-loginmaterial',
  templateUrl: './loginmaterial.component.html',
  styleUrls: ['./loginmaterial.component.css']
})
export class LoginmaterialComponent implements OnInit {
  flag: boolean = true;
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
      private notificacion: ToastrService
  ) { }

  ngOnInit() {
      this.frmLoginForm = this.formBuilder.group({
          usuario: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
          password: [null, [Validators.required, Validators.minLength(6)]]
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.frmLoginForm.controls; }

  onSubmit(){
    
  }
}
