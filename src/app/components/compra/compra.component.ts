import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { CarritoService } from '../../servicios/carrito.service';
import { PrendasService } from '../../servicios/prenda.service';
import { Router, RouterModule } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../environments/enviroment';
import { CompraService } from '../../servicios/compra.service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], 
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {
  opcionEntregaTexto: string = '';
  carrito: any[] = [];
  precioTotal: number = 0;
  usuarioLogueado: string | null = null;
  esAdminUsuario: boolean = false;
  envioLocal: boolean = false;
  envio: number = 0;
  paso: number = 1;
  email: string = '';
  mensajeFaltanDatos: string = '';
  opcionEntrega: string = '';
  opcionesEnvio: { [key: string]: number } = {
    domicilio: 2000,
    sucursal: 0,
    express: 3500,
    pickup: 500,
    retirar: 0
  };
  nombreDestinatario: string = '';
  id_usuario: number = Number(localStorage.getItem('id_usuario')) || 0;
  direccionEntrega: string = '';
  apellidoDestinatario: string = '';
  telefonoDestinatario: string = '';
  dniDestinatario: string = '';
  preferenceId: string | null = null;
  publicKey: string = 'APP_USR-97fcd1ee-745e-4751-a335-690ec9395bfe';
  estado = '';

  constructor(
    private usuarioService: UsuarioService,
    private carritoService: CarritoService,
    private PrendasService: PrendasService,
    private CompraService: CompraService
  ) {}



  datosCompletos(): boolean {
    return !!(
      this.email &&
      this.nombreDestinatario &&
      this.apellidoDestinatario &&
      this.dniDestinatario &&
      this.telefonoDestinatario &&
      this.direccionEntrega
    );
  }

  esAdmin(): boolean {
    this.esAdminUsuario = this.usuarioService.esAdminDesdeToken();
    return this.esAdminUsuario;
  }

  async ngOnInit() {
    await this.obtenerCarrito();
    await this.obtenerUsuarioLogueado();
    this.esAdmin();
    this.actualizarEnvioPorOpcion();
    this.paso = 1;
  }

  async siguientePasoUno() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailRegex.test(this.email)) {
      this.mensajeFaltanDatos = 'Por favor, ingrese un email válido.';
      setTimeout(() => { this.mensajeFaltanDatos = ''; }, 2000);
      return;
    }
    if (this.opcionEntrega === '') {
      this.mensajeFaltanDatos = 'Por favor, seleccione una opción de entrega.';
      setTimeout(() => { this.mensajeFaltanDatos = ''; }, 2000);
      return;
    }
    this.paso = 2;
    await this.createPreference();
  }

  actualizarEnvioPorOpcion() {
    const map: { [key: string]: string } = {
      domicilio: 'MOTOMENSAJERIA',
      sucursal: 'CORREOARGENTINO',
      express: 'PUDO',
      pickup: 'OCA',
      retirar: 'SUCURSAL'
    };
    if (this.opcionEntrega && this.opcionesEnvio.hasOwnProperty(this.opcionEntrega)) {
      this.envio = this.opcionesEnvio[this.opcionEntrega];
      this.opcionEntregaTexto = map[this.opcionEntrega] || this.opcionEntrega;
    } else {
      this.envio = 0;
      this.opcionEntregaTexto = '';
    }
  }

  async calcularEnvio() {
    this.actualizarEnvioPorOpcion();
  }

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  async obtenerCarrito() {
    try {
      const response = await this.carritoService.obtenerCarrito();
      if (response && Array.isArray(response.productos)) {
        const productosConDatos = await Promise.all(
          response.productos.map(async (item: any) => {
            try {
              const prenda = await this.PrendasService.cargarPrenda(item.id);
              return {
                ...item,
                nombre: prenda?.nombre ? `${prenda.nombre} (Talle ${item.talle})` : `Sin nombre (Talle ${item.talle})`,
                imagen: prenda?.imagenPrincipal || '',
              };
            } catch (e) {
              return {
                ...item,
                nombre: `Sin nombre (Talle ${item.talle})`,
                imagen: '',
              };
            }
          })
        );
        this.carrito = productosConDatos;
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
        'https://uavdocx-back.policloudservices.ipm.edu.ar/create-preference',
        {
          envio: this.envio,
          total: this.precioTotal + this.envio
        },
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

  async crearCompra() {
    if (!this.datosCompletos()) {
      this.mensajeFaltanDatos = 'Completa todos los datos antes de pagar.';
      setTimeout(() => { this.mensajeFaltanDatos = ''; }, 2000);
      return;
    }
    const compra = {
      id: 0,
      idUsuario: this.id_usuario,
      productos: this.carrito.map(item => ({
        idPrenda: item.id,
        talle: item.talle,
        cantidad: item.cantidad
      })),
      total: this.precioTotal + this.envio,
      estado: 'pendiente',
      direccion: this.direccionEntrega,
      nombre: this.nombreDestinatario,
      apellido: this.apellidoDestinatario,
      telefono: this.telefonoDestinatario,
      dni: this.dniDestinatario,
      email: this.email,
      envio: this.opcionEntregaTexto,
      fecha: new Date().toISOString(),
      fechaEntrega: null
    };
    try {
      await this.CompraService.crearCompra(compra);
      this.mensajeFaltanDatos = '¡Compra creada y pagada!';
      setTimeout(() => { this.mensajeFaltanDatos = ''; }, 2000);
    } catch (error) {
      console.error(error);
      this.mensajeFaltanDatos = 'Error al crear la compra.';
      setTimeout(() => { this.mensajeFaltanDatos = ''; }, 2000);
    }
  }
}