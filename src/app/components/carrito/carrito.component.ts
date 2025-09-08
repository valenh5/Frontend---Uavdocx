import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { CarritoService } from '../../servicios/carrito.service';
import { Router } from '@angular/router';

console.log('[CarritoComponent] Archivo cargado');

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})

export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  precioTotal: number = 0;
  usuarioLogueado: string | null | undefined;
  envioLocal: boolean = false;
  envio: number = 0;
  constructor(private carritoService: CarritoService, private router: Router) {
  }
  



  async ngOnInit() {
    await this.obtenerCarrito();
    await this.obtenerUsuarioLogueado();
    await this.calcularEnvio();
  }
   async calcularEnvio() {
    try {
      const result = await this.carritoService.calcularEnvio(this.envioLocal);
      this.envio = result.envio;
    } catch (error) {
      console.error('Error al calcular el envío:', error);
      this.envioLocal = false; 
      this.envio = 100;
    }
  }
    
  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  async obtenerCarrito() {
    try {
      const response = await this.carritoService.obtenerCarrito();

      if (response && Array.isArray(response.productos)) {
        this.carrito = response.productos;
      } else {
        this.carrito = [];
      }

      if (typeof response.precioTotal === 'number') {
        this.precioTotal = response.precioTotal;
      } else {
        this.precioTotal = 0;
      }
    } catch (error) {
      this.carrito = [];
      this.precioTotal = 0;
    }
  }
  async agregarAlCarrito(productoId: number, cantidad: number) {
    try {
      const response = await this.carritoService.agregarAlCarrito(productoId, cantidad);
      this.carrito = response.productos;
      this.precioTotal = response.precioTotal;
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  }
  async eliminarDelCarrito(productoId: number) {
    try {
      const response = await this.carritoService.eliminarDelCarrito(productoId);
      this.carrito = response.productos;
      this.precioTotal = response.precioTotal;
      window.location.reload()
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
    }
  }
  async aumentarCantidad(productoId: number) {
    try {
      const response = await this.carritoService.aumentarCantidad(productoId);
      this.carrito = response.productos;
      this.precioTotal = response.precioTotal;
      window.location.reload()
    } catch (error) {
      console.error('Error al aumentar cantidad:', error);
    }
  }
  async disminuirCantidad(productoId: number) { 
    try {
      const response = await this.carritoService.disminuirCantidad(productoId);
      this.carrito = response.productos;
      this.precioTotal = response.precioTotal;
      window.location.reload()
    } catch (error) {
      console.error('Error al disminuir cantidad:', error);
    }
  }

  async comprar(){
    await this.router.navigate(['/compra']);
  }

}                                                                                                                                 