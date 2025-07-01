export enum talle{
    S,
    M,
    L,
    XL,
    XXL,
    XXXL
}

export enum categoria{
    JEAN,
    BUZO,
    CAMPERA,
    REMERA,
    SHORT,
    OTRO
}

export interface Prenda {
    id: number;
    nombre: String;
    precio: number;
    talles: Record<talle, number>
    categoria: categoria;
    imagen: string;
}