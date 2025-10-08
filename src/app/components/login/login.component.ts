import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule, RouterModule], 
  templateUrl: './login.component.html',
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
      alert(respuesta.mensaje);
    } catch (error: any) {
      alert(error.response?.data?.mensaje || 'Error al registrar usuario');
    }
  }

    async ingresar() {
      try {
        const respuesta = await this.usuarioService.comprobarUsuario(this.usuario_ingreso, this.pass_ingreso);
        console.log('Respuesta login:', respuesta);
        alert(respuesta.mensaje);
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