import axiosClient from './axiosClient.js';

export const registerApi = async (payload) => {
  const { data } = await axiosClient.post('/auth/register', payload);
  return data.data;
};

export const loginApi = async (payload) => {
  const { data } = await axiosClient.post('/auth/login', payload);
  return data.data;
};

export const getMeApi = async () => {
  const { data } = await axiosClient.get('/auth/me');
  return data.data;
};
