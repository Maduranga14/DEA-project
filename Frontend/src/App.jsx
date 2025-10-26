import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import HeroSection from './components/layout/HeroSection'
import GlassNavbar from './components/common/GlassNavbar'
import './App.css'
import JobList from './components/jobs/JobList';
import Register from './components/auth/Register';


const queryClient = new QueryClient();

function App() {
  //const [count, setCount] = useState(0)

  return (
    <QueryClientProvider client={queryClient}>
      
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
              
              
              
            </Routes>
          </div>
        </Router>
      
    </QueryClientProvider>
  )
}

export default App