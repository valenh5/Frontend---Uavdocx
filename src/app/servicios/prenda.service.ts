import { Injectable } from '@angular/core';
import axios from 'axios';
import { Prenda } from '../modelos/prenda';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PrendasService {

  obtenerToken() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  private apiUrl = environment.apiUrl + "/prendas";


  async getPrendas(): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/listarPrendas`, this.obtenerToken());
    return response.data;
  }

  async verificarTalle(prendaId: number, talle: string, cantidad: number): Promise<boolean> {
    const response = await axios.get(`${this.apiUrl}/talleDisponible/${prendaId}/${talle}/${cantidad}`, this.obtenerToken());
  return response.data.disponible;
  }

  async agregarPrenda(prenda: Prenda): Promise<Prenda> {
    try {
      const response = await axios.post(`${this.apiUrl}/crearPrenda`, prenda, this.obtenerToken());
      return response.data;
    } catch (error) {
      console.error("Error al agregar prenda:", error);
      throw error;
    }
  }

  async eliminarPrenda(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/${id}`, this.obtenerToken());
  }

  async actualizarPrenda(prenda: Prenda): Promise<Prenda> {
    const response = await axios.put<Prenda>(`${this.apiUrl}/${prenda.id}`, prenda, this.obtenerToken());
    return response.data;
  }

  async buscarPrendasPorNombre(nombre: string): Promise<Prenda[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/buscarPrendas`, {
        params: { nombre },
       
      });
      return response.data;
    } catch (error) {
      console.error("Error al buscar prendas por nombre:", error);
      throw error;
    }
  }

  async cargarPrenda(id: number): Promise<Prenda> {
    const response = await axios.get<Prenda>(`${this.apiUrl}/${id}`, this.obtenerToken());
    return response.data;
  }
  
}
