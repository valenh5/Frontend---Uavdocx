import { Injectable } from '@angular/core';
import axios from 'axios';
import { Prenda } from '../modelos/prenda';
import { Reclamo } from '../modelos/reclamo';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReclamoService {

  obtenerToken() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private apiUrl = environment.apiUrl + "/reclamos";


  async getReclamos(): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/obtenerReclamos`, this.obtenerToken());
    return response.data;
  }

  async agregarReclamo(reclamo: Reclamo): Promise<Reclamo> {
    try {
      const data = {
        idUsuario: reclamo.id_usuario,
        tipo: reclamo.tipo,
        descripcion: reclamo.descripcion
      };
      const response = await axios.post(`${this.apiUrl}/crearReclamo`, data, this.obtenerToken());
      return response.data;
    } catch (error) {
      console.error("Error al agregar reclamo:", error);
      throw error;
    }
  }

  async eliminarReclamo(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/${id}`, this.obtenerToken());
  }

  async actualizarReclamo(reclamo: Reclamo): Promise<Reclamo> {
    const response = await axios.put<Reclamo>(`${this.apiUrl}/${reclamo.id}`, reclamo, this.obtenerToken());
    return response.data;
  }

  async buscarReclamoPorId(id: number): Promise<Reclamo> {
    const response = await axios.get<Reclamo>(`${this.apiUrl}/${id}`, this.obtenerToken());
    return response.data;
  }

  
}
