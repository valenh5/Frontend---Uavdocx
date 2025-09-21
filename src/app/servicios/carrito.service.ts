import { Injectable } from '@angular/core';
import axios from 'axios';
import { Carrito } from '../modelos/carrito';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

    calcularEnvio(envioLocal: boolean = false) {
    if (envioLocal) {
      return Promise.resolve({ envio: 0 });
    }
    return Promise.resolve({ envio: 100 });
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


async agregarAlCarrito(productoId: number, cantidad: number, talle: string): Promise<Carrito> {
  const response = await axios.post(
    `${this.apiUrl}/agregar`,
    { productos: [{ id: productoId, cantidad, talle }] },
    this.obtenerToken()
  );
  return response.data;
}

async eliminarDelCarrito(productoId: number, talle: string): Promise<Carrito> {
  const response = await axios.delete(
    `${this.apiUrl}/eliminar`,
    {
      ...this.obtenerToken(),
      data: { productoId, talle }
    }
  );
  return response.data;
}

async aumentarCantidad(productoId: number, talle: string): Promise<Carrito> {
  const response = await axios.post(
    `${this.apiUrl}/sumar`,
    { productoId, talle },
    this.obtenerToken()
  );
  return response.data;
}

async disminuirCantidad(productoId: number, talle: string): Promise<Carrito> {
  const response = await axios.post(
    `${this.apiUrl}/restar`,
    { productoId, talle },
    this.obtenerToken()
  );
  return response.data;
}

}