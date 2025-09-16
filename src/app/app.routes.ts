import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';

import { LoginComponent } from './components/login/login.component';
import { ResetComponent } from './components/resetContra/reset.component';
import { ProductoComponent } from './components/productos/productos.component';
import { AbmComponent } from './components/abm/abm.component';
import { inicio } from './components/inicio/inicio.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CompraComponent } from './components/compra/compra.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ReclamoComponent } from './components/reclamo/reclamo.component';

export const routes: Routes = [
  { path: '', component: inicio },
  { path: 'sesion', component: RegistroComponent },

  { path: 'usuarios/resetear-contrasenia/:token', component: ResetComponent },
  { path: 'productos', component: ProductoComponent },
  { path: 'producto/:id', loadComponent: () => import('./components/producto/producto.component').then(m => m.ProductoDetalleComponent) },
  { path: 'login', component: LoginComponent},
  { path: 'abm', component: AbmComponent},
  { path: 'carrito', component: CarritoComponent },
  { path: 'compra', component: CompraComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'reclamo', component: ReclamoComponent }
];
