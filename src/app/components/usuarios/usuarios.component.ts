import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import axios from 'axios';
import { environment } from '../../../environments/enviroment';

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
  page: number = 1;
  limit: number = 1;
  total: number = 0;

  constructor(private usuarioService: UsuarioService ) {}

  esAdmin(): boolean {
    this.esAdminUsuario = this.usuarioService.esAdminDesdeToken();
    return this.esAdminUsuario;
  }

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  async ngOnInit() {
    this.obtenerUsuarioLogueado();
    this.esAdmin();
    if (this.esAdminUsuario) {
      await this.cargarUsuariosPaginados();
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
      await this.cargarUsuariosPaginados();
    } catch (error) {
      console.error('Error al cambiar rol de usuario:', error);
    }
  }

  async cambiarVerificado(id: number){
    try {
      await this.usuarioService.cambiarVerificado(id);  
      await this.cargarUsuariosPaginados();
    } catch (error) {
      console.error('Error al cambiar estado de verificación de usuario:', error);
    }
  }

  async eliminarUsuario(id: number){
    try {
      await this.usuarioService.eliminarUsuario(id);
      await this.cargarUsuariosPaginados();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }

  async cargarUsuariosPaginados() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${environment.apiUrl}/usuarios/todos`, {
        params: {
          page: this.page,
          limit: this.limit
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const res = response.data;
      if (res && res.data) {
        this.usuarios = res.data;
        this.total = res.total;
        this.page = res.page;
        this.limit = res.limit;
      } else {
        this.usuarios = Array.isArray(res) ? res : [];
        this.total = this.usuarios.length;
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas()) return;
    this.page = nuevaPagina;
    this.cargarUsuariosPaginados();
  }

  totalPaginas(): number {
    return Math.ceil(this.total / this.limit);
  }
}