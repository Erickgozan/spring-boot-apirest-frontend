import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {


  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

      //Si el usuario no esta autenticado retorna al login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"]);
      return false;
    }

    //Denegar el acceso a usuarios no permitidos
    let role: string = next.data["role"] as string;
    if (this.authService.hasRole(role)) {
      return true;
    } else {
      this.router.navigate(["/clientes"]);
      Swal.fire(
        "Acceso denegado",
        `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`,
        "warning"
      );
      return false;
    }
  }
}
