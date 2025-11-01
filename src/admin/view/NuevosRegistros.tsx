


export const NuevosRegistros = () => {
  

  
    return (
    <>
       
      
      <div className='flex relative h-screen w-auto bg-pink-200'>
        <div className='absolute inset-y-0 left-0 h-full w-1/5 z-20 bg-white border-r border-gray-300 flex flex-col'>
        <img src="public\gustaff_logo.jpg" className='cursor-pointer mb-7' alt="Gustaff S.A" />
        <div className='flex flex-col h-full'> 
           <button className="btn w-full hover: bg-gray-400" >Nuevo registro</button>
      <button className="btn w-full" >Editar</button>
      <button className="btn w-full" >Eliminar</button>
      </div>
        </div>
        <div className='h-full w-1/5 bg-white'>
          xd
        </div>
        <div className='flex items-center justify-center w-4/5 bg-white h-full'>
         <form className="w-150 h-150 border border-gray-200 bg-gray-50 flex flex-col justify-center" action="" method="post">
          
          <div className="flex flex-col items-center justify-center border-b border-gray-200"><div><label htmlFor="">Nueva area </label><input type="text" className="input"/>
          
          </div><button className="btn my-4">Guardar</button>
          </div>  
          <div className="flex flex-col items-center justify-center border-b border-gray-200"><div><label htmlFor="">Nueva maquina </label><input type="text" className="input"/></div>
                <div><label htmlFor="">Area </label> <select className="select" id=""><option defaultValue={"..."} disabled={true}>...</option></select></div>
                <button className="btn my-4">Guardar</button>
          </div>
         
         </form>
     </div>
</div>

    </>
  )
}
