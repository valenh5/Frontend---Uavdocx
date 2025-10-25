import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-registro',
  standalone: true, 
  imports: [FormsModule, RouterModule, CommonModule], 
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
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
  mensajeError: String = '';
mensajeExito: String = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  async registrar() {
    try {
      const respuesta = await this.usuarioService.registrarUsuario(this.nombre_usuario, this.email, this.contrasenia);
      this.mensajeExito = 'Registro exitoso';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 2000); 
      this.router.navigate(['/login']); 
    } catch (error: any) {
      this.mensajeError = error.response?.data?.mensaje || 'Error al registrar usuario';
      setTimeout(() => {
        this.mensajeError = '';
      }, 2000);
    }
  }

  async ingresar() {
    try {
      const respuesta = await this.usuarioService.comprobarUsuario(this.usuario_ingreso, this.pass_ingreso);
      this.mensajeExito = 'Ingreso exitoso';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 2000); 
      if (respuesta.token) {
        localStorage.setItem('token', respuesta.token);
      }
    } catch (error: any) {
      this.mensajeError = error.response?.data?.mensaje || 'Error al ingresar usuario';
      setTimeout(() => {
        this.mensajeError = '';
      }, 2000);
    }
  }

  async solicitarReset() {
    try {
      const respuesta = await this.usuarioService.solicitarResetContrasenia(this.emailReset);
      this.mensajeExito = 'Solicitud exitosa enviada';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 2000); 
    } catch (error: any) {
      this.mensajeError = error.response?.data?.mensaje || 'Error al solicitar restablecimiento de contraseña';
      setTimeout(() => {
        this.mensajeError = '';
      }, 2000);
    }
  }

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
