import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GuestModeState {
  isGuestMode: boolean;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
}

// 로그인 없이 메인페이지를 목데이터로 체험해볼 수 있게 하는 별도 스토어.
// 팀원이 관리하는 useAuthStore(accessToken 등)와는 분리해서 둔다.
const useGuestModeStore = create<GuestModeState>()(
  persist(
    (set) => ({
      isGuestMode: false,
      enableGuestMode: () => set({ isGuestMode: true }),
      disableGuestMode: () => set({ isGuestMode: false }),
    }),
    { name: 'guest-mode-storage' }
  )
);

export default useGuestModeStore;
