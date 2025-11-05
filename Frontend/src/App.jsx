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
import JobPost from './components/jobs/JobPost';
import MyApplications from './components/applications/MyApplications';
import ClientApplications from './components/applications/ClientApplications';
import ProfileManagement from './components/profile/ProfileManagement';


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
                            <Route
                                path="/post-job"
                                element={
                                    <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
                                        <div className="min-h-screen pt-20 px-4">
                                            <div className="max-w-4xl mx-auto">
                                                <h1 className="text-4xl font-bold text-gray-900 mb-8">Post a Job</h1>
                                                <JobPost/>
                                            </div>
                                        </div>
                                    </ProtectedRoute>
                                }/>
                            <Route
                                path="/my-applications"
                                element={
                                    <ProtectedRoute allowedRoles={['FREELANCER', 'ADMIN']}>
                                        <MyApplications />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/client-applications"
                                element={
                                    <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
                                        <ClientApplications />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfileManagement />
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