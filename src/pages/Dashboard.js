import { useAuth } from '../context/AuthContext';
import styles from './Dashboard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUserTie, faHome } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  const { user } = useAuth();

  const renderRoleMessage = () => {
    if (user?.role === 'admin') {
      return (
        <div className={styles.roleCard}>
          <FontAwesomeIcon icon={faUserShield} className={styles.icon} />
          <p>Eres <strong>administrador</strong>. Tienes acceso al panel de administración desde el menú.</p>
        </div>
      );
    }
    if (user?.role === 'empleado') {
      return (
        <div className={styles.roleCard}>
          <FontAwesomeIcon icon={faUserTie} className={styles.icon} />
          <p>Eres <strong>empleado</strong>. Puedes gestionar tus solicitudes en tu panel personal.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <FontAwesomeIcon icon={faHome} className={styles.mainIcon} />
        <h1 className={styles.title}>Bienvenido al Dashboard</h1>
        <p className={styles.userInfo}>
          Hola <strong>{user?.username}</strong> <strong>{user?.role}</strong>
        </p>
        {renderRoleMessage()}
      </div>
    </div>
  );
}
