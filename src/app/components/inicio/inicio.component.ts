import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
export class inicio implements OnInit {



  usuarioLogueado: string | null = null;

  ofertas: string[] = [
    '2x1 en remeras urbanas',
    'Envío gratis en compras mayores a $30.000',
    '10% OFF pagando en efectivo',
    '¡Nuevas camperas edición limitada!',
    '3 cuotas sin interés con todas las tarjetas'
  ];


  imagenCarrusel: string[] = [
    'https://acdn-us.mitiendanube.com/stores/001/596/994/themes/rio/1-slide-1747670070879-2735889896-d68d7e524886b958183c4c4901f3df371747670073-1920-1920.jpg?630779295',
    'https://acdn-us.mitiendanube.com/stores/001/596/994/themes/rio/1-slide-1747669820280-978068272-cc0b4777973ad5ac5683110a8b6dc39c1747669826-1920-1920.jpg?630779295',
  ];

  imagenActual: number = 0;
  animando: boolean = false;
  intervalId: any;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.obtenerUsuarioLogueado();
    this.iniciarCarrusel();
  }

  iniciarCarrusel() {
    this.intervalId = setInterval(() => {
      this.siguienteImagen();
    }, 8000);
  }

  cambiarImagen(direccion: number) {
    this.animando = true;
    setTimeout(() => {
      if (direccion === 1) {
        this.siguienteImagen();
      } else {
        this.imagenActual = (this.imagenActual - 1 + this.imagenCarrusel.length) % this.imagenCarrusel.length;
      }
      this.animando = false;
    }, 100);
  }

  siguienteImagen() {
    this.imagenActual = (this.imagenActual + 1) % this.imagenCarrusel.length;
  }

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

   



}

