import axios from 'axios';
export const axiosInstance = axios.create({
  baseURL: 'https://ecommerce.routemisr.com',
  headers: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODU4OTQ0NjNhZTRkMmI4MDdlZmE2MiIsIm5hbWUiOiJzYXJhZWxoYWRhZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU2MDk3Nzg4LCJleHAiOjE3NjM4NzM3ODh9.7eWQvkyMZG00tdUjypWs69uH3Vrg17Ip1bOTAECJAks',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (config) => {
    
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
