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
import { Rol1Main } from './rol1/view/rol1Main.tsx'
import { Rol2Main } from './rol2/view/Rol2Main.tsx'
import { ProtectRouteAdmin } from './Principal/auth/ProtectRouteAdmin.tsx'
import { ProtectRoute2 } from './Principal/auth/ProtectRoute2.tsx'
import { GenerarPdfActaDeSalida } from './acta-de-salida/view/GenerarPdfActaDeSalida.tsx'
import { GenerarPdfActaDeEntrada } from './acta-de-entrada/view/GenerarPdfActaDeEntrada.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
     <Route path='/' element={<LoginMain></LoginMain>}></Route> 
     <Route path='/principal1' element={<ProtectRoute route={<Rol1Main></Rol1Main>}></ProtectRoute>}></Route>
     <Route path='/principal2' element={<ProtectRoute2 route={<Rol2Main></Rol2Main>}></ProtectRoute2>}></Route>
     <Route path='/orden-de-trabajo' element={<OrdenTrabjoMain></OrdenTrabjoMain>}></Route>
     
     <Route path='/login' element={<LoginMain></LoginMain>}></Route>
     <Route path='/registrar' element={<SignUp></SignUp>}></Route>
     <Route path='/admin' element={<ProtectRouteAdmin route={<Principal></Principal>}></ProtectRouteAdmin>}></Route>
     <Route path='/pdf/:id' element={<GenerarPdf></GenerarPdf>}></Route>
     <Route path='/pdf-compra/:id' element={<GenerarPdfOrdenCompra></GenerarPdfOrdenCompra>}></Route>
     <Route path='/pdf-salida/:id' element={<GenerarPdfActaDeSalida></GenerarPdfActaDeSalida>}></Route>
     <Route path='/pdf-entrada/:id' element={<GenerarPdfActaDeEntrada></GenerarPdfActaDeEntrada>}></Route>
     
    </Routes>
    
    </BrowserRouter>
   
  </StrictMode>,
)
