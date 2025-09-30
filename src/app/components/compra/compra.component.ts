import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { CarritoService } from '../../servicios/carrito.service';
import { PrendasService } from '../../servicios/prenda.service';
import { Router } from '@angular/router';
import axios from 'axios';
import { CompraService } from '../../servicios/compra.service';
import { Compra } from '../../modelos/compra';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {
  opcionEntregaTexto: string = '';
  carrito: any[] = [];
  precioTotal: number = 0;
  usuarioLogueado: string | null | undefined;
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
  direccionEntrega: string = '';
  apellidoDestinatario: string = '';
  telefonoDestinatario: string = '';
  dniDestinatario: string = '';
  preferenceId: string | null = null;
  publicKey: string = 'APP_USR-97fcd1ee-745e-4751-a335-690ec9395bfe';
  constructor(private carritoService: CarritoService, private router: Router, private PrendasService: PrendasService, private CompraService: CompraService) {
  }
  



  async ngOnInit() {
    await this.obtenerCarrito();
    await this.obtenerUsuarioLogueado();
    this.actualizarEnvioPorOpcion();
    this.paso = 1;
  }

async siguientePasoUno() {
  if (this.email != null && this.email.trim() !== '') {
    this.paso = 2;
    await this.createPreference(); 
  } else {
    this.mensajeFaltanDatos = 'Por favor, ingrese un email válido.';
    setTimeout(() => {
      this.mensajeFaltanDatos = '';
    }, 2000);
  }
}

actualizarEnvioPorOpcion() {
  const map: { [key: string]: string } = {
    domicilio: 'MOTOMENSAJERIA',
    sucursal: 'Correo Argentino Clasico',
    express: 'PUDO Argentina',
    pickup: 'OCA',
    retirar: 'Retiro en UAVDOCX'
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

      verProducto(id: number): void {
    window.location.href = `/producto/${id}`;
  }

  async crearCompra() {
    if (!this.email || !this.nombreDestinatario || !this.apellidoDestinatario || !this.dniDestinatario || !this.telefonoDestinatario || !this.direccionEntrega) {
      this.mensajeFaltanDatos = 'Por favor, complete todos los datos del destinatario.';
      setTimeout(() => {
        this.mensajeFaltanDatos = '';
      }, 2000);
      return;
    }

   
    let id_usuario = 0;
    try {
      const usuarioStr = localStorage.getItem('usuario');
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        id_usuario = usuario.id || 0;
      }
    } catch (e) {
      id_usuario = 0;
    }

    
    const compra: Compra = {
      id: 0, 
      id_usuario: id_usuario,
      productos: this.carrito,
      precioTotal: this.precioTotal + this.envio,
      estado: 'pendiente',
      direccionEntrega: this.direccionEntrega,
      nombreDestinatario: this.nombreDestinatario,
      apellidoDestinatario: this.apellidoDestinatario,
      telefonoDestinatario: this.telefonoDestinatario,
      dniDestinatario: this.dniDestinatario,
      email: this.email,
      opcionEntrega: this.opcionEntregaTexto,
      envio: this.envio,
      fecha: new Date().toISOString()
    };

    try {
      await this.CompraService.crearCompra(compra);
      this.mensajeFaltanDatos = '¡Compra realizada con éxito!';
      setTimeout(() => {
        this.mensajeFaltanDatos = '';
        this.router.navigate(['/']);
      }, 2000);
    } catch (error) {
      this.mensajeFaltanDatos = 'Error al crear la compra.';
      setTimeout(() => {
        this.mensajeFaltanDatos = '';
      }, 2000);
      console.error('Error al crear la compra:', error);
    }
  }
}
