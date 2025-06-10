import { Routes } from '@angular/router';
import { PrendasComponent } from './components/inicio.component';
import { RegistroComponent } from './components/registro.component';

import { LoginComponent } from './components/login.component';
import { ResetComponent } from './components/reset.component';
import { ProductoComponent } from './components/productos/productos.component';


export const routes: Routes = [
  { path: '', component: PrendasComponent },
  { path: 'sesion', component: RegistroComponent },

  { path: 'usuarios/resetear-contrasenia/:token', component: ResetComponent },
  { path: 'productos', component: ProductoComponent },
  { path: 'login', component: LoginComponent}

];
