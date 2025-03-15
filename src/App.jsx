// src\App.jsx

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import ThemeController from './components/ThemeController'
import NavBar from './components/navBar'
import Profile from './components/Profile'
import Menu from './components/Menu'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
