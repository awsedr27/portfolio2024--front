import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 기타 필요한 헤더 설정
    
  },
  timeout:40000
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
    (config:InternalAxiosRequestConfig) => {
      // 여기서 요청을 수정할 수 있습니다 (예: 헤더 추가, 인증 토큰 설정 등)
    const accessToken = localStorage.getItem('accessToken');

    // 만약 accessToken이 존재하면 요청 헤더에 추가
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("요청 헤더 셋팅");
    }
      return config;
    },
    (error) => {
      // 요청이 실패한 경우 처리할 로직을 추가할 수 있습니다
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );
  
  // 응답 인터셉터 추가
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        window.location.replace("/login");
        return Promise.reject(error);
      }
    }
  );
export default axiosInstance;