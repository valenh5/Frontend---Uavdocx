import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReclamoService } from '../../servicios/reclamo.service';
import { UsuarioService } from '../../servicios/usuario.service';


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
      this.reclamos = await this.reclamoService.getReclamos();
    } catch (error) {
      console.error('Error al cargar reclamos:', error);
    }
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
