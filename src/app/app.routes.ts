import { Routes } from '@angular/router';
import { PrendasComponent } from './components/inicio/inicio.component';
import { RegistroComponent } from './components/registro/registro.component';

import { LoginComponent } from './components/login/login.component';
import { ResetComponent } from './components/reset.component';
import { ProductoComponent } from './components/productos/productos.component';
import { AbmComponent } from './components/abm/abm.component';


export const routes: Routes = [
  { path: '', component: PrendasComponent },
  { path: 'sesion', component: RegistroComponent },

  { path: 'usuarios/resetear-contrasenia/:token', component: ResetComponent },
  { path: 'productos', component: ProductoComponent },
  { path: 'login', component: LoginComponent},
  { path: 'abm', component: AbmComponent}

];
