import { useState } from 'react';
import UserManagement from '../components/UserManagement';
import RequestManagement from '../components/RequestManagement';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Panel de Administración</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Gestionar Usuarios
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'requests' ? styles.active : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Gestionar Solicitudes
        </button>
        
      </div>

      <div className={styles.content}>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'requests' && <RequestManagement />}
      </div>
    </div>
  );
}
