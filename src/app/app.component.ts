import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router'; // <-- Importa RouterModule
import { UsuarioService } from './servicios/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  esAdminUsuario: boolean = false;
  usuarioLogueado: string | null = null;
    ofertas: string[] = [
    'Importado Premium',
    'Envío gratis en compras mayores a $30.000',
    '10% OFF pagando en efectivo',
    '¡Nuevas camperas edición limitada!',
    '3 cuotas sin interés con todas las tarjetas'
  ];

  constructor(private usuarioService: UsuarioService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actualizarEstadoUsuario();
      }
    });
    window.addEventListener('storage', () => this.actualizarEstadoUsuario());
  }

  ngOnInit(): void {
    this.actualizarEstadoUsuario();
  }

  actualizarEstadoUsuario() {
    this.usuarioLogueado = localStorage.getItem('usuario');
    this.esAdminUsuario = this.usuarioService.esAdminDesdeToken();
  }
}