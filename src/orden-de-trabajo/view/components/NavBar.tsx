import React from 'react'
import { Link } from 'react-router-dom'

export const NavBar = () => {
  return (
    <>
    <nav className='bg-gray-200'>
        <ul className='flex flex-row space-x-4 ml-10'>
            <li className='cursor-pointer hover:bg-sky-700' ><Link to={'/crear-orden'}>Crear orden</Link></li>
            <li className='cursor-pointer hover:bg-sky-700' >Ver ordenes</li>
        </ul>
    </nav>
    </>
  )
}
