import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true, 
  imports: [FormsModule, RouterModule], 
  templateUrl: './registro.component.html',
})
export class RegistroComponent {
  nombre_usuario = '';
  contrasenia = '';
  email = '';
  usuario_ingreso = '';
  pass_ingreso = '';
  emailReset = '';
  usuarioLogueado: string | null = null;
  esAdminUsuario: boolean = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  async registrar() {
    try {
      const respuesta = await this.usuarioService.registrarUsuario(this.nombre_usuario, this.email, this.contrasenia);
      alert(respuesta.mensaje);
      this.router.navigate(['/login']); 
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

  esAdmin(): boolean {
    this.esAdminUsuario = localStorage.getItem('esAdmin') === 'true';
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
