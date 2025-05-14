import axios from 'axios';

const api = axios.create({
  baseURL: 'https://telegram-srv.jde.ru/aextrip/'
});

api.interceptors.request.use(config => {
  const dssession = localStorage.getItem('dssession');
  if (dssession) {
    config.headers.Pragma = dssession;
  }
  return config;
});

export default api;
