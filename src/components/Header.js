import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../context/AuthContext'; 

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/">Inicio</Link>

        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {user?.role === 'empleado' && <Link to="/empleado">Empleado</Link>}

        {!user && <Link to="/login">Login</Link>}
      </div>

      {user && (
        <div className={styles.right}>
          <button onClick={handleLogout} className={styles.logoutLink}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}
