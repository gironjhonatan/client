import { useState, useEffect } from 'react';
import adminAPI from '../api/adminAPI';
import styles from './UserManagement.module.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [usuariosSinEmpleado, setUsuariosSinEmpleado] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEmpleado, setNewEmpleado] = useState({
    nombre: '',
    fecha_ingreso: '',
    salario: '',
    user_id: '',
  });

  useEffect(() => {
    const fetchAndMergeUsers = async () => {
      try {
        const empleados = await adminAPI.getEmpleados();
        const usuarios = await adminAPI.getUsuarios();

        const merged = empleados.map(emp => {
          const userData = usuarios.find(u => u.id === emp.user_id);
          return {
            ...emp,
            username: userData?.username || 'N/A',
            role: userData?.role || 'N/A',
          };
        });

        const userIdsConEmpleado = empleados.map(e => e.user_id);
        const sinEmpleado = usuarios.filter(u => !userIdsConEmpleado.includes(u.id));

        setUsers(merged);
        setUsuariosSinEmpleado(sinEmpleado);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchAndMergeUsers();
  }, []);

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.actualizarRolUsuario(userId, { role: newRole });
      setRoles(prev => ({ ...prev, [userId]: newRole }));
    } catch (error) {
      console.error('Error al actualizar rol:', error);
    }
  };

  const handleDeleteUser = async (empleadoId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await adminAPI.eliminarEmpleado(empleadoId);
      setUsers(prev => prev.filter(u => u.id !== empleadoId));
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
    }
  };

  const formatFecha = (isoDate) => {
    const fecha = new Date(isoDate);
    return fecha.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleOpenModal = (userId) => {
    setNewEmpleado({ ...newEmpleado, user_id: userId });
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setNewEmpleado({ ...newEmpleado, [e.target.name]: e.target.value });
  };

  const handleCrearEmpleado = async (e) => {
    e.preventDefault();
    sessionStorage.setItem('scrollPosition', window.scrollY);
    try {
      await adminAPI.crearEmpleado(newEmpleado);
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error('Error al crear empleado:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gestión de Usuarios</h2>
      <h3 className={styles.subtitle}>Empleados Registrados</h3>
      {users.length === 0 ? (
        <p className={styles.empty}>No hay empleados registrados.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Fecha Ingreso</th>
              <th>Salario</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td>{user.username}</td>
                <td>{formatFecha(user.fecha_ingreso)}</td>
                <td>${Number(user.salario).toLocaleString()}</td>
                <td>
                  <select
                    className={styles.select}
                    onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                    value={roles[user.user_id] || user.role}
                    disabled={user.role === 'admin'}
                  >
                    <option value="empleado">Empleado</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {usuariosSinEmpleado.length > 0 && (
        <ul className={styles.userList}>
          {usuariosSinEmpleado.map(user => (
            <li key={user.id}>
              {user.username} ({user.role})
              <button
                className={styles.createButton}
                onClick={() => handleOpenModal(user.id)}
              >
                Crear perfil de empleado
              </button>
            </li>
          ))}
        </ul>
      )}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Crear Perfil de Empleado</h3>
            <form onSubmit={handleCrearEmpleado}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={newEmpleado.nombre}
                onChange={handleModalChange}
                required
              />
              <input
                type="date"
                name="fecha_ingreso"
                value={newEmpleado.fecha_ingreso}
                onChange={handleModalChange}
                required
              />
              <input
                type="number"
                name="salario"
                placeholder="Salario"
                value={newEmpleado.salario}
                onChange={handleModalChange}
                required
              />
              <div className={styles.modalActions}>
                <button type="submit" className={styles.confirmButton}>Guardar</button>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelButton}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
