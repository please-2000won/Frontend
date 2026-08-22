import axios from 'axios';
import api from './axiosInstance';

export interface LoginData {
  email: string;
  password: string;
}

//백엔드가 돌려줄 응답 데이터 타입
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

//경로 수정 필요
export const loginUser = async (userData: LoginData) => {
  try {
    const response = await api.post<LoginResponse>('api/users/login', userData);

    const { accessToken, refreshToken } = response.data;

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || '로그인에 실패하셨습니다'
      );
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};
