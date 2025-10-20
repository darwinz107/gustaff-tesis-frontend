import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { OrdenTrabjoMain } from './orden-de-trabajo/view/OrdenTrabjoMain.tsx'
import { CrearOrden } from './orden-de-trabajo/view/components/CrearOrden.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
     <Route path='/' element={<App />}></Route> 
     <Route path='/orden-de-trabajo' element={<OrdenTrabjoMain></OrdenTrabjoMain>}></Route>
     <Route path='/crear-orden' element={<CrearOrden></CrearOrden>}></Route>
    </Routes>
    
    </BrowserRouter>
   
  </StrictMode>,
)
