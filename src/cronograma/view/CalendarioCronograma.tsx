import React, { useEffect, useState } from 'react';
import type { MaquinaInfo } from '../controller/cronograma-api';
import { obtenerTodasLasMaquinas } from '../controller/cronograma-api';

interface CeldaCronograma {
  maquinaId: string;
  mes: string;
  contenido: string;
}

export const CalendarioCronograma = ({ setSendMaquina, setcargarComponente }: { setSendMaquina?: (maquina: MaquinaInfo) => void; setcargarComponente?: (comp: number) => void }) => {
  const [maquinas, setMaquinas] = useState<MaquinaInfo[]>([]);
  const [celdas, setCeldas] = useState<CeldaCronograma[]>([]);
  const [loading, setLoading] = useState(true);

  const meses = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];

  useEffect(() => {
    cargarMaquinas();
  }, []);

  const cargarMaquinas = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodasLasMaquinas();
      setMaquinas(data);
    } catch (error) {
      console.error('Error cargando máquinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearOrden = (maquina: MaquinaInfo) => {
    if (setSendMaquina) {
      setSendMaquina(maquina);
    }
    if (setcargarComponente) {
      setcargarComponente(18);
    }
  };

  const handleEliminar = (maquinaId: string) => {
    // TODO: Implementar eliminación cuando la API esté lista
    console.log('Eliminar:', maquinaId);
    alert('Funcionalidad de eliminación disponible pronto');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-full py-4 rounded-t-2xl border-b border-blue-200 px-6">
        <h2 className="font-bold text-white text-lg">📅 Cronograma de Mantenimiento</h2>
      </div>

      <div className="overflow-auto p-6 max-h-[600px]">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-semibold text-sm sticky left-0 bg-gray-100 z-10 min-w-40">
                ÁREA
              </th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-sm sticky left-40 bg-gray-100 z-10 min-w-32">
                COD
              </th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-sm sticky left-72 bg-gray-100 z-10 min-w-44">
                MÁQUINA
              </th>
              {meses.map((mes) => (
                <th
                  key={mes}
                  className="border border-gray-300 p-3 text-center font-semibold text-xs min-w-16 bg-gradient-to-b from-blue-50 to-white hover:bg-blue-100 transition-colors"
                >
                  {mes}
                </th>
              ))}
              <th className="border border-gray-300 p-3 text-center font-semibold text-sm sticky right-0 bg-gray-100 z-10 min-w-40">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody>
            {maquinas.map((maquina, idx) => (
              <tr key={maquina.id} className={idx % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                <td className="border border-gray-300 p-3 text-xs font-medium sticky left-0 bg-inherit z-10 truncate">
                  {maquina.area}
                </td>
                <td className="border border-gray-300 p-3 text-xs font-medium sticky left-40 bg-inherit z-10 truncate">
                  {maquina.codigo}
                </td>
                <td className="border border-gray-300 p-3 text-xs font-medium sticky left-72 bg-inherit z-10 truncate">
                  {maquina.nombre}
                </td>

                {meses.map((mes) => (
                  <td
                    key={`${maquina.id}-${mes}`}
                    className="border border-gray-300 p-2 text-center min-w-16 bg-inherit"
                  >
                    {/* Celda vacía por ahora - se llenará cuando la API esté lista */}
                    <div className="text-gray-400 text-xs">-</div>
                  </td>
                ))}

                <td className="border border-gray-300 p-3 text-center sticky right-0 bg-inherit z-10">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button
                      onClick={() => handleCrearOrden(maquina)}
                      className="btn btn-sm btn-primary text-xs whitespace-nowrap"
                      title="Crear orden de mantenimiento"
                    >
                      ➕ Orden
                    </button>
                    <button
                      onClick={() => handleEliminar(maquina.id)}
                      className="btn btn-sm btn-error text-xs whitespace-nowrap"
                      title="Eliminar programación"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {maquinas.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <p className="text-lg font-semibold">No hay máquinas registradas</p>
        </div>
      )}

      {/* Footer con información */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <p className="text-xs text-gray-600">
          <strong>Total de máquinas:</strong> {maquinas.length} | 
          <strong className="ml-4">Nota:</strong> Las celdas vacías se llenarán cuando se creen órdenes de mantenimiento
        </p>
      </div>
    </div>
  );
};
