import api from './testApiClient';

export interface UserMeResponse {
  userId: number;
  name: string;
  email: string;
  nickname: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 내 정보 조회
export const getMyInfo = async (): Promise<UserMeResponse> => {
  const response = await api.get<ApiResponse<UserMeResponse>>('/api/v1/users/me');
  return response.data.result;
};
