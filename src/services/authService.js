import api from '../api/axios';

export const loginAPI = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};
