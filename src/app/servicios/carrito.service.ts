import { Injectable } from '@angular/core';
import axios from 'axios';
import { Carrito } from '../modelos/carrito';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  calcularEnvio() {
    return axios.get(`${this.apiUrl}/envio`, this.obtenerToken())
      .then(response => response.data)
      .catch(error => {
        console.error('Error al calcular el envío:', error);
        return { envio: 0 }; // Retornar un valor por defecto en caso de error
      });
  }

  obtenerToken() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private apiUrl = environment.apiUrl + "/carrito";

  async obtenerCarrito(): Promise<Carrito> {
    const response = await axios.get(this.apiUrl, this.obtenerToken());
    return response.data;
  }

  async agregarAlCarrito(productoId: number, cantidad: number): Promise<Carrito> {
    const response = await axios.post(
      `${this.apiUrl}/agregar`,
      { productos: [{ id: productoId, cantidad }] },
      this.obtenerToken()
    );
    return response.data;
  }

  async eliminarDelCarrito(productoId: number): Promise<Carrito> {
    const response = await axios.delete(
      `${this.apiUrl}/eliminar`,
      {
        ...this.obtenerToken(),
        data: { productoId }
      }
    );
    return response.data;
  }

  async aumentarCantidad(productoId: number): Promise<Carrito> {
    const response = await axios.post(
      `${this.apiUrl}/sumar`,
      { productoId },
      this.obtenerToken()
    );
    return response.data;
  }

  async disminuirCantidad(productoId: number): Promise<Carrito> {
    const response = await axios.post(
      `${this.apiUrl}/restar`,
      { productoId },
      this.obtenerToken()
    );
    return response.data;
  }
}