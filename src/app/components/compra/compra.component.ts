import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { CarritoService } from '../../servicios/carrito.service';
import { Router } from '@angular/router';
import axios from 'axios';

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

  preferenceId: string | null = null;
  publicKey: string = 'APP_USR-97fcd1ee-745e-4751-a335-690ec9395bfe';
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

async createPreference() {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.post(
      'http://localhost:3000/create-preference',
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (response.status === 200) {
      const data = response.data;
      this.preferenceId = data.preference_id;
      this.renderMercadoPagoButton();
    }
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
  }
}

  renderMercadoPagoButton() {
    if (!this.preferenceId) return;
    // @ts-ignore
    const mp = new window.MercadoPago(this.publicKey);
    const bricksBuilder = mp.bricks();
    const container = document.getElementById('walletBrick_container');
    if (container) container.innerHTML = '';
    bricksBuilder.create('wallet', 'walletBrick_container', {
      initialization: {
        preferenceId: this.preferenceId,
      }
    });
  }
}
