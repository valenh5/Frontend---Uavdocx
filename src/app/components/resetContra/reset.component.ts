import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  imports: [FormsModule, CommonModule, RouterModule], 
})
export class ResetComponent implements OnInit {
  nuevaContrasenia = '';
  token = '';
  usuarioLogueado: string | null = null;
  esAdminUsuario: boolean = false;
  
mensajeError: String = '';
mensajeExito: String = '';


  constructor(private route: ActivatedRoute, private usuarioService: UsuarioService) {}

  esAdmin(): boolean {
    this.esAdminUsuario = this.usuarioService.esAdminDesdeToken();
    return this.esAdminUsuario;
  }

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  ngOnInit(): void {
    this.obtenerUsuarioLogueado();
    this.esAdmin();
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  async resetearContrasenia() {
    try {
      const respuesta = await this.usuarioService.resetearContrasenia(this.token, this.nuevaContrasenia);
      this.mensajeExito = 'Solicitud enviada por mail';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 2000); 
    } catch (error: any) {
      this.mensajeError = error.response?.data?.mensaje || 'Error al restablecer contraseña front';
      setTimeout(() => {
        this.mensajeError = '';
      }, 2000);
    }
  }
}
