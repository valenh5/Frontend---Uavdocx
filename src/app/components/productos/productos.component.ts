import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { CommonModule } from '@angular/common';

const apiUrl = "http://localhost:3000/prendas";

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
}
paginaActual = 1;
limitePorPagina = 4;
totalPaginas = 1;

paginaAnterior(): void {
  if (this.paginaActual > 1) {
    this.paginaActual--;
    this.cargarProductos();
  }
}

paginaSiguiente(): void {
  if (this.paginaActual < this.totalPaginas) {
    this.paginaActual++;
    this.cargarProductos();
  }
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
realizarBusqueda(): void {
    const texto = this.busqueda.toLowerCase().trim();

    if (texto === '') {
      this.prendasFiltradas = [...this.prendas];
    } else {
      this.prendasFiltradas = this.prendas.filter(prenda =>
        prenda.nombre.toLowerCase().includes(texto)
      );
    }
  }
}

