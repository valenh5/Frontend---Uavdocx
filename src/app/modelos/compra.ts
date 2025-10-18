export interface Compra {
  id: number;
  idUsuario: number;
  productos: any[];
  total: number;
  estado: string;
  direccion: string;
  nombre: string;
  apellido: string;
  telefono: string;
  dni: string;
  email: string;
  envio: string; 
  fecha: string;
  fechaEntrega: string | null;
}