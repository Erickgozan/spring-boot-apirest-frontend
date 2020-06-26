//Componentes de Angular y externos
import { Injectable, EventEmitter } from "@angular/core";
import { Observable, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpEvent,
} from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { formatDate } from "@angular/common";

//Componentes propios
import { Cliente } from "./cliente";
import { Region } from "./region";
import { AuthService } from "../usuarios/auth.service";

@Injectable({
  providedIn: "root",
})
export class ClienteService {
  //Url del api REST
  private urlEndPoint: string = "http://localhost:8080/api/clientes";
  //Cabecera para los metodos save,update y delete
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

  private _notificarUpload = new EventEmitter<any>();

  //Inyectar el httpCliente - variable:objeto
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  //Retorna el listado de clientes paginados - method get
  public findAllClientes(page: number): Observable<any> {
    //return of(CLIENTES); Convierte un objeto clientes json a observable
    return this.http.get(this.urlEndPoint + "/page/" + page).pipe(
      //Cambia la estructura del objeto que se esta manipulando y lo retorna en una nueva
      map((response: any) => {
        (response.content as Cliente[]).forEach((cliente) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          cliente.createAt = formatDate(cliente.createAt,"EEEE dd, MMMM yyyy", "es-MX"); 
        });
        return response;
      })
    );
  }
  //Retorna el listado de regiones
  public findAllRegiones(): Observable<Region[]> {
    return this.http
      .get<Region[]>(this.urlEndPoint + "/regiones")
  }

  //Crear un cliente - method post
  public createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente)
      .pipe(
        //Cambia el response json a cliente
        map((response: any) => response.cliente as Cliente),
        //Cacha los errores provenientes del servidor
        catchError((err) => {
          if (err.status === 400) {
            return throwError(err); //Lanza el error si son de tipo 400 - BAD_REQUEST
          }
          if(err.error.mensaje){
            console.log(err.error.mensaje);
          }         
          return throwError(err); //Lanza una lista de errores
        })
      );
  }

  // Buscar cliente por su id - method get
  public findClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
      .pipe(catchError((err) => {
        if(err!=401 && err.error.mensaje){
          this.router.navigate(["/clientes"]);
          console.log(err.error.mensaje);        
        }
          return throwError(err);
        })
      );
  }

  //Actualizar cliente - method put
  public updateCliente(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente)
      .pipe(
        catchError((err) => {
          if (err.status === 400) {
            return throwError(err);
          }
          if(err.error.mensaje){
            console.log(err.error.mensaje);
          }
          return throwError(err);
        })
      );
  }

  //Eliminar cliente - method delete
  public deleteCliente(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/${id}`)
      .pipe(catchError((err) => {
          return throwError(err);
        })
      );
  }

  //Subir el archivo
  public updateFile(id: any, archivo: File): Observable<HttpEvent<{}>> {
    //Soporta el multipart/form-data
    let formData = new FormData();
    formData.append("archivo", archivo); //Agregar el archivo
    formData.append("id", id); //Agregar el id
    //Seguimiento y visualización del progreso de la solicitud  
    const req = new HttpRequest("POST",`${this.urlEndPoint}/upload/`,formData,
      {
        reportProgress: true,
      }
    );
    return this.http.request(req);
  }

  //Retornar el evento emitido.
  get notificarUpload(): EventEmitter<any> {
    return this._notificarUpload;
  }
}
