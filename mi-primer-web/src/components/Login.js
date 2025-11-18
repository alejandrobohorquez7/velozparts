// src/components/Login.js
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

// Importa tu CSS:
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();

  const schema = Yup.object({
    email: Yup.string().email('Correo inválido').required('Campo obligatorio'),
    password: Yup.string().required('Campo obligatorio'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    axios
      .post('/auth/login', values)
      .then((res) => {
        localStorage.setItem('authUser', JSON.stringify(res.data.user));
        Swal.fire('Éxito', res.data.message, 'success').then(() => {
          navigate('/home');
        });
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Credenciales inválidas';
        Swal.fire('Error', msg, 'error');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="auth-container">

      {/* Imagen de fondo */}
      <img
        src={`${process.env.PUBLIC_URL}/compu.png`}
        alt="Fondo"
        className="auth-background"
      />

      {/* Tarjeta del login */}
      <div className="auth-card">
        <h3 className="text-center">Iniciar Sesión - VelozParts</h3>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>

              <div className="mb-3 text-start">
                <label htmlFor="email" className="form-label">Correo:</label>
                <Field
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  disabled={isSubmitting}
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="password" className="form-label">Contraseña:</label>
                <Field
                  id="password"
                  type="password"
                  name="password"
                  className="form-control"
                  disabled={isSubmitting}
                />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </button>

              <div className="text-center mt-3">
                <Link to="/registro">Registrarse</Link> |{' '}
                <Link to="/recuperar">¿Olvidó su contraseña?</Link>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
