//Componentes de Angular
import { Component, OnInit } from "@angular/core";
//componentes propios
import { Cliente } from "./cliente";
import { ClienteService } from "./cliente.service";
import swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../usuarios/auth.service";

@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html",
})


export class ClientesComponent implements OnInit {
  
  clientes: Cliente[];
  clientePaginador: JSON;
  clienteSeleccionado: Cliente;

  //Inyección de dependecias usando la clase ClienteService para obtener el listado de clientes
  constructor(
    public clienteServie: ClienteService,
    private activatedRote: ActivatedRoute,
    public authService: AuthService
  ) {}

  //Metodo que inicia la clase y muesta el listado de clientes
  ngOnInit(): void {
    this.activatedRote.paramMap.subscribe((params) => {
      let page: number = +params.get("page");
      if (!page) {
        page = 0;
      }
      this.clienteServie.findAllClientes(page).subscribe((json) => {
        (this.clientes = json.content as Cliente[]),
          (this.clientePaginador = json); //Guarda toda la respuesta del pageable json que viene del servidor
      });
    });
    //Metodo para asignar la foto al cliente en el listado
    this.clienteServie.notificarUpload.subscribe(
      (cliente: { id: number; foto: string }) => {
        this.clientes = this.clientes.map((clienteOriginal) => {
          if (cliente.id == clienteOriginal.id) {
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        });
      }
    );
  }
  //Metodo para elminar al cliente
  public delete(cliente: Cliente): void {
    swal
      .fire({
        title: `¿Estas seguro de que deseas eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
        text: "Esta operación ya no se puede revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar!",
      })
      .then((result) => {
        if (result.value) {
          this.clienteServie.deleteCliente(cliente.id).subscribe(() => {
            this.clientes = this.clientes.filter((cli) => cli !== cliente);//Actualiza el listado 
            swal.fire(
              "Eliminado!",
              `El cliente ${cliente.nombre} ${cliente.apellido} ha sido eliminado exitosamente!.`,
              "success"
            );
          });
        }
      });
  }
  //Agrega el cliente al detalles component
  public verDetalle(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
  }

  public reiniciarFoto() {
    this.clienteSeleccionado.foto = null;
  }
}
