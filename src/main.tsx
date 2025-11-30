import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { OrdenTrabjoMain } from './orden-de-trabajo/view/OrdenTrabjoMain.tsx'
import { CrearOrden } from './orden-de-trabajo/view/components/CrearOrden.tsx'
import { LoginMain } from './Login/view/LoginMain.tsx'
import { SignUp } from './Login/view/components/SignUp.tsx'
import { NuevosRegistros } from './admin/view/components/NuevosRegistros.tsx'
import { Principal } from './admin/view/Principal.tsx'
import { ProtectRoute } from './Principal/auth/ProtectRoute.tsx'
import { GenerarPdf } from './orden-de-trabajo/view/components/GenerarPdf.tsx'
import { GenerarPdfOrdenCompra } from './orden-de-compra/view/GenerarPdfOrdenCompra.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
     <Route path='/' element={<LoginMain></LoginMain>}></Route> 
     <Route path='/principal' element={<ProtectRoute route={<OrdenTrabjoMain></OrdenTrabjoMain>}></ProtectRoute>}></Route>
     <Route path='/orden-de-trabajo' element={<OrdenTrabjoMain></OrdenTrabjoMain>}></Route>
     <Route path='/crear-orden' element={<CrearOrden></CrearOrden>}></Route>
     <Route path='/login' element={<LoginMain></LoginMain>}></Route>
     <Route path='/registrar' element={<SignUp></SignUp>}></Route>
     <Route path='/admin' element={<ProtectRoute route={<Principal></Principal>}></ProtectRoute>}></Route>
     <Route path='/pdf/:id' element={<GenerarPdf></GenerarPdf>}></Route>
     <Route path='/pdf-compra/:id' element={<GenerarPdfOrdenCompra></GenerarPdfOrdenCompra>}></Route>
    </Routes>
    
    </BrowserRouter>
   
  </StrictMode>,
)
