// src/components/Registro.js
import '../styles/auth.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

// Importa el logo como imagen de fondo (asumiendo que logo.svg está en src)
import logo from '../logo.svg';

const Registro = () => {
  const navigate = useNavigate();
  const schema = Yup.object({
    nombre: Yup.string().required('Campo obligatorio'),
    email: Yup.string().email('Correo inválido').required('Campo obligatorio'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Campo obligatorio'),
  });

  const handleSubmit = (values, { resetForm }) => {
    axios
      .post('/auth/register', values)
      .then((res) => {
        Swal.fire('Registrado', res.data.message, 'success').then(() => {
          navigate('/');
        });
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Error al registrar';
        Swal.fire('Error', msg, 'error');
      });
    resetForm();
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
        <h3 className="text-center">Registro</h3>

        <Formik
          initialValues={{ nombre: '', email: '', password: '' }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-3 text-start">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <Field name="nombre" className="form-control" />
              <ErrorMessage name="nombre" component="div" className="text-danger" />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label">Correo:</label>
              <Field type="email" name="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="password" className="form-label">Contraseña:</label>
              <Field type="password" name="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Registrar
            </button>

            <div className="text-center mt-3">
              <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Registro;