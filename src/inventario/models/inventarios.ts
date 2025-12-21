export interface Inventarios {

    id: number;
    nombre: string;
    stock: number;
    costo: number;
    estado: boolean;
    bodega: { id: number; bodega: string };
}