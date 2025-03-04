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

      <div className="grid grid-cols-6 grid-rows-5 gap-2 h-screen">

        <div className="col-span-5 bg-red-500">
         
      <NavBar/>
         
        </div>
        <div className="col-start-6 bg-green-500">

        <ThemeController />
<Profile/>
        </div>
        <div className="col-span-6 row-span-4 row-start-2">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>

        </div>
      </div>



    </>
  )
}

export default App
