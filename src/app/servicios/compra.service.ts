import { Injectable } from '@angular/core';
import axios from 'axios';
import { Carrito } from '../modelos/carrito';
import { environment } from '../../environments/enviroment';
import { Compra } from '../modelos/compra';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

    apiUrl = environment.apiUrl + "/compras";

    obtenerToken() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

    retornarCompras(id: number) {
    return axios.get(`${this.apiUrl}/${id}`);
    }

    obtenerCompras(){
    return axios.get(this.apiUrl, this.obtenerToken());
    }

    crearCompra(compra: Compra) {
    return axios.post(this.apiUrl, compra);
    }

    modificarCompra(id: number, compra: Compra){
      return axios.put(`${this.apiUrl}/modificar/${id}`, compra, this.obtenerToken())
    }
}