// src\App.jsx

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import ThemeController from './components/ThemeController'
import NavBar from './components/navBar'
import Profile from './components/Profile'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {


  return (
    <>

      <div className="grid grid-cols-12 grid-rows-5 gap-4">
        <div className="col-span-12">
          <NavBar />
        </div>
        <div className="col-span-2 row-span-4 row-start-2">
          2
        </div>
        <div className="col-span-10 row-span-4 col-start-3 row-start-2">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter></div>
      </div>


    </>
  )
}

export default App
