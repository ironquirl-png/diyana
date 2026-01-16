import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateText = async (prompt, contentStyle = 'blog') => {
  const response = await api.post('/generate/text', {
    prompt,
    content_style: contentStyle
  });
  return response.data;
};

export const generateImage = async (prompt) => {
  const response = await api.post('/generate/image', { prompt });
  return response.data;
};

export const getContents = async (contentType = null) => {
  const params = contentType ? { content_type: contentType } : {};
  const response = await api.get('/contents', { params });
  return response.data;
};

export const getContent = async (contentId) => {
  const response = await api.get(`/contents/${contentId}`);
  return response.data;
};

export const deleteContent = async (contentId) => {
  const response = await api.delete(`/contents/${contentId}`);
  return response.data;
};

export default api;