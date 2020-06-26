import { Region } from "./region";
import { Factura } from "../facturas/models/factura";

export class Cliente {
 public id: number;
 public nombre: string;
 public apellido: string;
 public email: string;
 public createAt: string;
 public foto: string;
 public region: Region;
 public facturas: Array<Factura> = [];
}
