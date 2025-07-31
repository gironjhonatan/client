import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './Login.module.css';
import { useAuth } from '../context/AuthContext';
import { loginAPI } from '../services/authService';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUsers = async () => {
      try {
        const res = await api.get('/auth/user-count');
        setUserCount(res.data.count);
      } catch (err) {
        console.error('Error al contar usuarios:', err);
        setError('Error al cargar la información de usuarios');
      }
    };
    checkUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validatePassword = () => {
    if (form.password.length <= 4) {
      setError('La contraseña debe tener más de 4 caracteres');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userCount === null) {
      setError('Cargando información de usuarios...');
      return;
    }
    if (!validatePassword()) {
      return;
    }

    const role = userCount === 0 ? 'admin' : 'empleado';
    setLoading(true);
    setError('');

    try {
      const registerRes = await api.post('/auth/register', {
        ...form,
        role,
      });
      console.log('Usuario registrado:', registerRes.data);
      setTimeout(async () => {
        try {
          const credentials = {
            username: form.username,
            password: form.password,
          };
          const loginRes = await loginAPI(credentials);
          login(loginRes.token);
          navigate(role === 'admin' ? '/admin' : '/empleado');
        } catch (err) {
          setError('No se pudo completar el inicio de sesión');
        } finally {
          setLoading(false);
        }
      }, 3000);
    } catch (err) {
      setError('No se pudo completar el registro');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2 className={styles.title}>Registrarse</h2>
        {error && <p className={styles.error}>{error}</p>}
        {loading && <p className={styles.loading}>Registrando y accediendo...</p>}
        <input
          name="username"
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          className={styles.input}
          disabled={loading}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
          disabled={loading}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar Contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          className={styles.input}
          disabled={loading}
          required
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Procesando...' : 'Crear cuenta'}
        </button>
        <p className={styles.linkText}>
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}
