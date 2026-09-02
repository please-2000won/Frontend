import api from './axiosInstance';

// 백엔드 공통 응답 구조 작성필요
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T; // 실제 데이터는 여기에 들어감
}

export interface SignupRequest {
  name: string;
  email: string;
  verificationCode: string;
  password: string;
}
export interface EmailCodeRequest {
  email: string;
}

export interface EmailCodeResult {
  email: string;
  verificationCode: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

//로그인 시 받는 토큰 타입
export interface AuthTokens {
  accessToken: string;
  tokenType: string;
}

// 내정보 조회
export interface UserInfo {
  userId: number;
  name: string;
  email: string;
  nickname: string;
}

export interface WithDrawRequest {
  password: string;
}

//회원가입 API
//성공 여부 확인
export const signup = async (signupData: SignupRequest): Promise<void> => {
  await api.post<ApiResponse<void>>('/api/v1/auth/signup', signupData);
};

//이메일 인증번호 발급 API
export const sendEmailCode = async (
  codeData: EmailCodeRequest
): Promise<EmailCodeResult> => {
  const response = await api.post<ApiResponse<EmailCodeResult>>(
    '/api/v1/auth/email-code',
    codeData
  );
  return response.data.result;
};

//로그인 API
export const login = async (credentials: LoginRequest): Promise<AuthTokens> => {
  const response = await api.post<ApiResponse<AuthTokens>>(
    '/api/v1/auth/login',
    credentials
  );

  return response.data.result;
};

//로그아웃 API
export const logout = async (): Promise<void> => {
  await api.post<ApiResponse<void>>('/api/v1/auth/logout');
};

//내 정보 조회 API
export const getMyInfo = async (): Promise<UserInfo> => {
  const response = await api.get<ApiResponse<UserInfo>>('/api/v1/users/me');

  return response.data.result;
};

//회원 탈퇴 API (delete 인자 전달시 묶어서 전달 필요)
export const withDraw = async (data: WithDrawRequest): Promise<void> => {
  const response = await api.delete<ApiResponse<void>>('/api/v1/users/me', {
    data: data,
  });

  return response.data.result;
};
