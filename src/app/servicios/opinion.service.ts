import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/enviroment';
import { Compra } from '../modelos/compra';
import { Opinion } from '../modelos/opinion';

@Injectable({
  providedIn: 'root'
})
export class OpinionService {
  private apiUrl = `${environment.apiUrl}/opinion`;
      obtenerToken() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
    async crearOpinion(opinion: Opinion): Promise<Opinion> {
    const response = await axios.post<Opinion>(
      `${this.apiUrl}/${opinion.id_compra}`,
      {
        calificacion: opinion.calificacion,
        comentario: opinion.comentario,
        usuario: opinion.usuario,
        foto: (opinion as any).foto 
      },
      this.obtenerToken()
    );
    return response.data;
  }

  async verificarExistencia(id_compra: number): Promise<boolean> {
    try {
      const response = await axios.get<{ existe: boolean }>(
        `${this.apiUrl}/compra/${id_compra}`
          );
      return response.data.existe;
    } catch (error) {
      console.error('Error al verificar la existencia de la opinión:', error);
      throw error;
    }
}

async eliminarOpinion(id_opinion: number): Promise<void> {
    await axios.delete(
      `${this.apiUrl}/${id_opinion}`,
      this.obtenerToken()
    );
  }

async obtenerOpinionesPorUsuario(id_usuario: number): Promise<Opinion[]> {
    const response = await axios.get<Opinion[]>(
      `${this.apiUrl}/usuario/${id_usuario}`,
      this.obtenerToken()
    );
    return response.data;
  }

  async obtenerTodasOpiniones(): Promise<Opinion[]> {
    const response = await axios.get<Opinion[]>(
      `${this.apiUrl}`,
      this.obtenerToken()
    );
    return response.data;
  }

}