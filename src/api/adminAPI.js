import api from './axios';

const adminAPI = {
  getEmpleados: async () => {
    const res = await api.get('/empleados');
    return res.data;
  },
  getUsuarios: async () => {
    const res = await api.get('/empleados/all');
    return res.data;
  },
  actualizarRolUsuario: async (userId, roleData) => {
    const res = await api.put(`/empleados/${userId}/role`, roleData);
    return res.data;
  },
  eliminarEmpleado: async (empleadoId) => {
    const res = await api.delete(`/empleados/${empleadoId}`);
    return res.data;
  },
  getTodasSolicitudes: async () => {
    const res = await api.get('/solicitudes');
    return res.data;
  },
  actualizarEstadoSolicitud: async (requestId, statusData) => {
    const res = await api.put(`/solicitudes/${requestId}/status`, statusData);
    return res.data;
  },
  crearEmpleado: async (data) => {
    const res = await api.post('/empleados', data);
    return res.data;
  },
};

export default adminAPI;
