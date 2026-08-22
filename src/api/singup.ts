import api from './axiosInstance';
import axios from 'axios';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export const signUpUser = async (userData: SignUpData) => {
  try {
    const response = await api.post(`/api/users/signup`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || '회원가입 요청에 실패하였습니다.'
      );
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};
