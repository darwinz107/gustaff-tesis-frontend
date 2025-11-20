
import React, { useState } from 'react'

export const HistorialOrdenes = ({setValidate}) => {

   

    return (
        <>
            <div className='border border-gray-300 w-4/5 h-4/5 rounded-sm'>
                <div className='w-full bg-gray-300 text-center rounded-t-sm'>Listado de ordenes de trabajo</div>
                <div className="overflow-x-auto mt-10">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr className='bg-gray-300'>

                                <th>Name</th>
                                <th>Job</th>
                                <th>Favorite Color</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            <tr>

                                <td>Cy Ganderton</td>
                                <td>Quality Control Specialist</td>
                                <td>Blue</td>
                                <td onClick={() => {setValidate(true);}} className='cursor-pointer'>🔎</td>
                            </tr>
                            {/* row 2 */}
                            <tr className="hover:bg-base-300">

                                <td>Hart Hagerty</td>
                                <td>Desktop Support Technician</td>
                                <td>Purple</td>
                                <td>🔎</td>
                            </tr>
                            {/* row 3 */}
                            <tr>

                                <td>Brice Swyre</td>
                                <td>Tax Accountant</td>
                                <td>Red</td>
                                <td>🔎</td>
                            </tr>
                            <tr>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            
        </>
    )
}
