import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Empleado = lazy(() => import('./pages/Empleado'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppRoutes() {
  const { user } = useAuth();

  const routes = (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <AdminPanel />
        </ProtectedRoute>
      } />
      <Route path="/empleado" element={
        <ProtectedRoute roles={['empleado']}>
          <Empleado />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return user ? <MainLayout>{routes}</MainLayout> : routes;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Cargando...</div>}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
