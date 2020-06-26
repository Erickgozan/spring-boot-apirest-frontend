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

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    //Retorna al login cuando la sesión haya expirado
    if (this.authService.isAuthenticated()) {
      if (this.isTokenExpiration()) {
        this.router.navigate(["/login"]);
        return false;
      }
      return true;
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
  //Cierra la sesión cuando el token expira
 private isTokenExpiration(): boolean {
    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    } else {
      return false;
    }
  }
}
