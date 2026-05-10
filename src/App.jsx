import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Signup from './features/auth/Signup';
import Login from './features/auth/Login';
import Profile from './features/auth/Profile';
import BlogList from './features/blog/BlogList';
import CreateBlog from './features/blog/CreateBlog';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  // Update auth state on location change to ensure guards are reactive
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, [location]);

  // Global Axios interceptor for 401s
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  // Public Route Component
  const PublicRoute = ({ children }) => {
    if (isAuthenticated) {
      return <Navigate to="/allblog" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/allblog" 
          element={
            <ProtectedRoute>
              <BlogList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-blog" 
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to="/allblog" replace />} 
        />
      </Routes>
    </div>
  );
}

export default App;
