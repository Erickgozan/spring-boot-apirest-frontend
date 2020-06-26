//Componentes externos de angular
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import { registerLocaleData } from "@angular/common";
import localeEs from "@angular/common/locales/es-MX";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MAT_DATE_LOCALE} from "@angular/material/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Componentes propios
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { DirectivaComponent } from "./directiva/directiva.component";
import { ClientesComponent } from "./clientes/clientes.component";
import { FormComponent } from "./clientes/form.component";
import { NotFoundComponent } from "./error-404/not-found-component.component";
import { PaginatorComponent } from './paginator/paginator.component';
import { DetallesComponent } from './clientes/detalles.component';
import { ClienteService } from "./clientes/cliente.service";
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { ErrorAuthInterceptor } from './usuarios/interceptors/error_auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';
import { MatFormFieldModule } from '@angular/material/form-field';


registerLocaleData(localeEs, "es-MX");

//Agregar rutas de los componetes para mostrar su HTML
const routes: Routes = [
  //Ruta de inicio 'listado de clientes'
  { path: "", component: ClientesComponent },
  //Ruta de directivas 'listado de cursos'
  { path: "directivas", component: DirectivaComponent },
  //Ruta de clientes listado de clientes
  { path: "clientes", component: ClientesComponent },
  { path: "clientes/page/:page", component: ClientesComponent },
  //Ruta del formulario de clientes
  { path: "clientes/form", component: FormComponent, canActivate:[AuthGuard,RoleGuard], data:{role:'ROLE_ADMIN'} },
  //Ruta para edita
  { path: "clientes/form/:id", component: FormComponent, canActivate:[AuthGuard,RoleGuard],data:{role:'ROLE_ADMIN'} },
  //Ruta facturas
  {path: "facturas/:id",component:DetalleFacturaComponent, canActivate:[AuthGuard,RoleGuard], data:{role:'ROLE_USER'}},
  //Ruta formulario facturas
  {path: "facturas/form/:cliente-id",component:FacturasComponent, canActivate:[AuthGuard,RoleGuard], data:{role:'ROLE_ADMIN'}},
  //Login
  { path: "login", component: LoginComponent },
  //Rura 404
  { path: "404", component: NotFoundComponent },
  { path: "**", redirectTo: "/404" },
];

//Registra componentes
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    NotFoundComponent,
    PaginatorComponent,
    DetallesComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent
  ],
  imports: [
    BrowserModule,
    //Agregar la directiva para comunicarse con el backend
    HttpClientModule,
    FormsModule,
    //Agregar la directiva de las rutas
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatMomentDateModule, 
    MatDatepickerModule,
    ReactiveFormsModule,MatAutocompleteModule,MatFormFieldModule
  ],
  //Registra servicios
  providers: [
    ClienteService,
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:ErrorAuthInterceptor, multi:true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
