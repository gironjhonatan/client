import api from './axios';

const empleadoAPI = {
  getSolicitudes: async (user_id) => {
    const res = await api.get(`/solicitudes/user?id_empleado=${user_id}`);
    return res.data;
  },
  getEmpleadoByUserId: async (userId) => {
    const res = await api.get(`/empleados/user/${userId}`);
    return res.data;
  },
  crearSolicitud: async (solicitud) => {
    const res = await api.post('/solicitudes', solicitud);
    return res.data;
  },
  actualizarSolicitud: async (id, solicitud) => {
    const res = await api.put(`/solicitudes/${id}`, solicitud);
    return res.data;
  },
  eliminarSolicitud: async (id) => {
    const res = await api.delete(`/solicitudes/${id}`);
    return res.data;
  }
};

export default empleadoAPI;
