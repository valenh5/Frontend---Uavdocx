import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/enviroment';
import { CarritoService } from '../../servicios/carrito.service';
import { RouterModule } from '@angular/router';



const apiUrl = environment.apiUrl + "/prendas";

@Component({
  selector: 'app-prendas',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],

  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})



export class ProductoComponent implements OnInit {
    prendasFiltradas: any[] = []; 
    prendas: any[] = [];
  carrito: any;
  precioTotal: any;
  router: any;
    esAdminUsuario: boolean = false;
  esAdmin(): boolean {
    this.esAdminUsuario = localStorage.getItem('esAdmin') === 'true';
    return this.esAdminUsuario;
  }

    constructor(public carritoService: CarritoService) {} 


    usuarioLogueado: string | null = null;

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  async ngOnInit(): Promise<void> {
    this.obtenerUsuarioLogueado();
    this.esAdmin();
    await this.cargarProductos();
}
paginaActual = 1;
limitePorPagina = 3;
totalPaginas = 1;
mostrarFiltro: boolean = false;
categorias: string[] = ['JEAN', 'BUZO', 'CAMPERA', 'REMERA', 'SHORT', 'OTRO'];
categoriaFiltrar : string | null = null;
precioMinimo: number = 1;
precioMaximo: number = 1000;




async agregarAlCarrito(productoId: number, cantidad: number, talle: string) {
  try {
    const response = await this.carritoService.agregarAlCarrito(productoId, cantidad, talle);
    this.carrito = response.productos;
    this.precioTotal = response.precioTotal;
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
  }
}

async filtrar() {
  try {
    const response = await axios.post(apiUrl + '/filtrar', {
      categoria: this.categoriaFiltrar,
      minimo: this.precioMinimo,
      maximo: this.precioMaximo
    });

    this.prendasFiltradas = response.data;
  } catch (error) {
    console.error("Error al filtrar prendas:", error);
    this.prendasFiltradas = [];
  }
}

async limpiarFiltro() {
  this.categoriaFiltrar = null;
  this.precioMinimo = 1;
  this.precioMaximo = 1000;
  await this.cargarProductos();
}



  toggleFormulario(): void {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

async cargarProductos(): Promise<void> {
  try {
    const response = await axios.get(`${apiUrl}/listarPrendas?page=${this.paginaActual}&limit=${this.limitePorPagina}`);
    this.prendas = response.data.data || response.data;
    this.totalPaginas = response.data.total ? Math.ceil(response.data.total / this.limitePorPagina) : 1;
    this.prendasFiltradas = [...this.prendas];
  } catch (error) {
    console.error("Error al cargar prendas:", error);
  }
}

  busqueda: string = '';

 async realizarBusqueda(): Promise<void> {
  if (!this.busqueda || this.busqueda.trim() === '') {
    this.prendasFiltradas = [...this.prendas];
    return;
  }

  try {
    const response = await axios.get(`${apiUrl}/buscarPrendas?nombre=${encodeURIComponent(this.busqueda)}`);
    this.prendasFiltradas = response.data;
  } catch (error) {
    console.error("Error al buscar una prenda:", error);
    this.prendasFiltradas = [];
  }
}



  irAPagina(pagina: number): void {
    if (pagina !== this.paginaActual) {
      this.paginaActual = pagina;
      this.cargarProductos();
    }
  }

  verProducto(id: number): void {
    window.location.href = `/producto/${id}`;
  }
}
