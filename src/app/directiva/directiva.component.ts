import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-directiva",
  templateUrl: "./directiva.component.html",
})

export class DirectivaComponent {
  
  //Variables de clase
  listaCurso: string[] = ["TypeScript", "JavaScript", "Java SE", "C#", "PHP"];
  habilitar: boolean = true;
  buttonValue: string = "";

  constructor() {}


  //Evalua si el boton se oprimio para ocultar o mostrar el listado
  setHabilitar(): void {
    this.habilitar = this.habilitar == true ? false : true;
  }
  //Retorna el valor del boton
  getButtomValue(): string {
    return (this.buttonValue = this.habilitar == true ? "Ocultar" : "Mostrar");
  }
}
