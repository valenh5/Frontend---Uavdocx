import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../servicios/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];

  constructor(private carritoService: CarritoService) {}

  async ngOnInit() {
    await this.obtenerCarrito();
  }

  async obtenerCarrito() {
    const response = await this.carritoService.obtenerCarrito();
    this.carrito = response.data.data || [];
  }
}