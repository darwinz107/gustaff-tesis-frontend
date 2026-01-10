import React, { useEffect, useRef, useState } from 'react'
import type { DetallesPrevioCompra } from '../models/DetallesPrevioCompra';
import { editarSolicitudMaterial, eliminarSolMaterial, findAllSolicitudesCompra, getAllEstadosCompra, ordenCompraById, filtrarSolicitudesCompra } from '../controller/ordenCompraApi';
import type { InfoPdfCompra } from '../models/infoPdfCompra';
import { getUsers } from '../../user/controller/api/user-api';
import type { Users } from '../../admin/models/users';
import { allOrdenTrabajoNumOrden } from '../../orden-de-trabajo/controller/api/orden-api';

export const GestionCompra = () => {
  const [ordenesCompra, setordenesCompra] = useState<DetallesPrevioCompra[]>([]);
  const [validarCambio, setvalidarCambio] = useState(false);
  const [habilitarEdicion, sethabilitarEdicion] = useState(false);
  const callyPpopover4 = useRef(null);
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [ventanaCrearUsuario, setventanaCrearUsuario] = useState(false);
  const [detalleSol, setdetalleSol] = useState<InfoPdfCompra>({ itemSolicitados: [] });
  const [confirmarCambio, setconfirmarCambio] = useState(true);
  const [users, setusers] = useState<Users[]>([]);
  const [ordenesTrabajo, setordenesTrabajo] = useState<{ NumOrden: string }[]>([]);
  const [nOrdenTrabajo, setnOrdenTrabajo] = useState("");
  const [estados, setestados] = useState<{ id: number; estado: string }[]>([]);


  const [filtroNumOrden, setFiltroNumOrden] = useState("");
  const [filtroSolicitante, setFiltroSolicitante] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFechaRemision, setFiltroFechaRemision] = useState("");
  const [filtroNumOrdenTrabajo, setFiltroNumOrdenTrabajo] = useState("");

  const ordenesTrabajoApi = async () => {
    const res = await findAllSolicitudesCompra();
    setordenesCompra(res || []);
    const res2 = await allOrdenTrabajoNumOrden();
    setordenesTrabajo(res2 || []);
  };

  useEffect(() => {
    ordenesTrabajoApi();

    const getAllUsers = async () => {
      const res = await getUsers();
      setusers(res || []);
    };
    getAllUsers();

    const getAllEstados = async () => {
      const res = await getAllEstadosCompra();
      setestados(res || []);
    };
    getAllEstados();
  }, []);

  const cargarSolicitud = async (id: number) => {
    const res = await ordenCompraById(id);
    setdetalleSol(res);
    setnOrdenTrabajo(res.numOrdenTrabajo?.NumOrden ?? "");
  };

  const actSolicitudMaterial = async () => {
    const res = await editarSolicitudMaterial(detalleSol.id, {
      Autoriza: detalleSol.Autoriza,
     
      ordenTrabajoId: nOrdenTrabajo,
      estadoCompra: detalleSol.estadoCompra.estado
    });
    alert(res.msj);
    console.log(res);
    if (res.validate) {
      await ordenesTrabajoApi();
      await cargarSolicitud(detalleSol.id);
      sethabilitarEdicion(!habilitarEdicion);
      setconfirmarCambio(true);
    }
  };

  const metodoEliminarSolMateriales = async (id: number) => {
    const res = await eliminarSolMaterial(id);
    await ordenesTrabajoApi();
    alert(res.msj);
  };

  const cargarPdf = (id: number) => {
    window.open(`/pdf-compra/${id}`, "_blank");
  };

  const aplicarFiltros = async () => {
    const filtros = {
      numOrden: filtroNumOrden || undefined,
      fechaRemision: filtroFechaRemision || undefined,
      solicitante: filtroSolicitante || undefined,
      numOrdenTrabajo: filtroNumOrdenTrabajo || undefined,
      estadoCompra: filtroEstado || undefined
    };
    const res = await filtrarSolicitudesCompra(filtros);
    setordenesCompra(res || []);
  };

  const limpiarFiltros = async () => {
    setFiltroNumOrden("");
    setFiltroSolicitante("");
    setFiltroEstado("");
    setFiltroFechaRemision("");
    setFiltroNumOrdenTrabajo("");
    await ordenesTrabajoApi();
  };

  return (
    <>
      <div className="w-full h-full rounded-2xl border border-gray-200 bg-white shadow-lg overflow-auto">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-full py-4 rounded-t-2xl border-b border-orange-200 px-6 sticky top-0 z-10">
          <h2 className="font-bold text-white text-lg">📑 Solicitud de Materiales</h2>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">Filtros:</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Nº Orden</label>
                <input className="input input-sm input-bordered focus:input-primary rounded-lg" type="text" placeholder="Buscar..." value={filtroNumOrden} onChange={(e) => setFiltroNumOrden(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Solicitante</label>
                <input className="input input-sm input-bordered focus:input-primary rounded-lg" type="text" placeholder="Buscar..." value={filtroSolicitante} onChange={(e) => setFiltroSolicitante(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Fecha de remisión</label>
                <input className="input input-sm input-bordered focus:input-primary rounded-lg" type="date" value={filtroFechaRemision} onChange={(e) => setFiltroFechaRemision(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Estado</label>
              <select className="select select-sm select-bordered focus:select-primary rounded-lg" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="">Todos</option>
                {estados.map(s => <option key={s.id} value={s.estado}>{s.estado}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Orden trabajo</label>
              <input className="input input-sm input-bordered focus:input-primary rounded-lg" placeholder="Buscar..." value={filtroNumOrdenTrabajo} onChange={(e) => setFiltroNumOrdenTrabajo(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="px-6 py-3 flex items-center justify-end gap-2 bg-gray-50 border-b border-gray-200">
          <button className="btn btn-sm btn-ghost hover:btn-primary gap-2" onClick={() => ordenesTrabajoApi()}>🔄 Refrescar</button>
          <button className="btn btn-sm btn-ghost hover:btn-warning gap-2" onClick={limpiarFiltros}>✕ Limpiar</button>
          <button className="btn btn-sm btn-primary gap-2" onClick={aplicarFiltros}>✓ Aplicar</button>
        </div>

        <div className="px-6 pb-6 pt-4">
          <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
            <div className="max-h-[520px] overflow-auto">
              <table className="table w-full min-w-full">
                <thead className="bg-gradient-to-r from-orange-50 to-orange-100 sticky top-0 z-20">
                  <tr className="text-sm text-left text-gray-700 font-semibold">
                    <th className="px-4 py-3">Nº Orden</th>
                    <th className="px-4 py-3">Fecha remisión</th>
                    <th className="px-4 py-3">Solicitante</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesCompra.map((u) => (
                    <tr key={u.id} className="border-t border-gray-100 hover:bg-orange-50 transition-colors">
                      <td className="px-4 py-3 align-top font-semibold text-gray-800">{u.numOrden}</td>
                      <td className="px-4 py-3 align-top text-gray-700">{u.fechaRemision ? u.fechaRemision.split("T")[0] : ""}</td>
                      <td className="px-4 py-3 align-top text-gray-700">{u.numOrdenTrabajo?.userSolicitante?.name ?? "N/A"}</td>
                      <td className="px-4 py-3 align-top text-gray-700 text-sm">{u.numOrdenTrabajo?.DescripcionTrabajo}</td>
                      <td className="px-4 py-3 align-top"><span className="badge badge-warning gap-2">{u.estadoCompra?.estado}</span></td>
                      <td className="px-4 py-3 align-top text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button className="btn btn-sm btn-info btn-outline gap-1 tooltip" data-tip="Ver detalles" onClick={() => { setventanaEmergente(true); cargarSolicitud(u.id); }}>👁️</button>
                          <button className="btn btn-sm btn-error btn-outline gap-1 tooltip" data-tip="Eliminar" onClick={() => metodoEliminarSolMateriales(u.id)}>🗑️</button>
                          <button className="btn btn-sm btn-success btn-outline gap-1 tooltip" data-tip="Descargar PDF" onClick={() => cargarPdf(u.numOrdenTrabajo?.id)}>📄</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {ordenesCompra.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-sm text-gray-500 py-8">No hay solicitudes</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative border border-gray-300 w-11/12 max-w-6xl h-[85vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-full py-4 px-6 flex justify-between items-center border-b border-orange-200">
            <h2 className="font-bold text-white text-lg">📑 Detalles de Solicitud de Material</h2>
            <button onClick={() => { setventanaEmergente(!ventanaEmergente); }} className="btn btn-circle btn-ghost btn-sm text-white hover:bg-orange-700">✕</button>
          </div>

          {/* Content */}
          <div className="w-full flex-1 overflow-auto px-6 py-6 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Nº Orden</label>
                <input type="text" disabled className="input input-sm input-bordered rounded-lg bg-gray-100" value={detalleSol?.numOrden} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de Remisión</label>
                <input type="text" disabled className="input input-sm input-bordered rounded-lg bg-gray-100" value={detalleSol.fechaRemision ? detalleSol.fechaRemision.split("T")[0] : ""} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</label>
                <select disabled={!habilitarEdicion} value={detalleSol?.estadoCompra?.estado} className="select select-sm select-bordered focus:select-primary rounded-lg"
                  onChange={(e) => { setdetalleSol((prev) => ({ ...prev, estadoCompra: { estado: e.target.value } } as any)); setconfirmarCambio(false); }}>
                  <option disabled>Seleccionar...</option>
                  {estados.map((s) => <option key={s.id} value={s.estado}>{s.estado}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Nº Orden de Trabajo</label>
                <select disabled={!habilitarEdicion} className="select select-sm select-bordered focus:select-primary rounded-lg" value={nOrdenTrabajo} onChange={(e) => { setnOrdenTrabajo(e.target.value); setconfirmarCambio(false); }}>
                  <option disabled value="">Seleccionar...</option>
                  {ordenesTrabajo.map((o) => <option key={o.NumOrden} value={o.NumOrden}>{o.NumOrden}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</label>
                <input type="text" disabled className="input input-sm input-bordered rounded-lg bg-gray-100" value={detalleSol?.numOrdenTrabajo?.DescripcionTrabajo ?? "N/A"} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Autoriza</label>
                <select disabled={!habilitarEdicion} className="select select-sm select-bordered focus:select-primary rounded-lg" value={detalleSol?.Autoriza ?? ""} onChange={(e) => { setdetalleSol((prev) => ({ ...prev, Autoriza: e.target.value } as any)); setconfirmarCambio(false); }}>
                  <option value="" disabled>Seleccionar...</option>
                  {users.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2 lg:col-span-3">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Solicitante</label>
                <input type="text" disabled className="input input-sm input-bordered rounded-lg bg-gray-100" value={detalleSol.numOrdenTrabajo?.userSolicitante?.name ?? "N/A"} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-4">📋 Detalles de Items Solicitados</h3>
              <div className="overflow-x-auto">
                <table className="table w-full text-sm">
                  <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
                    <tr className="text-xs font-semibold text-gray-700">
                      <th className="px-3 py-3">Item</th>
                      <th className="px-3 py-3 text-right">Cantidad</th>
                      <th className="px-3 py-3">Característica</th>
                      <th className="px-3 py-3">Observación</th>
                      <th className="px-3 py-3 text-center">Disponibilidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalleSol?.itemSolicitados?.map((is, idx) => (
                      <tr key={idx} className="border-t border-gray-100 hover:bg-orange-50 transition-colors">
                        <td className="px-3 py-3 font-medium text-gray-800">{is.item}</td>
                        <td className="px-3 py-3 text-right text-gray-700">{is.cantidad}</td>
                        <td className="px-3 py-3 text-gray-700">{is.caracteristica ?? "N/A"}</td>
                        <td className="px-3 py-3 text-gray-700 text-xs">{is.Observacion ?? "N/A"}</td>
                        <td className="px-3 py-3 text-center"><span className={`badge badge-sm ${is.existencia ? 'badge-success' : 'badge-error'}`}>{is.existencia ? "✓ EN STOCK" : "✕ NO DISP."}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            {habilitarEdicion ? (
              <>
                <button className="btn btn-primary gap-2" onClick={actSolicitudMaterial} disabled={confirmarCambio}>💾 Guardar Cambios</button>
                <button className="btn btn-ghost gap-2" onClick={() => { sethabilitarEdicion(!habilitarEdicion); cargarSolicitud(detalleSol.id); setconfirmarCambio(true); }}>↶ Cancelar</button>
              </>
            ) : (
              <>
                <button className="btn btn-warning gap-2" onClick={() => { sethabilitarEdicion(!habilitarEdicion); }}>✏️ Editar</button>
                <button className="btn btn-ghost gap-2" onClick={() => { setventanaEmergente(!ventanaEmergente); }}>Cerrar</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
