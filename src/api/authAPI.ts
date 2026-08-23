import api from './axiosInstance';

// 백엔드 공통 응답 구조 작성필요

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

//토큰
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// 내정보 조회
export interface UserInfo {
  userId: number;
  name: string;
  email: string;
  nickname: string;
}

//회원가입
//성공 여부 확인
export const signup = async (signupData: SignupRequest): Promise<void> => {
  await api.post('/api/v1/auth/signup', signupData);
};

//로그인
export const login = async (credentials: LoginRequest): Promise<AuthTokens> => {
  const response = await api.post<AuthTokens>(
    '/api/v1/auth/login',
    credentials
  );

  return response.data;
};

//로그아웃
export const logout = async (): Promise<void> => {
  await api.post('api/v1/auth/logout');
};

//내 정보 조회
export const getMyInfo = async (): Promise<UserInfo> => {
  const response = await api.get<UserInfo>('/api/v1/users/me');

  return response.data;
};
