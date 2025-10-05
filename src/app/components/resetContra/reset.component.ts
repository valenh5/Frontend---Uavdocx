import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  imports: [FormsModule, CommonModule, RouterModule], 
})
export class ResetComponent implements OnInit {
  nuevaContrasenia = '';
  token = '';
  usuarioLogueado: string | null = null;
  esAdminUsuario: boolean = false;

  constructor(private route: ActivatedRoute, private usuarioService: UsuarioService) {}

  esAdmin(): boolean {
    this.esAdminUsuario = localStorage.getItem('esAdmin') === 'true';
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
      alert(respuesta.mensaje);
    } catch (error: any) {
      alert(error.response?.data?.mensaje || 'Error al restablecer contraseña front');
    }
  }
}
