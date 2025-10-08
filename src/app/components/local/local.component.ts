import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-local',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],

  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css']
})

export class LocalComponent implements OnInit {
  usuarioLogueado: string | null = null;
  esAdminUsuario: boolean = false;

  constructor(private usuarioService: UsuarioService) {}

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
  }
}