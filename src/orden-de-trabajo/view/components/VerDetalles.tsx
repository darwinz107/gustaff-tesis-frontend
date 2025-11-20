
import React from 'react'

export const VerDetalles = ({setventanaEmergente,ventanaEmergente}) => {
    return (
        <>
            <div className={`z-10 border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white top-[50%] left-[50%]  ${!ventanaEmergente ? "-translate-x-1/2 -translate-y-[200%]" : "-translate-x-1/2 -translate-y-[50%]"} `}>
            <div className='w-full h-[15%] flex justify-between p-5 bg-yellow-200'>
                 <div>Listado de ordenes</div>
                 <div onClick={() => { setventanaEmergente(!ventanaEmergente); console.log(ventanaEmergente) }} className='cursor-pointer'>❌</div>
            </div>
            <div className='w-full h-[70%] border border-gray-300 px-4 bg-blue-200'>
                <div></div>  
            </div>
            </div>
        </>
    )
}
