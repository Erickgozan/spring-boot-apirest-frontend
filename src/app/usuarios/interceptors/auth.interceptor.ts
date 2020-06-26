import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";

import { Observable } from "rxjs";
import { AuthService } from "../auth.service";

/** Clase que sirve para interceptar las urls y saber si tienen la autorizacion en sus cabeceras */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    let token = this.authService.token;
    if (token != null) {
      const authReq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token),
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
