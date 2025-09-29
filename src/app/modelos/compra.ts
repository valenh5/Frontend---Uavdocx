export interface Compra {
  id: number;
  id_usuario: number;
  productos: any[];
  precioTotal: number;
  estado: string;
  direccionEntrega: string;
  nombreDestinatario: string;
  apellidoDestinatario: string;
  telefonoDestinatario: string;
  dniDestinatario: string;
  email: string;
  opcionEntrega: string;
  envio: number;
  fecha: string;
}