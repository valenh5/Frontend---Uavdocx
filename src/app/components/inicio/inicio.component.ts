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

  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class PrendasComponent implements OnInit {
  prendas: any[] = [];

  prendasFiltradas: any[] = []; 
  prendaNueva: any = {
    nombre: '',
    precio: '',
    talles: { S: 0, M: 0, L: 0, XL: 0 },  
    categoria: '',
    imagen: ''
  };

  imagenesCarrusel: string[] = [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    'https://media.ambito.com/p/aaf7481f624a5be504b589056a6b2ce7/adjuntos/239/imagenes/040/250/0040250587/moda-ropajpg.jpg',
    'https://fotos.perfil.com/2024/04/22/trim/987/555/como-esta-el-precio-de-la-ropa-en-la-argentina-1789368.jpg'
  ];
  imagenActual: number = 0;
  intervaloCarrusel: any;

  prendaEditando: any = null;
  mostrarFormulario: boolean = false;
  categorias: string[] = ['JEAN', 'BUZO', 'CAMPERA', 'REMERA', 'SHORT', 'OTRO'];


  busqueda: string = '';
  usuarioLogueado: string | null = null;



  constructor() {}

  async ngOnInit(): Promise<void> {
    await this.cargarPrendas();
    this.iniciarCarrusel();
    this.obtenerUsuarioLogueado();
  }

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

    iniciarCarrusel() {
    this.intervaloCarrusel = setInterval(() => {
      this.siguienteImagen();
    }, 4000);
  }

  detenerCarrusel() {
    if (this.intervaloCarrusel) {
      clearInterval(this.intervaloCarrusel);
    }
  }

  siguienteImagen() {
    this.imagenActual = (this.imagenActual + 1) % this.imagenesCarrusel.length;
  }

  anteriorImagen() {
    this.imagenActual = (this.imagenActual - 1 + this.imagenesCarrusel.length) % this.imagenesCarrusel.length;
  }

  irAImagen(index: number) {
    this.imagenActual = index;
    this.detenerCarrusel();
    this.iniciarCarrusel();
  }

  toggleFormulario(): void {

    this.mostrarFormulario = !this.mostrarFormulario;

  }

  async cargarPrendas(): Promise<void> {
    try {

      const response = await axios.get(apiUrl + "/listarPrendas");
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

async realizarBusqueda(): Promise<void> {
  const texto = this.busqueda.trim();

  if (!texto) {
    this.prendasFiltradas = [...this.prendas];
    return;
  }

  try {
    const response = await axios.get(apiUrl + "/buscarPrendas", {
      params: { texto }
    });
    this.prendasFiltradas = response.data;
  } catch (error) {
    console.error("Error al buscar prendas:", error);
  }
}


}

