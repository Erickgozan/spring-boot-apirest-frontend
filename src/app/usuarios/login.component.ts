import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  public titulo:string = "Iniciar sesión";

  public usuario:Usuario;

  constructor(private authService:AuthService, private router:Router) { 

    this.usuario = new Usuario();
  }

  ngOnInit(): void {

    if(this.authService.isAuthenticated()){
      Swal.fire("Login", `Hola ${this.authService.usuario.username} ya estas autenticado! `,'info');
      this.router.navigate(['/clientes']);
    }
  }

  public login():void{
    //Validar el usuario que se ingresa en el formulario
    if(this.usuario.username==null || this.usuario.password == null){
      Swal.fire("Error en el login","El usuario o El password estan vacios","error");
      return;
    }

    this.authService.login(this.usuario).subscribe(response=>{
      //console.log(response); 
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      
      let user= this.authService.usuario;

      this.router.navigate(['/clientes']);
      Swal.fire('Login',`Hola ${user.username} Has iniciado sesión con éxito!`, 'success');
    },
    err => {
      if(err.status===400){
        Swal.fire("Error", "El usuario o la contraseña son incorrectas!","error");
      }
    }
    );
  }

}
