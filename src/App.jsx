import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import ThemeController from './components/ThemeController'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>


<ThemeController></ThemeController>

     <BrowserRouter>
    
       <Routes>
         <Route path="/" element={<Home />} />
    
       </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
