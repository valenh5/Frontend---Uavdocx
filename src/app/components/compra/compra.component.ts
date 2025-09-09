import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { CarritoService } from '../../servicios/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {
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




 

}