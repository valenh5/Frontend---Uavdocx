import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = environment.apiUrl + '/usuarios';

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
