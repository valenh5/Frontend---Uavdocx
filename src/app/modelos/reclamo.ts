export enum Tipo {
    PRODUCTO = 'PRODUCTO',
    ENVIO = 'ENVIO',
    PAGO = 'PAGO',
    ATENCION = 'ATENCION',
    OTRO = 'OTRO'
  }
  
  export enum Estado {
    PENDIENTE = 'PENDIENTE',
    EN_PROCESO = 'EN_PROCESO',
    RESUELTO = 'RESUELTO',
    CERRADO = 'CERRADO'
  }
  
  export interface Reclamo {
    id: number;
    id_usuario: number;
    descripcion: string;
    tipo: Tipo;
    estado: Estado;
  }
  