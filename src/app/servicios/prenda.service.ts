import { Injectable } from '@angular/core';
import axios from 'axios';
import { Prenda } from '../modelos/prenda';
import { environment } from '../../environments/enviroment';
import { get } from 'http';

@Injectable({
  providedIn: 'root'
})
export class PrendasService {

  getHeaders() {
    const token = localStorage.getItem('token');
    alert(token);
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private apiUrl = environment.apiUrl + "/prendas";

  async getPrendas(): Promise<any> {
    //falta paginacion
    const response = await axios.get(this.apiUrl, this.getHeaders());
    return response.data;
  }

  async agregarPrenda(prenda: Prenda): Promise<Prenda> {
    const response = await axios.post<Prenda>(this.apiUrl, prenda, this.getHeaders());
    return response.data;
  }

  async eliminarPrenda(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  async actualizarPrenda(prenda: Prenda): Promise<Prenda> {
    const response = await axios.put<Prenda>(`${this.apiUrl}/${prenda.id}`, prenda, this.getHeaders());
    return response.data;
  }
}
