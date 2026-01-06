export interface Inventarios {

    id: number;
    nombre: string;
    stock: number;
    costo: number;
    estado: boolean;
    imagen: string;
    stockMin: number;
    bodega: { id: number; bodega: string };
    seccion: { id: number; seccion: string };
    percha: { id: number; percha: string };
}