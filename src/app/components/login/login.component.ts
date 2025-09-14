import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule], 
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
  constructor(private usuarioService: UsuarioService,  private router: Router) {}

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  async ngOnInit(): Promise<void> {
    this.obtenerUsuarioLogueado();
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

      const id_usuario = respuesta.id_usuario || respuesta.id || null;
      console.log('id_usuario:', id_usuario);
      if (id_usuario) {
        try {
          const adminRes = await this.usuarioService.verificarAdmin(id_usuario);
          console.log('adminRes:', adminRes, typeof adminRes);

          // Universal: soporta true, "true", {esAdmin: true}, etc.
          let esAdmin = false;
          if (adminRes === true || adminRes === 'true') {
            esAdmin = true;
          } else if (
            typeof adminRes === 'object' &&
            (adminRes.esAdmin === true ||
              adminRes.admin === true ||
              adminRes.esAdmin === 'true' ||
              adminRes.admin === 'true')
          ) {
            esAdmin = true;
          }
          localStorage.setItem('esAdmin', esAdmin ? 'true' : 'false');
          localStorage.setItem('id_usuario', id_usuario.toString());
        } catch (e) {
          console.log('Error en verificarAdmin:', e);
          localStorage.setItem('esAdmin', 'false');
        }
      } else {
        localStorage.setItem('esAdmin', 'false');
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