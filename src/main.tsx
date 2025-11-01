import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { OrdenTrabjoMain } from './orden-de-trabajo/view/OrdenTrabjoMain.tsx'
import { CrearOrden } from './orden-de-trabajo/view/components/CrearOrden.tsx'
import { LoginMain } from './Login/view/LoginMain.tsx'
import { SignUp } from './Login/view/components/SignUp.tsx'
import { NuevosRegistros } from './admin/view/NuevosRegistros.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
     <Route path='/' element={<LoginMain></LoginMain>}></Route> 
     <Route path='/principal' element={<App></App>}></Route>
     <Route path='/orden-de-trabajo' element={<OrdenTrabjoMain></OrdenTrabjoMain>}></Route>
     <Route path='/crear-orden' element={<CrearOrden></CrearOrden>}></Route>
     <Route path='/login' element={<LoginMain></LoginMain>}></Route>
     <Route path='/registrar' element={<SignUp></SignUp>}></Route>
     <Route path='/admin' element={<NuevosRegistros></NuevosRegistros>}></Route>
    </Routes>
    
    </BrowserRouter>
   
  </StrictMode>,
)
