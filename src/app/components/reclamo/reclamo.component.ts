import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/enviroment';




const apiUrl = environment.apiUrl + "/reclamos";

import { ReclamoService } from '../../servicios/reclamo.service';
import { Reclamo, Tipo, Estado } from '../../modelos/reclamo';

@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.css']
})

export class ReclamoComponent implements OnInit {
  reclamos: Reclamo[] = [];
  nuevoReclamo: Reclamo = { id: 0, id_usuario: 0, descripcion: '', tipo: Tipo.PRODUCTO, categoria: Estado.PENDIENTE };
  cargando: boolean = false;
  error: string = '';

  tipoOptions = Object.values(Tipo);
  categoriaOptions = Object.values(Estado);

  usuarioNombre: string | null = '';
  usuarioId: number | null = null;

  constructor(private reclamoService: ReclamoService) {}

  ngOnInit() {
    this.usuarioNombre = localStorage.getItem('usuario');
    const id = localStorage.getItem('id_usuario');
    this.usuarioId = id ? parseInt(id) : null;
    this.nuevoReclamo.id_usuario = this.usuarioId ?? 0;
  }

  agregarReclamo() {
    this.cargando = true;
    this.error = '';
    this.nuevoReclamo.id_usuario = this.usuarioId ?? 0;
    this.reclamoService.agregarReclamo(this.nuevoReclamo)
      .then(reclamoAgregado => {
        this.reclamos.push(reclamoAgregado);
        this.nuevoReclamo = { id: 0, id_usuario: this.usuarioId ?? 0, descripcion: '', tipo: Tipo.PRODUCTO, categoria: Estado.PENDIENTE };
        this.cargando = false;
      })
      .catch(() => {
        this.error = 'Error al agregar reclamo';
        this.cargando = false;
      });
  }
}
