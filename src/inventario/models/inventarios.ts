export interface Inventarios {

    id: number;
    nombre: string;
    stock: number;
    costo: number;
    estado: boolean;
    imagen: string;
    bodega: { id: number; bodega: string };
}