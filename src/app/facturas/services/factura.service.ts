import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})

export class FacturaService {

  private urlEndPoint = "http://localhost:8080/api/facturas"

  constructor(private http:HttpClient) { }

  //Retorna la factura por su id.
  public getfacturas(id:number):Observable<Factura>{
   return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }
  //Elimina la factura por su id
  public deleteFactura(id:number):Observable<void>{
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

 public filtrarProductos(term:string):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndPoint}/filtrar-producto/${term}`);
  }

public crearFactura(factura:Factura):Observable<Factura>{
  return this.http.post<Factura>(this.urlEndPoint,factura);
}
  
}
