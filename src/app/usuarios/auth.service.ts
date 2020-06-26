import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Usuario } from "./usuario";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) {}

  //Obtener el token completo del servidor para iniciar sesión
  public login(usuario: Usuario): Observable<any> {
    const urlEndPoint = "http://localhost:8080/oauth/token";
    const credenciales = btoa("angularapp" + ":" + "12345"); //Codifica una cadena a base 64

    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + credenciales,
    });

    let params = new HttpParams()
      .set("grant_type", "password")
      .set("username", usuario.username)
      .set("password", usuario.password);

    //console.log(params.toString());
    return this.http.post<any>(urlEndPoint, params.toString(), {
      headers: httpHeaders,
    });
  }

  //Retorna el usuario que esta almacenado en el sessionStorage
  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (
      this._usuario == null &&
      sessionStorage.getItem("usuario") != null
    ) {
      this._usuario = JSON.parse(sessionStorage.getItem("usuario")) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  //Retorna el token que esta almacenado en el sessionStorage
  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem("token") != null) {
      this._token = sessionStorage.getItem("token");
      return this._token;
    }
    return null;
  }

  //Guarda el token en el sessionStorage
  public guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem("token", accessToken);
  }

  //Obtener el payload(cuerpo) del token
  public obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      /**
       * JSON.parse: convierte un objeto a un json
       * atob: decodifica el una cadena de datos que esta en base 64
       * split: divide un arreglo con el caracter indicado en el parametro
       */
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  //Guarda el usuario en el sessionStorage
  public guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem("usuario", JSON.stringify(this._usuario));
  }

  //Comprobar que el usuario esta autenticado
  public isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  //Cerrar sesión
  public logout(): void {
    this._usuario = null;
    this._token = null;
    sessionStorage.clear(); //Borrar el sessionStorage completo
    //sessionStorage.removeItem("usuario"); //Borrar solo el usuario
    //sessionStorage.removeItem("token"); //Borrar solo el token
  }

  //Coprobar los roles que tiene el usuario
  public hasRole(role: string): boolean {
    //Verificar que el usuario incluye algun role
    if (this.usuario.roles.includes(role)) {
      return true;
    } else {
      return false;
    }
  }
}
