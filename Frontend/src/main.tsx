import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ErrorPage} from './pages/ErrorPage.tsx'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Home from './pages/Home.tsx'

import { Route, createBrowserRouter, createRoutesFromElements,RouterProvider } from 'react-router'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage/>}>
    <Route index element={<Home/>} />  
    <Route path="/login" element={<Login/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
