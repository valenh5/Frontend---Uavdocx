import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';

import { LoginComponent } from './components/login/login.component';
import { ResetComponent } from './components/resetContra/reset.component';
import { ProductoComponent } from './components/productos/productos.component';
import { AbmComponent } from './components/abm/abm.component';
import { inicio } from './components/inicio/inicio.component';
import { CarritoComponent } from './components/carrito/carrito.component';


export const routes: Routes = [
  { path: '', component: inicio },
  { path: 'sesion', component: RegistroComponent },

  { path: 'usuarios/resetear-contrasenia/:token', component: ResetComponent },
  { path: 'productos', component: ProductoComponent },
  { path: 'login', component: LoginComponent},
  { path: 'abm', component: AbmComponent},
  { path: 'carrito', component: CarritoComponent },

];
