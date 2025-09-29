import { Injectable } from '@angular/core';
import axios from 'axios';
import { Carrito } from '../modelos/carrito';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

    apiUrl = environment.apiUrl + "/carrito";

    retornarCompras(id: number) {
    return axios.get(`${this.apiUrl}/${id}`);
    }
}