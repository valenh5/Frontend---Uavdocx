import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/enviroment';
import { RouterModule } from '@angular/router';




const apiUrl = environment.apiUrl + "/reclamos";

import { ReclamoService } from '../../servicios/reclamo.service';
import { Reclamo, Tipo, Estado } from '../../modelos/reclamo';

@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.css']
})

export class ReclamoComponent implements OnInit {
  reclamos: Reclamo[] = [];
  nuevoReclamo: Reclamo = { id: 0, id_usuario: 0, descripcion: '', tipo: Tipo.PRODUCTO, estado: Estado.PENDIENTE };
  cargando: boolean = false;
  error: string = '';
  exito: string = '';
  esAdminUsuario: boolean = false;
  usuarioLogueado: string | null = null;

  esAdmin(): boolean {
    this.esAdminUsuario = localStorage.getItem('esAdmin') === 'true';
    return this.esAdminUsuario;
  }
  tipoOptions = Object.values(Tipo);
  categoriaOptions = Object.values(Estado);

  usuarioNombre: string | null = '';
  usuarioId: number | null = null;

  constructor(private reclamoService: ReclamoService) {}

  async ngOnInit() {
    this.usuarioNombre = localStorage.getItem('usuario');
    const id = localStorage.getItem('id_usuario');
    this.usuarioId = id ? parseInt(id) : null;
    this.nuevoReclamo.id_usuario = this.usuarioId ?? 0;
    await this.esAdmin();
  }

 agregarReclamo() {
    this.cargando = true;
    this.error = '';
    this.exito = '';
    this.nuevoReclamo.id_usuario = this.usuarioId ?? 0;
    this.reclamoService.agregarReclamo(this.nuevoReclamo)
      .then(() => {
        this.exito = '¡Reclamo enviado correctamente!';
        this.cargando = false;
        this.nuevoReclamo.descripcion = '';
        this.nuevoReclamo.tipo = Tipo.PRODUCTO;
      })
      .catch(() => {
        this.error = 'Error al agregar reclamo';
        this.cargando = false;
      });
  }
}
