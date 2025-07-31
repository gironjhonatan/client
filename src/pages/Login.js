import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginAPI } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        username: form.username,
        password: form.password,
      };
      const { token } = await loginAPI(credentials);
      login(token);
      navigate('/');
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2 className={styles.title}>Iniciar sesión</h2>

        {error && <p className={styles.error}>{error}</p>}

        <input
          name="username"
          type="text"
          placeholder="Usuario o correo electrónico"
          value={form.username}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <button type="submit" className={styles.button}>
          Entrar
        </button>

        <p className={styles.linkText}>
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </form>
    </div>
  );
}
