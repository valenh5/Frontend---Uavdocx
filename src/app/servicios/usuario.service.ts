import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/enviroment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = environment.apiUrl + '/usuarios';

  esAdminDesdeToken(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.admin === true || payload.admin === 'true';
  } catch {
    return false;
  }
}


  async eliminarUsuario(id_usuario: number) {
    const response = await axios.delete(`${this.apiUrl}/eliminar/${id_usuario}`, this.obtenerToken());
    return response.data;
  }

  async cambiarVerificado(id_usuario: number) {
    const response = await axios.post(`${this.apiUrl}/cambiar-estado-verificado/${id_usuario}`, {}, this.obtenerToken());
    return response.data;
  }

  async cambiarAdmin(id_usuario: number) {
    const response = await axios.post(`${this.apiUrl}/cambiar-estado-admin/${id_usuario}`, {}, this.obtenerToken());
    return response.data;
  }

  async verificarAdmin(id_usuario: number) {
    const response = await axios.get(`${this.apiUrl}/admin/${id_usuario}`);
    return response.data;
  }

    obtenerToken() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async registrarUsuario(nombre_usuario: string, email: string, contrasenia: string) {
    const response = await axios.post(`${this.apiUrl}/registro`, {
      usuario: nombre_usuario,
      email,
      contrasenia,
    });
    return response.data;
  }

  async comprobarUsuario(usuario_ingreso: string, pass_ingreso: string) {
    const response = await axios.post(`${this.apiUrl}/ingresar`, {
      usuario_ingreso,
      pass_ingreso,
    });
    return response.data;
  }

  async solicitarResetContrasenia(email: string) {
    const respuesta = await axios.post(`${this.apiUrl}/olvide-contrasenia`, { email });
    return respuesta.data;
  }

  async resetearContrasenia(token: string, nuevaContrasenia: string) {
    const respuesta = await axios.post(`${this.apiUrl}/resetear-contrasenia/${token}`, {
      nuevaContrasenia
    });
    return respuesta.data;
  }
}
