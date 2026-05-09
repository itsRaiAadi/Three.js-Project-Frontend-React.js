import axiosClient from './axiosClient.js';

export const uploadObjectApi = async (file) => {
  const formData = new FormData();
  formData.append('model', file);

  const { data } = await axiosClient.post('/objects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.data;
};

export const getObjectsApi = async () => {
  const { data } = await axiosClient.get('/objects');
  return data.data;
};

export const getObjectApi = async (id) => {
  const { data } = await axiosClient.get(`/objects/${id}`);
  return data.data;
};

export const saveCameraStateApi = async (id, cameraState) => {
  const { data } = await axiosClient.patch(`/objects/${id}/camera-state`, { cameraState });
  return data.data;
};

export const deleteObjectApi = async (id) => {
  const { data } = await axiosClient.delete(`/objects/${id}`);
  return data;
};
