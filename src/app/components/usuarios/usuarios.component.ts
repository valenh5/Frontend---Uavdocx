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

  constructor(private usuarioService: UsuarioService) {}
    esAdmin: boolean = false;

  async ngOnInit() {
    this.esAdmin = localStorage.getItem('esAdmin') === 'true';
      if (this.esAdmin) {
    await this.cargarUsuarios();
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