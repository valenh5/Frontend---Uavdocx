import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { CarritoService } from '../../servicios/carrito.service';
import { Router } from '@angular/router';
import { PrendasService } from '../../servicios/prenda.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  precioTotal: number = 0;
  usuarioLogueado: string | null = null;
  esAdminUsuario: boolean = false;
  envioLocal: boolean = false;
  envio: number = 0;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private PrendasService: PrendasService
  ) {}

  esAdmin(): boolean {
    this.esAdminUsuario = localStorage.getItem('esAdmin') === 'true';
    return this.esAdminUsuario;
  }

  async ngOnInit() {
    this.obtenerUsuarioLogueado();
    this.esAdmin();
    await this.obtenerCarrito();
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

  async cargarPrenda(id: number) {
    try {
      const prenda = await this.PrendasService.cargarPrenda(id);
      return prenda;
    } catch (error) {
      console.error('Error al cargar la prenda:', error);
      return null;
    }
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

  async eliminarDelCarrito(productoId: number, talle: string) {
    try {
      const response = await this.carritoService.eliminarDelCarrito(productoId, talle);
      this.carrito = response.productos;
      this.precioTotal = response.precioTotal;
      window.location.reload();
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
    }
  }

  mensajeError: string = '';

async aumentarCantidad(productoId: number, talle: string) {
  const item = this.carrito.find(p => p.id === productoId && p.talle === talle);
  if (!item) return;

  const disponible = await this.PrendasService.verificarTalle(productoId, talle, item.cantidad + 1);
  if (!disponible) {
    this.mensajeError = 'No hay suficiente stock para ese talle';
    setTimeout(() => { this.mensajeError = ''; }, 2000);
    return;
  }

  try {
    const response = await this.carritoService.aumentarCantidad(productoId, talle);
    this.carrito = response.productos;
    this.precioTotal = response.precioTotal;
    window.location.reload();
  } catch (error) {
    console.error('Error al aumentar cantidad:', error);
  }
}

  async disminuirCantidad(productoId: number, talle: string) { 
    try {
      const response = await this.carritoService.disminuirCantidad(productoId, talle);
      this.carrito = response.productos;
      this.precioTotal = response.precioTotal;
      window.location.reload();
    } catch (error) {
      console.error('Error al disminuir cantidad:', error);
    }
  }

  async comprar() {
    await this.router.navigate(['/compra']);
  }

    verProducto(id: number): void {
    window.location.href = `/producto/${id}`;
  }
}