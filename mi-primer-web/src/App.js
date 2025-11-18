// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Importar componentes de autenticación
import Login from './components/Login';
import Registro from './components/Registro';
import Recuperar from './components/Recuperar';
import PrivateRoute from './components/PrivateRoute';

// Importar la página principal de VelozParts
import VelozPartsHome from './components/VelozPartsHome';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas (formularios de autenticación) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<Recuperar />} />

        {/* Ruta principal protegida - VelozParts */}
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <VelozPartsHome />
            </PrivateRoute>
          } 
        />

        {/* Redirección: Si entran a "/" sin login, van a /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Ruta 404 - cualquier otra ruta va al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;