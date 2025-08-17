import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- Agrega esto
import { CarritoService } from '../../servicios/carrito.service';

console.log('[CarritoComponent] Archivo cargado');

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule, CommonModule], // <-- Agrega CommonModule aquí
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})

export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  precioTotal: number = 0;

  constructor(private carritoService: CarritoService) {
  }

  async ngOnInit() {
    await this.obtenerCarrito();
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
}