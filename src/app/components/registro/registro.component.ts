import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true, 
  imports: [FormsModule], 
  templateUrl: './registro.component.html',
})
export class RegistroComponent {
  nombre_usuario = '';
  contrasenia = '';
  email = '';
  usuario_ingreso = '';
  pass_ingreso = '';
  emailReset = '';

  constructor(private usuarioService: UsuarioService) {}

  async registrar() {
    try {
      const respuesta = await this.usuarioService.registrarUsuario(this.nombre_usuario, this.email, this.contrasenia);
      alert(respuesta.mensaje);
    } catch (error: any) {
      alert(error.response?.data?.mensaje || 'Error al registrar usuario');
    }
  }

  async ingresar() {
    try {
      const respuesta = await this.usuarioService.comprobarUsuario(this.usuario_ingreso, this.pass_ingreso);
      alert(respuesta.mensaje);
      if (respuesta.token) {
        localStorage.setItem('token', respuesta.token);
      }
    } catch (error: any) {
      alert(error.response?.data?.mensaje || 'Error al ingresar usuario');
    }
  }

  async solicitarReset() {
    try {
      const respuesta = await this.usuarioService.solicitarResetContrasenia(this.emailReset);
      alert(respuesta.mensaje);
    } catch (error: any) {
      alert(error.response?.data?.mensaje || 'Error al solicitar restablecimiento de contraseña');
    }
  }
}
