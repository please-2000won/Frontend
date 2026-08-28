import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';

// 어드민 테스트 페이지 및 MainPage의 임시 API 연동 전용 axios 인스턴스.
// 팀원이 관리하는 axiosInstance.ts(전역 인터셉터/에러 처리)는 건드리지 않기 위해 별도로 둔다.
const testApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

testApiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default testApiClient;
