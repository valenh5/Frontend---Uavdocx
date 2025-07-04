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

 



}

