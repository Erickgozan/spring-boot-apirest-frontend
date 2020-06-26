import { Cliente } from "src/app/clientes/cliente";
import { ItemFactura } from "./item-factura";

export class Factura {
  id: number;
  descripcion: string;
  observacion: string;
  createAt: string;
  cliente: Cliente;
  items: Array<ItemFactura> = [];
  total:number;

  calcularGrantotal():number{
    this.total = 0;
    this.items.forEach(item=>{
      this.total+= item.calcularImporte();
    });
    return this.total;
  }
}
