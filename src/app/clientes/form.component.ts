import { Component, OnInit } from "@angular/core";
import { Cliente } from "./cliente";
import { ClienteService } from "./cliente.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import swal from "sweetalert2";
import { Region } from './region';
import { retry } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  //Arreglo de errores
  public errores: string[];
  public titulo: string = "Crear cliente";
  public regiones: Region[];

  constructor(
    public clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  ngOnInit(): void {
    this.cargarCliente();
  }
  //Mostrar el cliente en el formulario
  public cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params.id;
      if (id != null) {
        this.clienteService.findClienteById(id).subscribe((cliente) => (this.cliente = cliente));
      }
    });
    //Campo select para agregar las regiones 
    this.clienteService.findAllRegiones().subscribe(regiones => {
      this.regiones = regiones;
    });
  }


  //Crea el cliente 'evento'
  public create(): void {
    this.clienteService.createCliente(this.cliente).subscribe(
      //Genera la respuesta en el cliente
      (cliente) => {
        //Al pulzar el boton crear manda al listado de clientes
        this.router.navigate(["/clientes"]);
        swal.fire("Nuevo cliente", `Se ha creado el cliente ${cliente.nombre} ${cliente.apellido}`, "success");
      },
      //guarda los errores provenientes del service para mostrarlos en el formulario
      (err) => {
        (this.errores = err.error.errors as string[])
        if(err.status==500){
          Swal.fire("Error: ","El correo electronico ya existe en la base de datos","error");
        }
      }
    );
  }
  //Actualizar el cliente 'evento'
  public update(): void {
    this.cliente.facturas=null;
    this.clienteService.updateCliente(this.cliente).subscribe(
      (json) => {
        //Al pulzar el boton actualizar manda al listado de clientes
        this.router.navigate(["/clientes"]),
          swal.fire(
            "Cliente Actualizado",
            `${json.mensaje}</br>
            ID: ${json.cliente.id}, Nombre: ${json.cliente.nombre} ${json.cliente.apellido}`,
            "success"
          );
      },
      (err) => {
        (this.errores = err.error.errors as string[])
      }
    );
  }
  //Comprara los objetos de la region en el select
  compararRegion(obj1: Region, obj2: Region): boolean {
    if (obj1 === undefined && obj2 === undefined) {
      return true;
    }
    return obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined
      ? false : obj1.id === obj2.id;
  }
}
