// TODO: Implementar estas funciones cuando la API esté disponible

import { getAllInfoAreas } from "../../admin/controller/api/admin-api";
import type { Area } from "../../admin/models/areas.dto";

const route: string = import.meta.env.VITE_API_URL || "http://localhost:3000/";

export interface MaquinaInfo {
  id: string;
  codigo: string;
  nombre: string;
  area: string;
}

/**
 * Obtiene todas las máquinas con su información de áreas
 * Usa la API getAllInfoAreas del módulo admin
 */
export const obtenerTodasLasMaquinas = async (): Promise<MaquinaInfo[]> => {
  try {
    const areas = await getAllInfoAreas();
    const maquinas: MaquinaInfo[] = [];

    areas.forEach((area: Area) => {
      area.codigo.forEach((codigo) => {
        codigo.maquina.forEach((maquina) => {
          maquinas.push({
            id: maquina.id.toString(),
            codigo: codigo.cod,
            nombre: maquina.nombre,
            area: area.nombre,
          });
        });
      });
    });

    return maquinas;
  } catch (error) {
    console.error('Error en obtenerTodasLasMaquinas:', error);
    throw error;
  }
};

/**
 * Obtiene el cronograma de una máquina específica
 * TODO: Implementar cuando la API esté disponible
 */
export const obtenerCronogramaMaquina = async (maquinaId: string): Promise<any> => {
  try {
    // const response = await fetch(`${route}cronograma/maquina/${maquinaId}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error('Error al obtener cronograma');
    // }
    
    // const data = await response.json();
    // return data;

    return null;
  } catch (error) {
    console.error('Error en obtenerCronogramaMaquina:', error);
    throw error;
  }
};

/**
 * Crea una nueva entrada en el cronograma
 * TODO: Implementar cuando la API esté disponible
 */
export const crearCronograma = async (datoCronograma: any): Promise<{ msj: string; validate: boolean }> => {
  try {
    // const response = await fetch(`${route}cronograma/create`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(datoCronograma)
    // });
    
    // if (!response.ok) {
    //   throw new Error('Error al crear cronograma');
    // }
    
    // const data = await response.json();
    // return data;

    console.log('Datos de cronograma a crear:', datoCronograma);
    return { msj: 'Cronograma creado exitosamente', validate: true };
  } catch (error) {
    console.error('Error en crearCronograma:', error);
    throw error;
  }
};

/**
 * Elimina una entrada del cronograma
 * TODO: Implementar cuando la API esté disponible
 */
export const eliminarCronograma = async (cronogramaId: string): Promise<{ msj: string; validate: boolean }> => {
  try {
    // const response = await fetch(`${route}cronograma/${cronogramaId}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error('Error al eliminar cronograma');
    // }
    
    // const data = await response.json();
    // return data;

    console.log('Eliminando cronograma:', cronogramaId);
    return { msj: 'Cronograma eliminado exitosamente', validate: true };
  } catch (error) {
    console.error('Error en eliminarCronograma:', error);
    throw error;
  }
};

/**
 * Obtiene los estados disponibles para el cronograma
 * TODO: Implementar cuando la API esté disponible
 */
export const obtenerEstados = async (): Promise<any[]> => {
  try {
    // const response = await fetch(`${route}cronograma/estados`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error('Error al obtener estados');
    // }
    
    // const data = await response.json();
    // return data;

    return [];
  } catch (error) {
    console.error('Error en obtenerEstados:', error);
    throw error;
  }
};

/**
 * Obtiene todos los tipos de mantenimiento (MC, MP, etc.)
 */
export const obtenerTiposMantenimiento = async (): Promise<{ id: number; inicial: string; mantenimiento: string }[]> => {
  try {
    const response = await fetch(`${route}parametro/tipos-mantenimiento`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener tipos de mantenimiento');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en obtenerTiposMantenimiento:', error);
    return [];
  }
};

/**
 * Obtiene todos los períodos disponibles
 */
export const obtenerPeriodos = async (): Promise<{ id: number; nombre: string }[]> => {
  try {
    const response = await fetch(`${route}parametro/periodos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener períodos');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en obtenerPeriodos:', error);
    return [];
  }
};
