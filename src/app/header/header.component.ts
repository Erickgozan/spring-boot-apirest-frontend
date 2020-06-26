import { Component } from "@angular/core";
import { AuthService } from "../usuarios/auth.service";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  titulo: string = "App Angular";
  private _username:string;

  constructor(private authServie: AuthService, private router:Router) {}

  logOut(): void {
    let username  = this.authServie.usuario.username;
    this.authServie.logout();
    Swal.fire("Logout",`${username} has cerrado sesión con éxito!`,'success');
    this.router.navigate(['/login']);
  }

  mostrarLoginLogOut(): boolean {
    return this.authServie.isAuthenticated();
  }

public get username(){
    this._username = this.authServie.usuario.username;
    return  this._username;
}

}
