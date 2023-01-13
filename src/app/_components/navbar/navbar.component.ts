import { Component, OnInit } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { AppserviceService } from 'src/app/_utilidades/appservice.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = 'COVENTAF';
  loading: boolean = false;
  user : User;
  
 
  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];
  
  constructor(private accountService: AccountService, private appService: AppserviceService ){
    this.user = this.accountService.userValue;

     //aqui se subscribe para cargar
    /* this.appService.config.subscribe(config => {
      setTimeout(() => {
        this.loading = config
      }, 50);
    });*/

  }

  ngOnInit(): void {    
  }


  logout(event) {

    event.preventDefault();
      
    let usuario = this.user.usuario;
    //user = JSON.parse(localStorage.getItem('user').toString());

    /*
    if (confirm('¿ Estas seguro de cerrar la sesion del usuario ' + usuario.username + ' ?')){
       //eliminar el registro del usuario    
       this.accountService.logout();
    }*/
    
    Swal.fire({
      title: '¿ Estas seguro de cerrar la sesion del usuario ' + this.user.usuario + ' ?',
      text: "-",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {                   
          //cerrar la sesion
          this.accountService.logout();      
      }
    });

  }

  openNav(event) {
    event.preventDefault();

    document.getElementById("myNav").style.width = "100%";
  }
  
  closeNav(event) {
    event.preventDefault();
    
    document.getElementById("myNav").style.width = "0%";
  }
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

/*
<script>

  // Muestra SideBar
  $('button').on('click', function() {
    $(".container").toggleClass('show');
  })

  // Oculta SideBar
  $('.side-hide').on('click', function() {
    $(".container").toggleClass('show');
  });
</script>*/