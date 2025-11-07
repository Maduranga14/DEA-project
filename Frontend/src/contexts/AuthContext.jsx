import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/AuthService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        let token, userRole, userData;

        if (rememberMe) {
            token = localStorage.getItem('token');
            userRole = localStorage.getItem('userRole');
            userData = localStorage.getItem('userData');


            if (token && userRole && userData) {
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('userRole', userRole);
                sessionStorage.setItem('userData', userData);
            }
        } else {

            token = sessionStorage.getItem('token');
            userRole = sessionStorage.getItem('userRole');
            userData = sessionStorage.getItem('userData');
        }

        if (token && userRole && userData) {
            setUser({
                role: userRole,
                ...JSON.parse(userData),
                token
            });
        }
        setLoading(false);


        const handleBeforeUnload = () => {

        };

        const handleVisibilityChange = () => {

            if (document.hidden) {

            }
        };


        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);


        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const login = async (email, password, rememberMe = false) => {
        try {
            const response = await authService.login(email, password);
            if (response.data) {
                const { token, role, ...userData } = response.data;


                sessionStorage.setItem('token', token);
                sessionStorage.setItem('userRole', role);
                sessionStorage.setItem('userData', JSON.stringify(userData));


                if (rememberMe) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('userRole', role);
                    localStorage.setItem('userData', JSON.stringify(userData));
                    localStorage.setItem('rememberMe', 'true');
                } else {

                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userData');
                    localStorage.removeItem('rememberMe');
                }

                setUser({ role, ...userData, token });
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            return { success: true, data: response.data };
        } catch (error) {
            
            const errorMessage = error.response?.data?.message || 
                                error.response?.data || 
                                'Registration failed';
            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const updateUser = (updatedUserData) => {
        if (user) {
            const updatedUser = { ...user, ...updatedUserData };
            setUser(updatedUser);

            
            const { token, role, ...userData } = updatedUser;
            sessionStorage.setItem('userData', JSON.stringify(userData));

            
            const rememberMe = localStorage.getItem('rememberMe') === 'true';
            if (rememberMe) {
                localStorage.setItem('userData', JSON.stringify(userData));
            }
        }
    };

    const logout = () => {

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userData');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};