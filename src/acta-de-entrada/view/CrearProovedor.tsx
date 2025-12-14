import React from 'react'

export const CrearProovedor = ({setventanaAgregarProovedor,ventanaAgregarProovedor}) => {
  return (
    <>
    <div className="bg-base-100 p-6">
  <header className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-semibold">Registrar proveedor</h3>
      <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={() => { setventanaAgregarProovedor(!ventanaAgregarProovedor) }}
      aria-label="Cerrar"
    >
      ✕
    </button>
  </header>

  <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); }}>
    <div className="form-control">
      <label className="label"><span className="label-text">Razón social / Nombre</span></label>
      <input name="razonSocial" placeholder="Razón social" className="input input-bordered w-full" />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Nombre comercial</span></label>
      <input name="nombreComercial" placeholder="Nombre comercial" className="input input-bordered w-full" />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">RUC / NIT</span></label>
      <input name="ruc" placeholder="RUC / NIT" className="input input-bordered w-full" />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Contacto</span></label>
      <input name="contacto" placeholder="Nombre de la persona de contacto" className="input input-bordered w-full" />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Email</span></label>
      <input name="email" type="email" placeholder="correo@ejemplo.com" className="input input-bordered w-full" />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Teléfono</span></label>
      <input name="telefono" placeholder="+593 9..." className="input input-bordered w-full" />
    </div>

    <div className="form-control md:col-span-2">
      <label className="label"><span className="label-text">Dirección</span></label>
      <input name="direccion" placeholder="Av. Principal #123" className="input input-bordered w-full" />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Ciudad</span></label>
      <input name="ciudad" placeholder="Guayaquil" className="input input-bordered w-full" />
    </div>

    <div className="form-control md:col-span-2">
      <label className="label"><span className="label-text">Notas</span></label>
      <textarea name="notas" placeholder="Notas internas, condiciones especiales..." className="textarea textarea-bordered w-full" rows={3} />
    </div>

   

    <div className="md:col-span-2 flex justify-end gap-2 mt-2">
      <button type="button" className="btn btn-ghost" onClick={() => {setventanaAgregarProovedor(!ventanaAgregarProovedor)  }}>
        Cancelar
      </button>
      <button type="submit" className="btn btn-primary">
        Guardar proveedor
      </button>
    </div>
  </form>
</div>
    </>
  )
}
