import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, MessageCircle, Plus, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const GlassNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    

    useEffect(() => {
        const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    const isActiveRoute = (path) => location.pathname === path;

  return (
    <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
                ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20'
                : 'bg-transparent'
        }`  }
    >
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
            
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2"
                >
                    <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">FH</span>
                    </div>
                    <span className={`text-xl font-bold ${
                        isScrolled ? 'text-gray-900' : 'text-white'
                    }`}>
                        FreelanceHub
                    </span>
                    </Link>
                </motion.div>

                
                <div className="hidden md:flex items-center space-x-8">
                    {['/', '/jobs', '/dashboard'].map((path) => (
                    <motion.div key={path}>
                        <Link
                        to={path}
                        className={`font-medium transition-colors ${
                            isScrolled 
                            ? isActiveRoute(path) 
                                ? 'text-blue-600' 
                                : 'text-gray-700 hover:text-blue-600'
                            : isActiveRoute(path)
                                ? 'text-white font-semibold'
                                : 'text-white/90 hover:text-white'
                        }`}
                        >
                        {path === '/' ? 'Home' : 
                        path === '/jobs' ? 'Find Work' : 
                        'Dashboard'}
                        </Link>
                    </motion.div>
                    ))}
                </div>

                
                <div className="hidden md:flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-2 rounded-xl transition-colors ${
                                    isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'
                                }`}
                            >
                                <Search className={`w-5 h-5 ${
                                    isScrolled ? 'text-gray-600' : 'text-white'
                                }`} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-2 rounded-xl transition-colors ${
                                    isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'
                                }`}
                            >
                                <Bell className={`w-5 h-5 ${
                                    isScrolled ? 'text-gray-600' : 'text-white'
                                }`} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-2 rounded-xl transition-colors ${
                                    isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'
                                }`}
                            >
                                <MessageCircle className={`w-5 h-5 ${
                                    isScrolled ? 'text-gray-600' : 'text-white'
                                }`} />
                            </motion.button>

                    {(user?.role === 'CLIENT' || user?.role === 'ADMIN') && (         
                        <Link to="/post-job">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Post Job</span>
                            </motion.button>
                        </Link>
                    )}

                            <div className="relative group">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                                        isScrolled 
                                            ? 'hover:bg-gray-100 border border-gray-200' 
                                            : 'hover:bg-white/20 border border-white/30'
                                    }`}
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {user?.firstName?.charAt(0)?.toUpperCase()}{user?.lastName?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className={`hidden sm:block text-sm font-medium ${
                                        isScrolled ? 'text-gray-700' : 'text-white'
                                    }`}>
                                        {user?.firstName}
                                    </div>
                                    <svg 
                                        className={`w-4 h-4 transition-transform group-hover:rotate-180 ${
                                            isScrolled ? 'text-gray-400' : 'text-white/70'
                                        }`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </motion.button>
                            
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="p-3">
                                        <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-100">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {user?.firstName?.charAt(0)?.toUpperCase()}{user?.lastName?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user?.firstName} {user?.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">
                                                    {user?.role?.toLowerCase()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            <Link 
                                                to="/dashboard" 
                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2 transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                <span>Dashboard</span>
                                            </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                  </div>  
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-xl font-medium ${
                                    isScrolled 
                                        ? 'text-gray-700 hover:text-blue-600' 
                                        : 'text-white/90 hover:text-white'
                                    }`}
                                >
                                    Sign In
                                </motion.button>
                            </Link>
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    Sign Up
                                </motion.button>
                            </Link>
                        </div>
                    )}
                </div>

                
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`md:hidden p-2 rounded-xl ${
                    isScrolled ? 'text-gray-600' : 'text-white'
                    }`}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
            </div>
        </div>


        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-white/95 backdrop-blur-lg border-t border-white/20"
                >
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {['/', '/jobs', '/dashboard'].map((path) => (
                            <motion.div key={path}>
                                <Link
                                    to={path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block py-2 font-medium ${
                                    isActiveRoute(path) 
                                        ? 'text-blue-600' 
                                        : 'text-gray-700 hover:text-blue-600'
                                    }`}
                                >
                                    {path === '/' ? 'Home' : 
                                    path === '/jobs' ? 'Find Work' : 
                                    'Dashboard'}
                                </Link>
                            </motion.div>
                        ))}

                        <div className="pt-4 border-t border-gray-200 space-y-3">
                            {isAuthenticated ? (
                                <>
                                {(user?.role === 'CLIENT' || user?.role === 'ADMIN') && (
                                        <Link to="/post-job" onClick={() => setIsMobileMenuOpen(false)}>
                                            <motion.button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold">
                                                Post a Job
                                            </motion.button>
                                        </Link>
                                )}
                                    <motion.button
                                    onClick={handleLogout}
                                    className="w-full border border-gray-300 py-3 rounded-xl font-medium text-red-600"
                                    >
                                        Sign Out
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <motion.button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold">
                                            Sign Up
                                        </motion.button>
                                    </Link>
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <motion.button className="w-full border border-gray-300 py-3 rounded-xl font-medium">
                                            Sign In
                                        </motion.button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.nav>
  )
}

export default GlassNavbar