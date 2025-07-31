import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import empleadoAPI from '../api/empleadoAPI';
import styles from './Empleado.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Empleado() {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [empleado, setEmpleado] = useState(null);
  const [form, setForm] = useState({
    id: null,
    codigo: '',
    descripcion: '',
    resumen: '',
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (user?.id && isMounted) {
        try {
          const solicitudesData = await empleadoAPI.getSolicitudes(user.id);
          if (isMounted) setSolicitudes(solicitudesData);

          const empleadoData = await empleadoAPI.getEmpleadoByUserId(user.id);
          if (isMounted) setEmpleado(empleadoData[0]);
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id && !empleado) {
      toast.info('Aún no eres empleado, el administrador lo hará');
      return;
    }

    try {
      if (form.id) {
        await empleadoAPI.actualizarSolicitud(form.id, {
          codigo: form.codigo,
          descripcion: form.descripcion,
          resumen: form.resumen,
        });
        toast.success('Solicitud actualizada correctamente');
      } else {
        const nuevaSolicitud = {
          codigo: form.codigo,
          descripcion: form.descripcion,
          resumen: form.resumen,
          user_id: user.id,
          status: false,
        };
        await empleadoAPI.crearSolicitud(nuevaSolicitud);
        toast.success('Solicitud creada exitosamente');
      }

      setForm({ id: null, codigo: '', descripcion: '', resumen: '' });
      const solicitudesData = await empleadoAPI.getSolicitudes(user.id);
      setSolicitudes(solicitudesData);
    } catch (error) {
      console.error('Error al guardar solicitud:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'El empleado no existe'
      ) {
        toast.info('Aún no eres empleado, el administrador lo hará');
      } else {
        toast.error('Ocurrió un error al guardar la solicitud.');
      }
    }
  };

  const handleUpdateClick = (solicitud) => {
    setForm({
      id: solicitud.id,
      codigo: solicitud.codigo,
      descripcion: solicitud.descripcion,
      resumen: solicitud.resumen,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta solicitud?");
    if (!confirmDelete) return;
    try {
      await empleadoAPI.eliminarSolicitud(id);
      setSolicitudes(solicitudes.filter(solicitud => solicitud.id !== id));
      toast.success('Solicitud eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar solicitud:', error);
      toast.error('Error al eliminar la solicitud');
    }
  };

  const resumirTexto = (texto) => {
    const palabras = texto.trim().split(/\s+/);
    return palabras.length <= 4 ? texto : palabras.slice(0, 4).join(' ') + '...';
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h1 className={styles.title}>Panel</h1>

      {empleado && (
        <p className={styles.welcome}>Hola <strong>{empleado.nombre}</strong> 👋</p>
      )}

      <div className={styles.twoColumnLayout}>
        <div className={styles.leftColumn}>
          <section className={styles.section}>
            <h2 className={styles.subtitle}>
              {form.id ? 'Actualizar Solicitud' : 'Crear nueva solicitud'}
            </h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                placeholder="Código"
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Resumen"
                value={form.resumen}
                onChange={(e) => setForm({ ...form, resumen: e.target.value })}
                required
                className={styles.input}
              />
              <div className={styles.buttonRow}>
                <button type="submit" className={styles.button}>
                  {form.id ? 'Actualizar Solicitud' : 'Crear Solicitud'}
                </button>
                {form.id && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm({ id: null, codigo: '', descripcion: '', resumen: '' })
                    }
                    className={styles.cancelButton}
                  >
                    Cancelar ✖
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        <div className={styles.rightColumn}>
          <section className={styles.section}>
            <h2 className={styles.subtitle}>Mis solicitudes</h2>
            {solicitudes.length === 0 ? (
              <p className={styles.empty}>No hay solicitudes registradas.</p>
            ) : (
              <>
                <div className={styles.tableHeader}>
                  <span className={styles.column}>Código</span>
                  <span className={styles.column}>Descripción</span>
                  <span className={styles.column}>Resumen</span>
                  <span className={styles.column}>Estado</span>
                  <span className={styles.column}>Acciones</span>
                </div>
                <ul className={styles.list}>
                  {solicitudes.map((solicitud) => (
                    <li key={solicitud.id} className={styles.listItem}>
                      <span className={styles.column}>
                        <strong>{solicitud.codigo}</strong>
                      </span>
                      <span className={styles.column}>{solicitud.descripcion}</span>
                      <span className={styles.column}>{resumirTexto(solicitud.resumen)}</span>
                      <span className={styles.column}>
                        {solicitud.status ? 'Respondida' : 'Pendiente'}
                      </span>
                      <span className={styles.column}>
                        <button
                          onClick={() => handleUpdateClick(solicitud)}
                          className={styles.updateButton}
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDelete(solicitud.id)}
                          className={styles.deleteButton}
                          title="Eliminar"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
