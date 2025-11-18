// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Confirmación antes de cerrar sesión
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#ccc',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Remover el usuario autenticado de localStorage
        localStorage.removeItem('authUser');
        
        // Mostrar mensaje de éxito
        Swal.fire('Sesión cerrada', 'Has cerrado sesión exitosamente.', 'success').then(() => {
          // Redirigir al login
          navigate('/login');
        });
      }
    });
  };

  return (
    <button 
      className="nav-link" // <-- Agregado para que se vea como los otros enlaces
      onClick={handleLogout}
      style={{ background: 'none', border: 'none', cursor: 'pointer' }} // <-- Estilos inline para quitar fondo y borde
    >
      Cerrar Sesión
    </button>   
  );
};

export default LogoutButton;