import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';

import { LoginComponent } from './components/login/login.component';
import { ResetComponent } from './components/resetContra/reset.component';
import { ProductoComponent } from './components/productos/productos.component';
import { AbmComponent } from './components/abm/abm.component';
import { inicio } from './components/inicio/inicio.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CompraComponent } from './components/compra/compra.component';
import { StockGuard } from './guards/stock.guard';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ReclamoComponent } from './components/reclamo/reclamo.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ReclamosComponent } from './components/reclamos/reclamos.component';
import { LocalComponent } from './components/local/local.component';
import { OpinionComponent } from './components/opinion/opinion.component';
import { ComprasComponent } from './components/compras/compras.component';

export const routes: Routes = [
  { path: '', component: inicio },
  { path: 'sesion', component: RegistroComponent },

  { path: 'usuarios/resetear-contrasenia/:token', component: ResetComponent },
  { path: 'productos', component: ProductoComponent },
  { path: 'producto/:id', loadComponent: () => import('./components/producto/producto.component').then(m => m.ProductoDetalleComponent) },
  { path: 'login', component: LoginComponent},
  { path: 'abm', component: AbmComponent},
  { path: 'carrito', component: CarritoComponent },
  { path: 'compra', component: CompraComponent, canActivate: [StockGuard] },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'reclamo', component: ReclamoComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'reclamos', component: ReclamosComponent },
  { path: 'local', component: LocalComponent },
  { path: 'opinion/:id', component: OpinionComponent },
  { path: 'compras', component: ComprasComponent }
  
];