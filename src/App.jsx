// src\App.jsx

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import ThemeController from './components/ThemeController'
import NavBar from './components/NavBar'
import Profile from './components/Profile'
import Menu from './components/Menu'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InventoryManagement from './pages/InventoryManagement'
import Orders from './pages/Orders'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'
import HelpSupport from './pages/HelpSupport'
import Analysis from './pages/Analysis'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        {/* Left Sidebar Menu */}
        <div className="w-64 h-full bg-white shadow-lg">
          <Menu/>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <NavBar />
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/help-support" element={<HelpSupport />} />
              <Route path="/analysis" element={<Analysis />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
