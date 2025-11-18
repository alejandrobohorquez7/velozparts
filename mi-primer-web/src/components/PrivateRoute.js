// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Verificar si hay usuario autenticado en localStorage
  const authUser = localStorage.getItem('authUser');
  
  // Si NO está autenticado, redirigir al login
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, mostrar el contenido protegido
  return children;
};

export default PrivateRoute;