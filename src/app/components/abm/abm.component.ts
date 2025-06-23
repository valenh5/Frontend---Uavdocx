import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { CommonModule } from '@angular/common';

const apiUrl = "http://localhost:3000/prendas";


@Component({
  selector: 'app-prendas',
  standalone: true,
  imports: [FormsModule, CommonModule],

  templateUrl: './abm.component.html',
  styleUrls: ['./abm.component.css']
})
export class AbmComponent implements OnInit {
  prendas: any[] = [];
    busqueda: string = '';
  prendasFiltradas: any[] = []; 
  prendaNueva: any = {
    nombre: '',
    precio: '',
    talles: { S: 0, M: 0, L: 0, XL: 0 },
    categoria: '',
    imagen: ''
  };

  prendaEditando: any = null;
  mostrarFormulario: boolean = false;
  categorias: string[] = ['JEAN', 'BUZO', 'CAMPERA', 'REMERA', 'SHORT', 'OTRO'];


  


  constructor() {}

  async ngOnInit(): Promise<void> {
    await this.cargarPrendas();
  }

  toggleFormulario(): void {

    this.mostrarFormulario = !this.mostrarFormulario;

  }

async cargarPrendas(): Promise<void> {
  try {
    const response = await axios.get(apiUrl + "/cargarPrendas");
    console.log("Prendas recibidas:", response.data); 
    this.prendas = response.data;
    this.prendasFiltradas = [...this.prendas];
  } catch (error) {
    console.error("Error al cargar prendas:", error);
  }
}


  async cargarPrenda(id : number): Promise<void> {
    try{
      const response = await axios.get(apiUrl + `/${id}`)
    }catch (error){
      return;
    }
    
  }

  async crearPrenda(): Promise<void> {
    try {
      await axios.post(apiUrl + "/crearPrenda", this.prendaNueva);
      await this.cargarPrendas();
      alert(`Prenda creada: ${this.prendaNueva.nombre}`);
      this.prendaNueva = {
        nombre: '',
        precio: '',
        talles: { S: 0, M: 0, L: 0, XL: 0 },
        categoria: '',
        imagen: ''
      };
    } catch (error) {
      console.error("Error al crear prenda:", error);
      alert("Hubo un error al crear la prenda. Por favor, intenta de nuevo.");
    }
  }


  editarPrenda(prenda: any): void {
    this.prendaEditando = { ...prenda, talles: { ...prenda.talles } };
  }

  async guardarCambios(): Promise<void> {
    if (this.prendaEditando?.id !== undefined && this.prendaEditando?.id !== 0) {
      try {
        await axios.put(apiUrl + `/${this.prendaEditando.id}`, {
          nombre: this.prendaEditando.nombre,
          precio: this.prendaEditando.precio,
          talles: this.prendaEditando.talles,

          categoria: this.prendaEditando.categoria,
          imagen: this.prendaEditando.imagen,
        });
        await this.cargarPrendas();
        this.prendaEditando = null;
        alert("Prenda editada");

      } catch (error) {
        console.error("Error al guardar cambios:", error);
      }
    } else {

      console.warn("No se puede guardar cambios: ID inválido.");
    }
  }

  async eliminarPrenda(id: number): Promise<void> {
    try {
      await axios.delete(apiUrl + `/${id}`);
      await this.cargarPrendas();
      alert("Prenda eliminada");
    } catch (error) {
      console.error("Error al eliminar prenda:", error);
    }
  }



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

