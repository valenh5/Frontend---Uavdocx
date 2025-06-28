import { Injectable } from '@angular/core';
import axios from 'axios';
import { Prenda } from '../modelos/prenda';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PrendasService {

  private apiUrl = environment.apiUrl + "/prendas";

  async getPrendas(): Promise<Prenda[]> {
    const response = await axios.get<Prenda[]>(this.apiUrl);
    return response.data;
  }

  async agregarPrenda(prenda: Prenda): Promise<Prenda> {
    const response = await axios.post<Prenda>(this.apiUrl, prenda);
    return response.data;
  }

  async eliminarPrenda(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/${id}`);
  }

  async actualizarPrenda(prenda: Prenda): Promise<Prenda> {
    const response = await axios.put<Prenda>(`${this.apiUrl}/${prenda.id}`, prenda);
    return response.data;
  }
}
