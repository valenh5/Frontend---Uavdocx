import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CarritoService } from '../servicios/carrito.service';

@Injectable({ providedIn: 'root' })
export class StockGuard implements CanActivate {
  constructor(private carritoService: CarritoService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const disponible = await this.carritoService.verificarStock();
    if (!disponible) {
      localStorage.setItem('mensajeError', 'No hay suficiente stock para completar la compra');
      this.router.navigate(['/carrito']);
      return false;
    }
    return true;
  }
}
