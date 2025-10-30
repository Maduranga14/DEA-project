import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import HeroSection from './components/layout/HeroSection'
import GlassNavbar from './components/common/GlassNavbar'
import './App.css'
import JobList from './components/jobs/JobList';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import CreativeDashboard from './components/dashboard/CreativeDashboard';
import { AuthProvider } from './contexts/AuthContext';


const queryClient = new QueryClient();

function App() {
  //const [count, setCount] = useState(0)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <GlassNavbar />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: 'green',
                    secondary: 'black',
                  },
                },
              }}
            />
            
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/jobs" element={<JobList/>}/>
              <Route path="/Register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path='/dashboard' element={
                <ProtectedRoute>
                  <CreativeDashboard />
                </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App