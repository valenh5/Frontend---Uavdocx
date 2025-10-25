import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule, RouterModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
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

  constructor(private usuarioService: UsuarioService,  private router: Router) {}

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  esAdmin(): boolean {
    this.esAdminUsuario = this.usuarioService.esAdminDesdeToken();
    return this.esAdminUsuario;
  }

  async ngOnInit(): Promise<void> {
    this.obtenerUsuarioLogueado();
    this.esAdmin();
  }

  async registrar() {
    try {
      const respuesta = await this.usuarioService.registrarUsuario(this.nombre_usuario, this.email, this.contrasenia);
      this.mensajeExito = 'Registro exitoso';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 2000); 
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
        console.log('Respuesta login:', respuesta);
        this.mensajeExito = 'Inicio de Sesion exitoso';
        setTimeout(() => {
          this.mensajeExito = '';
        }, 2000);
        if (respuesta.token) {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuario', this.usuario_ingreso);

          const tokenParts = respuesta.token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const esAdmin = payload.admin === true || payload.admin === 'true';
            if (payload.id) {
              localStorage.setItem('id_usuario', payload.id.toString());
            }
          }

          this.router.navigate(['']);
        }
      } catch (error: any) {
        console.log('Error en login:', error);
        this.mensajeError = 'Error al ingresar usuario';
      setTimeout(() => {
        this.mensajeError = '';
      }, 2000); 
      }
    }

  async solicitarReset() {
    try {
      const respuesta = await this.usuarioService.solicitarResetContrasenia(this.emailReset);
      this.mensajeExito = 'Solicitud enviada exitosamente';
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
}