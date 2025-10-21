import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReclamoService } from '../../servicios/reclamo.service';
import { UsuarioService } from '../../servicios/usuario.service';
import axios from 'axios';
import { environment } from '../../../environments/enviroment';


@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './reclamos.component.html',
  styleUrls: ['./reclamos.component.css']
})
export class ReclamosComponent implements OnInit {
  reclamos: any[] = [];
  usuarioLogueado: string | null = null;
  esAdminUsuario: boolean = false;
  page: number = 1;
  limit: number = 2;
  total: number = 0;

  constructor(private reclamoService: ReclamoService, private usuarioService: UsuarioService) {}

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
      await this.cargarReclamos();
    }
  }

  async cargarReclamos() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${environment.apiUrl}/reclamos`, {
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
        this.reclamos = res.data;
        this.total = res.total;
        this.page = res.page;
        this.limit = res.limit;
      } else {
        this.reclamos = Array.isArray(res) ? res : [];
        this.total = this.reclamos.length;
      }
    } catch (error) {
      console.error('Error al cargar reclamos:', error);
    }
  }

  totalPaginas(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  reclamosDesde(): number {
    return this.total === 0 ? 0 : (this.page - 1) * this.limit + 1;
  }

  reclamosHasta(): number {
    return Math.min(this.page * this.limit, this.total);
  }

  async cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas() || nuevaPagina === this.page) return;
    this.page = nuevaPagina;
    await this.cargarReclamos();
  }

  async eliminarReclamo(id: number) {
    try {
      await this.reclamoService.eliminarReclamo(id);
      await this.cargarReclamos();
    } catch (error) {
      console.error('Error al eliminar reclamo:', error);
    }
  }

  async modificarReclamo(reclamo: any) {
    try {
      await this.reclamoService.actualizarReclamo(reclamo);
      await this.cargarReclamos();
    } catch (error) {
      console.error('Error al modificar reclamo:', error);
    }
  }
}
