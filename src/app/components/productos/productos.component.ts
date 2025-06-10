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
async cargarProductos(): Promise<void> {
    try {

      const response = await axios.get(apiUrl + "/productos");
      this.prendas = response.data;
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

