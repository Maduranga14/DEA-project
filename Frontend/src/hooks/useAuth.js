import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * @returns {Object} Auth context values
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * Hook to check if user has specific role
 * @param {string|string[]} roles - Role or array of roles to check
 * @returns {boolean} Whether user has the required role
 */
export const useHasRole = (roles) => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
};

/**
 * Hook to check if user can perform action based on ownership
 * @param {string} userId - ID of the resource owner
 * @returns {boolean} Whether user owns the resource or is admin
 */
export const useCanEdit = (userId) => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  // Admins can edit everything
  if (user.role === 'ADMIN') return true;
  
  // Users can edit their own resources
  return user.id === userId;
};

/**
 * Hook to get user's display name
 * @returns {string} User's display name
 */
export const useUserDisplayName = () => {
  const { user } = useAuth();
  
  if (!user) return 'Guest';
  
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
};

/**
 * Hook to check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

/**
 * Hook to get user's initial for avatar
 * @returns {string} User's initial
 */
export const useUserInitial = () => {
  const { user } = useAuth();
  
  if (!user) return 'G';
  
  return (user.firstName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase();
};

/**
 * Hook to handle protected operations
 * @returns {Object} Methods for protected operations
 */
export const useProtected = () => {
  const { user, isAuthenticated } = useAuth();
  
  const requireAuth = (callback, fallback = () => {}) => {
    if (!isAuthenticated) {
      // Store the intended action for after login
      if (callback) {
        sessionStorage.setItem('postLoginAction', JSON.stringify({
          action: callback.toString(),
          timestamp: Date.now()
        }));
      }
      fallback();
      return false;
    }
    return callback();
  };
  
  const requireRole = (roles, callback, fallback = () => {}) => {
    if (!isAuthenticated) {
      fallback();
      return false;
    }
    
    const hasRole = Array.isArray(roles) 
      ? roles.includes(user.role)
      : user.role === roles;
    
    if (!hasRole) {
      fallback();
      return false;
    }
    
    return callback();
  };
  
  return {
    requireAuth,
    requireRole
  };
};

/**
 * Hook to manage authentication state with local storage sync
 * @returns {Object} Enhanced auth methods
 */
export const useAuthStorage = () => {
  const { user, login, register, logout } = useAuth();
  
  const loginWithRemember = async (email, password, rememberMe = false) => {
    const result = await login(email, password);
    
    if (result.success && rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
    
    return result;
  };
  
  const logoutWithCleanup = () => {
    // Clear any stored data
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('postLoginAction');
    
    // Perform logout
    logout();
  };
  
  const getStoredAuthData = () => {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userData = localStorage.getItem('userData');
    const rememberMe = localStorage.getItem('rememberMe');
    
    return {
      token,
      userRole,
      userData: userData ? JSON.parse(userData) : null,
      rememberMe: rememberMe === 'true'
    };
  };
  
  return {
    user,
    login: loginWithRemember,
    register,
    logout: logoutWithCleanup,
    getStoredAuthData
  };
};

/**
 * Hook to handle authentication errors
 * @returns {Object} Error handling methods
 */
export const useAuthErrorHandler = () => {
  const { logout } = useAuth();
  
  const handleAuthError = (error) => {
    const status = error.response?.status;
    
    switch (status) {
      case 401: // Unauthorized
        console.warn('Authentication expired, logging out...');
        logout();
        break;
        
      case 403: // Forbidden
        console.warn('Insufficient permissions');
        break;
        
      case 429: // Rate limited
        console.warn('Too many requests, please slow down');
        break;
        
      default:
        console.error('Authentication error:', error);
    }
    
    return {
      status,
      message: error.response?.data?.message || 'Authentication error occurred'
    };
  };
  
  const isAuthError = (error) => {
    const status = error.response?.status;
    return status === 401 || status === 403;
  };
  
  return {
    handleAuthError,
    isAuthError
  };
};

export default useAuth;