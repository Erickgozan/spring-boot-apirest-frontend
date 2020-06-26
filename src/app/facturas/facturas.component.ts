import { Component, OnInit } from "@angular/core";
import { FacturaService } from "./services/factura.service";
import { ActivatedRoute, Router } from "@angular/router";
import { flatMap, map } from "rxjs/operators";
import { ClienteService } from "../clientes/cliente.service";
import { Factura } from "./models/factura";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { Producto } from "./models/producto";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { ItemFactura } from "./models/item-factura";
import Swal from "sweetalert2";

@Component({
  selector: "app-facturas",
  templateUrl: "./facturas.component.html",
  styleUrls: ["./facturas.component.css"],
})
export class FacturasComponent implements OnInit {
  
  public titulo = "Factura: ";
  public factura: Factura;

  autoCompleteControl = new FormControl();
  produtosFiltrados: Observable<Producto[]>;

  constructor(
    public clienteService: ClienteService,
    private activeRouter: ActivatedRoute,
    public facturaService: FacturaService,
    private router: Router
  ) {
    this.factura = new Factura();
  }

  ngOnInit(): void {
    this.activeRouter.paramMap.subscribe((param) => {
      let idCliente = +param.get("cliente-id");
      if (idCliente != null) {
        this.clienteService
          .findClienteById(idCliente)
          .subscribe((cliente) => (this.factura.cliente = cliente));
      }
    });

    //Metodo que tiene el evento que cambia los valores del input conforme se va tecleando
    this.produtosFiltrados = this.autoCompleteControl.valueChanges.pipe(
      map((value) => (typeof value === "string" ? value : value.nombre)),
      flatMap((value) => (value ? this._filter(value) : []))
    );
  }

  //Retorna el json de productos con el valor filtrado en minusculas
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProductos(filterValue);
  }

  //Muestra el nombre del producto en el input
  public mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  //Muestra los productos en la tabla
  public seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    console.log(producto);

    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autoCompleteControl.setValue("");
    event.option.focus();
    event.option.deselect();
  }

  public actualizarCantidad(id: number, event: any): void {
    let cantidad = event.target.value as number;
    if (cantidad == 0) {
      this.eliminarItem(id);
    }
    //Se crea un nuevo objecto item con la cantidad actuaizada
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
    console.log(this.factura.items);
  }

  public existeItem(id: number): boolean {
    let existe = false;

    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  private incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item;
    });
  }

  public eliminarItem(id: number): void {
    this.factura.items = this.factura.items.filter(
      (item) => id != item.producto.id
    );
  }

  public crearFactura(facturaForm:any): void {
    if(this.factura.items.length == 0){
      this.autoCompleteControl.setErrors({'invalid':true});
    }
     if (facturaForm.form.valid && this.factura.items.length > 0) {
      this.facturaService.crearFactura(this.factura).subscribe((factura) => {
        Swal.fire(
          "Factura creada",
          `La factura ${factura.descripcion} ha sido creada con éxito`,
          "success"
          
        );
        this.router.navigate(["/facturas",factura.id]);
      });
    }
  }
}
