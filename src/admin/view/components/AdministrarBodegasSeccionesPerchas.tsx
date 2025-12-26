import React, { useEffect, useState } from 'react'
import { crearBodega, crearSeccion, crearPercha, getAllBodegas, getAllSecciones, getPerchasBySeccion, actualizarBodega, actualizarSeccion, actualizarPercha, eliminarBodega, eliminarSeccion, eliminarPercha } from '../../controller/api/admin-api';

interface Bodega {
  id?: number;
  bodega: string;
}

interface Seccion {
  id?: number;
  seccion: string;
  bodegaId?: number;
  bodega?: string;
}

interface Percha {
  id?: number;
  percha: string;
  seccionId?: number;
  seccion?: string;
}

export const AdministrarBodegasSeccionesPerchas = () => {


  return(
    <div>AdministrarBodegasSeccionesPerchas</div>
  );
};
