import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  imports: [FormsModule, CommonModule], 
})
export class ResetComponent implements OnInit {
  nuevaContrasenia = '';
  token = '';

  constructor(private route: ActivatedRoute, private usuarioService: UsuarioService) {}

  ngOnInit() {
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
