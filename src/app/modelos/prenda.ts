export enum Talle {
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
  }
  
  export enum Categoria {
    JEAN = 'JEAN',
    BUZO = 'BUZO',
    CAMPERA = 'CAMPERA',
    REMERA = 'REMERA',
    SHORT = 'SHORT',
    OTRO = 'OTRO'
  }
  
  export interface Prenda {
    id: number;
    nombre: string;
    precio: number;
    talles: Record<Talle, number>;
    categoria: Categoria;
    imagenPrincipal: string;
    imagenesSecundarias?: string[];
  }
  