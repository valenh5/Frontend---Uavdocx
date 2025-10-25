import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrendasService } from '../../servicios/prenda.service';
import axios from 'axios';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
const apiUrl = 'http://localhost:3000/prendas'; 

@Component({
  selector: 'app-prendas',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './abm.component.html',
  styleUrls: ['./abm.component.css']
})
export class AbmComponent implements OnInit {
  prendas: any[] = [];
  prendasFiltradas: any[] = [];
  busqueda: string = '';
prendaNueva: any = {
  nombre: '',
  precio: '',
  talles: { S: 0, M: 0, L: 0, XL: 0 },
  categoria: '',
  imagenPrincipal: '',
  imagenesSecundarias: []
};

mensajeError: String = '';
mensajeExito: String = '';

  prendaEditando: any = null;
  mostrarFormulario: boolean = false;
  categorias: string[] = ['JEAN', 'BUZO', 'CAMPERA', 'REMERA', 'SHORT', 'OTRO'];

  paginaActual = 1;
  limitePorPagina = 2;
  totalPaginas = 10;
    usuarioLogueado: string | null = null;
    esAdminUsuario: boolean = false;

  esAdmin(): boolean {
    this.esAdminUsuario = this.usuarioService.esAdminDesdeToken();
    return this.esAdminUsuario;
  }

      obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  } 

  constructor(private prendasService: PrendasService, private usuarioService: UsuarioService) {}

  async ngOnInit(): Promise<void> {
      this.obtenerUsuarioLogueado();
    this.esAdmin();
      if (this.esAdminUsuario) {
    await this.cargarPrendas();
  }
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarPrendas();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarPrendas();
    }
  }

 
  async cargarPrendas(): Promise<void> {
    try {
      const response = await axios.get(`${apiUrl}/listarPrendas?page=${this.paginaActual}&limit=${this.limitePorPagina}`);
      this.prendas = response.data.data;
      this.totalPaginas = response.data.total ? Math.ceil(response.data.total / this.limitePorPagina) : 1;  
      this.prendasFiltradas = [...this.prendas];
    } catch (error) {
      console.error("Error al cargar prendas:", error);
    }
  }

async crearPrenda(): Promise<void> {
  try {
    if (typeof this.prendaNueva.imagenesSecundarias === 'string') {
      this.prendaNueva.imagenesSecundarias = this.prendaNueva.imagenesSecundarias
        .split(',')
        .map((url: string) => url.trim())
        .filter((url: string) => url.length > 0);
    }
    const nuevaPrenda = await this.prendasService.agregarPrenda(this.prendaNueva);
    await this.cargarPrendas();
    this.mensajeExito = 'Prenda creada con éxito';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 2000); 
    this.prendaNueva = {
      nombre: '',
      precio: '',
      talles: { S: 0, M: 0, L: 0, XL: 0 },
      categoria: '',
      imagenPrincipal: '',
      imagenesSecundarias: []
    };
    this.mostrarFormulario = false;
  } catch (error: any) {
    console.error("Error al crear prenda:", error);
    this.mensajeError = 'Error al crear prenda: ' + (error.response?.data?.message || error.message);
      setTimeout(() => {
        this.mensajeError = '';
      }, 2000); 
  }
}

  editarPrenda(prenda: any): void {
  if (this.prendaEditando && this.prendaEditando.id === prenda.id) {
    this.prendaEditando = null;
  } else {
    this.prendaEditando = { 
      ...prenda, 
      talles: { ...prenda.talles },
      imagenesSecundarias: Array.isArray(prenda.imagenesSecundarias) 
        ? prenda.imagenesSecundarias.join(', ') 
        : ''
    };
  }
}

async guardarCambios(): Promise<void> {
  if (this.prendaEditando && this.prendaEditando.id !== undefined && this.prendaEditando.id !== 0) {
    try {
      if (typeof this.prendaEditando.imagenesSecundarias === 'string') {
        this.prendaEditando.imagenesSecundarias = this.prendaEditando.imagenesSecundarias
          .split(',')
          .map((url: string) => url.trim())
          .filter((url: string) => url.length > 0);
      }
      await this.prendasService.actualizarPrenda(this.prendaEditando);
      await this.cargarPrendas();
      this.prendaEditando = null;
      this.mensajeExito = 'Prenda editada con éxito';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 2000);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      this.mensajeError = 'Error al guardar cambios: ' + error;
      setTimeout(() => {
        this.mensajeError = '';
      }, 2000);
    }
  } else {
    this.mensajeError = "No se puede guardar cambios: ID inválido.";
    setTimeout(() => {
      this.mensajeError = '';
    }, 2000);
  }
}

  async eliminarPrenda(id: number): Promise<void> {
    try {
      await this.prendasService.eliminarPrenda(id);
      await this.cargarPrendas();
      this.mensajeExito = 'Prenda eliminada con éxito';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 2000);
    } catch (error) {
      console.error("Error al eliminar prenda:", error);
      this.mensajeError = 'Error al eliminar prenda: ' + error;
      setTimeout(() => {
        this.mensajeError = '';
      }, 2000);
    }
  }

  async realizarBusqueda(): Promise<void> {
    if (!this.busqueda || this.busqueda.trim() === '') {
      this.prendasFiltradas = [...this.prendas];
      return;
    }
  
    try {
      const prendas = await this.prendasService.buscarPrendasPorNombre(this.busqueda);
      this.prendasFiltradas = prendas;
    } catch (error) {
      console.error("Error al buscar prendas:", error);
      this.prendasFiltradas = [];
    }
  }
}