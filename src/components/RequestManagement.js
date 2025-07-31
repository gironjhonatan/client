import { useState, useEffect } from 'react';
import adminAPI from '../api/adminAPI';
import styles from './RequestManagement.module.css';

export default function RequestManagement() {
  const [setRequests] = useState([]);
  const [mergedRequests, setMergedRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [solicitudes, empleados, usuarios] = await Promise.all([
          adminAPI.getTodasSolicitudes(),
          adminAPI.getEmpleados(),
          adminAPI.getUsuarios(),
        ]);

        const merged = solicitudes.map((solicitud) => {
        const empleado = empleados.find(emp => emp.user_id === solicitud.user_id);
        const usuario = usuarios.find(user => user.id === solicitud.user_id);

          return {
            ...solicitud,
            empleadoNombre: empleado?.nombre || 'N/A',
            username: usuario?.username || 'N/A',
          };
        });

        setRequests(solicitudes);
        setMergedRequests(merged);
      } catch (error) {
        console.error('Error al obtener o unir datos de solicitudes:', error);
      }
    };

    fetchData();
  }, []);

  const handleRespondRequest = async (requestId, status) => {
    try {
      await adminAPI.actualizarEstadoSolicitud(requestId, { status });
      setMergedRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status } : req
        )
      );
    } catch (error) {
      console.error('Error al actualizar estado de solicitud:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gestión de Solicitudes</h2>
      {mergedRequests.length === 0 ? (
        <p className={styles.empty}>No hay solicitudes registradas.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Usuario</th>
              <th>Código</th>
              <th>Descripción</th>
              <th>Resumen</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mergedRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.empleadoNombre}</td>
                <td>{req.username}</td>
                <td>{req.codigo}</td>
                <td>{req.descripcion}</td>
                <td>{req.resumen}</td>
                <td className={req.status ? styles.respondida : styles.pendiente}>
                  {req.status ? 'Respondida' : 'Pendiente'}
                </td>
                <td>
                  <button
                    className={styles.toggleButton}
                    onClick={() => handleRespondRequest(req.id, !req.status)}
                  >
                    Marcar como {req.status ? 'Pendiente' : 'Respondida'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
