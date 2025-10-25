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

  obtenerComprasPaginadas(page: number, limit: number, token: string | null) {
  return axios.get(this.apiUrl, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` }
  });
}

    retornarCompras(id: number) {
    return axios.get(`${this.apiUrl}/${id}`);
    }

    obtenerCompras(){
    return axios.get(this.apiUrl, this.obtenerToken());
    }

    crearCompra(compra: Compra) {
    return axios.post(this.apiUrl, compra, this.obtenerToken());
    }

    modificarCompra(id: number, compra: Compra){
      const body = {
        estado: compra.estado,
        fechaEntrega: compra.fechaEntrega
      };
      return axios.put(`${this.apiUrl}/modificar/${id}`, body, this.obtenerToken())
    }
}