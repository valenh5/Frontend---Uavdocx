import { Injectable } from '@angular/core';
import axios from 'axios';
import { Carrito } from '../modelos/carrito';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

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
}