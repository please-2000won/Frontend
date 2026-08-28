import api from './testApiClient';

// 어드민 테스트 페이지 전용 인증 API.
// authAPI.ts(팀원 코드)는 실제 백엔드 응답 구조(공통 래퍼, verificationCode 등)와
// 아직 어긋나는 부분이 있어 건드리지 않고, 테스트 플로우에 필요한 만큼만 별도로 구현한다.

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface EmailCodeRequest {
  email: string;
}

export interface EmailCodeResponse {
  email: string;
  verificationCode: string | null;
  expiresAt: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  verificationCode: string;
  password: string;
}

export interface SignupResponse {
  userId: number;
  name: string;
  email: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

// 이메일 인증번호 발급
export const requestEmailCode = async (
  data: EmailCodeRequest
): Promise<EmailCodeResponse> => {
  const response = await api.post<ApiResponse<EmailCodeResponse>>(
    '/api/v1/auth/email-code',
    data
  );
  return response.data.result;
};

// 회원가입
export const adminSignup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await api.post<ApiResponse<SignupResponse>>(
    '/api/v1/auth/signup',
    data
  );
  return response.data.result;
};

// 로그인
export const adminLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    '/api/v1/auth/login',
    data
  );
  return response.data.result;
};
