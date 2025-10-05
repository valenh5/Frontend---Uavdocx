import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  mostrarTooltip: boolean = false;
  usuarioAEliminar: number | null = null;
  usuarioLogueado: string | null = null;
  esAdminUsuario: boolean = false;

  constructor(private usuarioService: UsuarioService) {}

  esAdmin(): boolean {
    this.esAdminUsuario = localStorage.getItem('esAdmin') === 'true';
    return this.esAdminUsuario;
  }

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  async ngOnInit() {
    this.obtenerUsuarioLogueado();
    this.esAdmin();
    if (this.esAdminUsuario) {
      await this.cargarUsuarios();
    }
  }

    mostrarConfirmacion(id: number) {
    this.mostrarTooltip = true;
    this.usuarioAEliminar = id;
  }

    cancelarEliminarUsuario() {
    this.mostrarTooltip = false;
    this.usuarioAEliminar = null;
  }

    async confirmarEliminarUsuario() {
    if (this.usuarioAEliminar !== null) {
      await this.eliminarUsuario(this.usuarioAEliminar);
      this.mostrarTooltip = false;
      this.usuarioAEliminar = null;
    }
  }

  async cambiarAdmin(id: number){
    try {
      await this.usuarioService.cambiarAdmin(id);
      await this.cargarUsuarios();
    } catch (error) {
      console.error('Error al cambiar rol de usuario:', error);
    }
  }

  async cambiarVerificado(id: number){
    try {
      await this.usuarioService.cambiarVerificado(id);  
      await this.cargarUsuarios();
    } catch (error) {
      console.error('Error al cambiar estado de verificación de usuario:', error);
    }
  }

  async eliminarUsuario(id: number){
    try {
      await this.usuarioService.eliminarUsuario(id);
      await this.cargarUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }

  async cargarUsuarios() {
    try {
      this.usuarios = await this.usuarioService.obtenerTodosUsuarios();
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }
}