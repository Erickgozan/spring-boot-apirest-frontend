import { Component, OnInit, Input, Output } from "@angular/core";
import { Cliente } from "./cliente";
import { ClienteService } from "./cliente.service";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { HttpEventType } from "@angular/common/http";
import { AuthService } from '../usuarios/auth.service';
import { FacturaService } from '../facturas/services/factura.service';
import { Factura } from '../facturas/models/factura';

@Component({
  selector: "detalles-component",
  templateUrl: "./detalles.component.html",
})
export class DetallesComponent implements OnInit {
  public titulo: string = "Detalles del cliente";
  //Inyectar el cliente al clientes component
  @Input() public cliente: Cliente;
  //@Input() public factura:Factura;

  public fotoSeleccionada: File;
  public progreso: number = 0;

  constructor(
    private clienteService: ClienteService,
    public authService:AuthService,
    private facturaService:FacturaService,
  ) // private location: Location //Retornar un niver el historial
  {}

  ngOnInit(): void {}

  selectFoto(event: { target: { files: File[] } }) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf("image")) {
      this.fotoSeleccionada = null;
      Swal.fire({
        icon: "error",
        title: "Oops... Error:",
        text: "Debe de ser un formato de imagen!",
      });
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire({
        icon: "error",
        title: "Oops... Error: ",
        text: "Debes seleccionar una foto!",
      });
    } else {
      this.clienteService
        .updateFile(this.cliente.id, this.fotoSeleccionada)
        .subscribe((event) => {
          //this.cliente = cliente;
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progreso = Math.round((100 * event.loaded) / event.total);
              console.log(this.progreso);
              break;
            case HttpEventType.Response:
              let response: any = event.body;
              this.cliente = response.cliente as Cliente;
              this.clienteService.notificarUpload.emit(this.cliente);
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: `Genial!`,
                text: response.mensaje,
                showConfirmButton: false,
                timer: 1500,
              });
             
              break;
          }
        });
    }
  }
  //Devuelve la foto si existe en la bd si no el string
  getFoto(): string {
    return this.cliente.foto ? this.cliente.foto : "Selecciona una foto";
  }

  isExistfoto():boolean{
    return this.cliente.foto ? true:false;
  }

  //Reinicia el valor de la foto seleccionada al salir del modal
  reinciarFoto(){
    this.fotoSeleccionada = null;
  }

  deleteFactura(factura:Factura){
    Swal
    .fire({
      title: `¿Estas seguro de que deseas eliminar la factura ${factura.descripcion}?`,
      text: "Esta operación ya no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    })
    .then((result) => {
      if (result.value) {
        this.facturaService.deleteFactura(factura.id).subscribe(() => {
          this.cliente.facturas = this.cliente.facturas.filter((fac) => fac !== factura);//Actualiza el listado 
          Swal.fire(
            "Eliminado!",
            `La factura ${factura.descripcion} ha sido eliminado exitosamente!.`,
            "success"
          );
        });
      }
    });
  }

}
