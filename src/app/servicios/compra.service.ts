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

    retornarCompras(id: number) {
    return axios.get(`${this.apiUrl}/${id}`);
    }

    crearCompra(compra: Compra) {
    return axios.post(this.apiUrl, compra);
    }
}