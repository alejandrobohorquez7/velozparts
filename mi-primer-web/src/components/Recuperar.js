// src/components/Recuperar.js
import '../styles/auth.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

// Importa el logo como imagen de fondo (asumiendo que logo.svg está en src)
import logo from '../logo.svg';

const Recuperar = () => {
  const schema = Yup.object({ 
    email: Yup.string().email('Correo inválido').required('Campo obligatorio') 
  });

  const handleSubmit = (values, { resetForm }) => {
    setTimeout(() => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const existe = usuarios.some(u => u.email === values.email);
      if (existe) {
        Swal.fire('Correo enviado', `Se envió un enlace de restablecimiento a ${values.email} (simulado)`, 'info');
      } else {
        Swal.fire('Error', 'El email no está registrado', 'error');
      }
      resetForm();
    }, 800);
  };

  return (
    <div className="auth-container">
      {/* Imagen de fondo */}
      <img
        src={logo}
        alt="Fondo"
        className="auth-background"
      />

      {/* Tarjeta del formulario */}
      <div className="auth-card">
        <h3 className="text-center">Recuperar Contraseña</h3>
        <p className="text-muted mb-4">Ingresa tu correo electrónico</p>

        <Formik 
          initialValues={{ email: '' }} 
          validationSchema={schema} 
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label">Correo:</label>
              <Field
                id="email"
                type="email"
                name="email"
                className="form-control"
              />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Enviar enlace
            </button>

            <div className="text-center mt-3">
              <Link to="/login">Volver al inicio</Link>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Recuperar;