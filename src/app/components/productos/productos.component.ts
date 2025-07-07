import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/enviroment';


const apiUrl = environment.apiUrl + "/prendas";

@Component({
  selector: 'app-prendas',
  standalone: true,
  imports: [FormsModule, CommonModule],

  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})



export class ProductoComponent implements OnInit {
    prendasFiltradas: any[] = []; 
    prendas: any[] = [];

    async ngOnInit(): Promise<void> {
    await this.cargarProductos();
    await this.obtenerUsuarioLogueado();
}
paginaActual = 1;
limitePorPagina = 4;
totalPaginas = 1;
usuarioLogueado: string | null = null;

      obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }



async cargarProductos(): Promise<void> {
  try {
    const response = await axios.get(`${apiUrl}/productos?page=${this.paginaActual}&limit=${this.limitePorPagina}`);
    
    this.prendas = response.data.data;
    this.totalPaginas = Math.ceil(response.data.total / this.limitePorPagina);
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
};
