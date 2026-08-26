import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../api/authAPI';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;

  // 로그인 성공 시 호출할 함수
  setAuth: (accessToken: string, refreshToken: string) => void;
  //유저 정보 전용 저장 합수
  setUserInfo: (userInfo: UserInfo) => void;
  // 로그아웃 시 호출할 함수
  clearAuth: () => void;
}

//로컬 스토리지 저장 자동화
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userInfo: null,

      setAuth: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setUserInfo: (userInfo) => set({ userInfo }),

      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, userInfo: null }),
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;
