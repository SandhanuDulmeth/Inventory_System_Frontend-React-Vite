// src\App.jsx

import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import { ThemeProvider } from './context/ThemeContext'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import CustomerLayout from './components/CustomerLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminChat from './components/AdminChat'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-base-100">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Admin routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <div className="min-h-screen bg-base-100">
                        <AdminDashboard />
                      </div>
                    </ProtectedRoute>
                  }
                />
                
                {/* Customer routes */}
                <Route
                  path="/customer/*"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                      <CustomerLayout />
                    </ProtectedRoute>
                  }
                />
                
                {/* Redirect root to login if not authenticated */}
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
