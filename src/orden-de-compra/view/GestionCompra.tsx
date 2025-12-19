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
      Destino: detalleSol.Destino,
      ordenTrabajoId: nOrdenTrabajo,
      estadoCompra: detalleSol.estadoCompra.estado
    });
    alert(res.msj);
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
      <div className="min-w-[70%] min-h-[60%] rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-gray-100 w-full h-12 flex items-center justify-between rounded-t-lg border-b px-4">
          <p className="font-semibold text-gray-700">Listado de solicitud de materiales</p>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-ghost" onClick={() => ordenesTrabajoApi()}>Refrescar</button>
             <button className="btn btn-sm btn-ghost" onClick={limpiarFiltros}>Limpiar</button>
            <button className="btn btn-sm btn-primary" onClick={aplicarFiltros}>Aplicar</button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Buscar:</label>
              <input className="input input-sm" type="text" placeholder="NumOrden" value={filtroNumOrden} onChange={(e) => setFiltroNumOrden(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input className="input input-sm" type="text" placeholder="Solicitante" value={filtroSolicitante} onChange={(e) => setFiltroSolicitante(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Fecha de remision</label>
              <input className="input input-sm" type="date"  value={filtroFechaRemision} onChange={(e) => setFiltroFechaRemision(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end items-center gap-2">
            <select className="select select-sm" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="">Todos</option>
              {estados.map(s => <option key={s.id} value={s.estado}>{s.estado}</option>)}
            </select>
            <input className="input input-sm" placeholder="Orden trabajo" value={filtroNumOrdenTrabajo} onChange={(e) => setFiltroNumOrdenTrabajo(e.target.value)} />
           
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="overflow-hidden border rounded-lg">
            <div className="max-h-[520px] overflow-auto">
              <table className="table w-full min-w-full">
                <thead className="bg-white sticky top-0 z-20">
                  <tr className="text-sm text-left text-gray-600">
                    <th className="px-4 py-3">N.Orden</th>
                    <th className="px-4 py-3">Fecha de remision</th>
                    <th className="px-4 py-3">Solicitante</th>
                    <th className="px-4 py-3">Descripcion</th>
                    <th className="px-4 py-3">Estado de Entrega</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesCompra.map((u) => (
                    <tr key={u.id} className="even:bg-gray-50 hover:bg-gray-100">
                      <td className="px-4 py-3 align-top">{u.numOrden}</td>
                      <td className="px-4 py-3 align-top">{u.fechaRemision ? u.fechaRemision.split("T")[0] : ""}</td>
                      <td className="px-4 py-3 align-top">{u.numOrdenTrabajo?.userSolicitante?.name}</td>
                      <td className="px-4 py-3 align-top">{u.numOrdenTrabajo?.DescripcionTrabajo}</td>
                      <td className="px-4 py-3 align-top">{u.estadoCompra?.estado}</td>
                      <td className="px-4 py-3 align-top text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="btn btn-outline btn-sm" onClick={() => { setventanaEmergente(true); cargarSolicitud(u.id); }}>Detalles</button>
                          <button className="btn btn-outline btn-sm" onClick={() => metodoEliminarSolMateriales(u.id)}>Eliminar</button>
                          <button className="btn btn-outline btn-sm" onClick={() => cargarPdf(u.numOrdenTrabajo?.id)}>Ver pdf</button>
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
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative border border-gray-300 w-11/12 max-w-6xl h-[85vh] rounded-md bg-white shadow-lg overflow-auto">
          <div className="w-full h-[12%] flex justify-between p-5 border-b">
            <div className="font-medium text-gray-700">Detalle de orden de materiales</div>
            <div onClick={() => { setventanaEmergente(!ventanaEmergente); }} className="cursor-pointer">❌</div>
          </div>

          <div className="w-full h-[76%] px-6 py-4 flex flex-col">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">N.Orden</p>
                <input type="text" disabled className="input w-full mt-1" value={detalleSol?.numOrden} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Fecha de remision</p>
                <button disabled type="button" className="input input-border w-full text-left mt-1" id="cally4" style={{ anchorName: "--cally4" }}>
                  {detalleSol.fechaRemision ? detalleSol.fechaRemision.split("T")[0] : ""}
                </button>
              </div>

              <div>
                <p className="text-xs text-gray-500">Estado</p>
                <select disabled={!habilitarEdicion} value={detalleSol?.estadoCompra?.estado} className="select w-full mt-1"
                  onChange={(e) => { setdetalleSol((prev) => ({ ...prev, estadoCompra: { estado: e.target.value } } as any)); setconfirmarCambio(false); }}>
                  <option disabled>...</option>
                  {estados.map((s) => <option key={s.id} value={s.estado}>{s.estado}</option>)}
                </select>
              </div>

              <div>
                <p className="text-xs text-gray-500">N.Orden de trabajo</p>
                <select disabled={!habilitarEdicion} className="select w-full mt-1" value={nOrdenTrabajo} onChange={(e) => { setnOrdenTrabajo(e.target.value); setconfirmarCambio(false); }}>
                  <option disabled>...</option>
                  {ordenesTrabajo.map((o) => <option key={o.NumOrden} value={o.NumOrden}>{o.NumOrden}</option>)}
                </select>
              </div>

              <div>
                <p className="text-xs text-gray-500">Destino</p>
                <input type="text" disabled={!habilitarEdicion} className="input w-full mt-1" value={detalleSol?.Destino} onChange={(e) => { setdetalleSol((prev) => ({ ...prev, Destino: e.target.value } as any)); setconfirmarCambio(false); }} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Autoriza</p>
                <select disabled={!habilitarEdicion} className="select w-full mt-1" value={detalleSol?.Autoriza} onChange={(e) => { setdetalleSol((prev) => ({ ...prev, Autoriza: e.target.value } as any)); setconfirmarCambio(false); }}>
                  <option disabled>...</option>
                  {users.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                </select>
              </div>

              <div className="col-span-3">
                <p className="text-xs text-gray-500">Solicitante</p>
                <input type="text" disabled className="input w-full mt-1" value={detalleSol.numOrdenTrabajo?.userSolicitante?.name ?? ""} />
              </div>
            </div>

            <div className="overflow-auto mt-5">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Cantidad</th>
                    <th>Caracteristica</th>
                    <th>Observacion</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {detalleSol?.itemSolicitados?.map((is, idx) => (
                    <tr key={idx}>
                      <td>{is.item}</td>
                      <td>{is.cantidad}</td>
                      <td>{is.caracteristica}</td>
                      <td>{is.Observacion}</td>
                      <td>{is.existencia ? "EN STOCK" : "NO DISPONIBLE"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          <div className="w-full h-[12%] flex justify-between items-center px-6 border-t">
            {habilitarEdicion ? (
              <>
                <button className="btn btn-primary" onClick={actSolicitudMaterial} disabled={confirmarCambio}>Hecho</button>
                <button className="btn" onClick={() => { sethabilitarEdicion(!habilitarEdicion); cargarSolicitud(detalleSol.id); setconfirmarCambio(true); }}>Cancelar</button>
              </>
            ) : (
              <>
                <button className="btn" onClick={() => { sethabilitarEdicion(!habilitarEdicion); }}>Editar</button>
                <button className="btn btn-ghost" onClick={() => { setventanaEmergente(!ventanaEmergente); }}>Cerrar</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
