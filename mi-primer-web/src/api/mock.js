import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios, { delayResponse: 700 });

// Funciones para manejar almacenamiento local
const getUsers = () => JSON.parse(localStorage.getItem('usuarios') || '[]');
const setUsers = (u) => localStorage.setItem('usuarios', JSON.stringify(u));

const getProjects = () => JSON.parse(localStorage.getItem('proyectos') || '[]');
const setProjects = (p) => localStorage.setItem('proyectos', JSON.stringify(p));

// Función para inicializar proyectos de un nuevo usuario
const initializeUserProjects = (userEmail) => {
  const projects = getProjects();
  
  const initialProjects = [
    {
      id: Date.now(),
      nombre: 'Sistema de Recomendación Personalizado',
      descripcion: 'Motor de recomendaciones basado en comportamiento de usuario.',
      fechaInicio: '2025-01-10',
      fechaFin: '2025-06-30',
      userEmail: userEmail,
      tasks: [],
    },
    {
      id: Date.now() + 1,
      nombre: 'Plataforma de Monitoreo de Sensores IoT para Agricultura Inteligente',
      descripcion: 'Visualización y alertas de datos de sensores en campo.',
      fechaInicio: '2025-02-01',
      fechaFin: '2025-12-31',
      userEmail: userEmail,
      tasks: [],
    },
    {
      id: Date.now() + 2,
      nombre: 'Aplicación Web de Gestión de Proyectos con Enfoque DevOps',
      descripcion: 'Herramienta para gestionar pipelines y tareas CI/CD.',
      fechaInicio: '2025-03-15',
      fechaFin: '2025-09-30',
      userEmail: userEmail,
      tasks: [],
    },
  ];
  
  const updatedProjects = [...projects, ...initialProjects];
  setProjects(updatedProjects);
};

// Registro
mock.onPost('/auth/register').reply((config) => {
  const values = JSON.parse(config.data);
  const users = getUsers();

  // Validar si el email ya existe
  if (users.some((u) => u.email === values.email)) {
    return [400, { message: 'El email ya está registrado' }];
  }

  // Crear nuevo usuario
  const nuevo = {
    id: Date.now(),
    nombre: values.nombre,
    email: values.email,
    password: values.password,
  };

  users.push(nuevo);
  setUsers(users);

  // Inicializar proyectos para el nuevo usuario
  initializeUserProjects(nuevo.email);

  return [201, { message: 'Cuenta creada con éxito', user: nuevo }];
});

// Login
mock.onPost('/auth/login').reply((config) => {
  const { email, password } = JSON.parse(config.data);
  const users = getUsers();

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return [401, { message: 'Credenciales inválidas' }];

  // Verificar si el usuario tiene proyectos
  const projects = getProjects();
  const userHasProjects = projects.some((p) => p.userEmail === email);
  
  // Si no tiene proyectos, inicializarlos
  if (!userHasProjects) {
    initializeUserProjects(email);
  }

  return [200, { message: 'Inicio de sesión exitoso', user }];
});

// Recuperación de contraseña
mock.onPost('/auth/recuperar').reply((config) => {
  const { email } = JSON.parse(config.data);
  const users = getUsers();

  if (!users.some((u) => u.email === email)) {
    return [404, { message: 'Email no registrado' }];
  }

  return [200, { message: 'Correo de recuperación enviado (simulado)' }];
});

// Obtener proyectos del usuario logueado
mock.onGet('/projects').reply(() => {
  const authUser = JSON.parse(localStorage.getItem('authUser'));
  let projects = getProjects();

  // Filtrar por el usuario logueado
  if (authUser) {
    projects = projects.filter((p) => p.userEmail === authUser.email);
  } else {
    projects = []; // Si no hay usuario logueado, no devolver nada
  }

  return [200, projects];
});

// Crear proyecto (asociado al usuario)
mock.onPost('/projects').reply((config) => {
  const values = JSON.parse(config.data);
  const projects = getProjects();
  const authUser = JSON.parse(localStorage.getItem('authUser'));

  const nuevo = {
    id: Date.now(),
    ...values,
    userEmail: authUser?.email || null,
    tasks: [],
  };

  projects.push(nuevo);
  setProjects(projects);

  return [201, { message: 'Proyecto agregado', project: nuevo }];
});

// Actualizar proyecto existente
mock.onPut(/\/projects\/\d+/).reply((config) => {
  const id = Number(config.url.split('/').pop());
  const values = JSON.parse(config.data);
  const projects = getProjects();

  const updated = projects.map((p) =>
    p.id === id ? { ...p, ...values } : p
  );

  setProjects(updated);
  return [200, { message: 'Proyecto actualizado con éxito' }];
});

// Eliminar proyecto
mock.onDelete(/\/projects\/\d+/).reply((config) => {
  const id = Number(config.url.split('/').pop());
  let projects = getProjects();
  projects = projects.filter((p) => p.id !== id);
  setProjects(projects);
  return [200, { message: 'Proyecto eliminado' }];
});

//tareas
mock.onPost(/\/projects\/\d+\/tasks/).reply((config) => {
  const id = Number(config.url.split('/')[2]);
  const task = JSON.parse(config.data);
  const projects = getProjects();

  const updated = projects.map((p) => {
    if (p.id === id) {
      const newTask = { id: Date.now(), ...task };
      p.tasks = [...(p.tasks || []), newTask];
    }
    return p;
  });

  setProjects(updated);
  return [201, { message: 'Tarea agregada' }];
});
