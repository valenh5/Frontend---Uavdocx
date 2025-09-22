import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  mostrarTooltip: boolean = false;
  usuarioAEliminar: number | null = null;

  constructor(private usuarioService: UsuarioService) {}
    esAdmin: boolean = false;

  async ngOnInit() {
    this.esAdmin = localStorage.getItem('esAdmin') === 'true';
      if (this.esAdmin) {
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