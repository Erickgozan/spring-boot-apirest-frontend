import { Component } from '@angular/core';
// selector: es la etiqueta html, esta etiqueta va incrustada en los html
// templateUrl: es el html que esta asociado al componente
// styleUrls: son las ojas de estilos relacionadas el componente
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Bienvenido a Angular!';
  contenido = 'Curso de Angular ';
}
