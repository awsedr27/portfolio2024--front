import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';


const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    
  },
  timeout:40000
});
const refreshInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout:40000
});

axiosInstance.interceptors.request.use(
    (config:InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401) {
        if(originalRequest._retry){
          localStorage.removeItem('accessToken');
          window.location.replace("/login");
          return Promise.reject(error);
        }
        originalRequest._retry = true;
        try {
          const response = await refreshInstance.post('/api/user/login/refresh', {}, { withCredentials: true });
          const newAccessToken=response.headers['authorization'];
          const accessToken = newAccessToken.split('Bearer ')[1];
          if(response.status!==200||!accessToken){
            throw new Error("새로운 액세스 토큰을 받아오지 못했습니다.");
          }
          localStorage.setItem('accessToken', accessToken);  

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          window.location.replace("/login");
          return Promise.reject(refreshError);
        }

      }

      return Promise.reject(error);
    }
  );
export default axiosInstance;