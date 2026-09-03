import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.svg';
import useAuthStore from '../../stores/useAuthStore';
import useGuestModeStore from '../../stores/useGuestModeStore';
import { clearAnalysisStorage } from '../../utils/analysisStorage';

const TopNavbar = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isGuestMode = useGuestModeStore((state) => state.isGuestMode);
  const disableGuestMode = useGuestModeStore((state) => state.disableGuestMode);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    clearAuth();
    disableGuestMode();
    clearAnalysisStorage();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 z-10 h-[80px] w-full border-b border-gray-100 bg-system-background">
      <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between px-5">
        <div>
          <img src={logo} alt="peerfolio" className="w-[186px] h-[40px]" />
        </div>
        {!userInfo && isGuestMode && (
          <div className="flex items-center gap-3">
            <span className="text-[16px] text-gray-700">
              게스트로 둘러보는 중
            </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="cursor-pointer rounded-full border border-primary-mint-900 px-4 py-1.5 text-[14px] font-semibold text-primary-mint-900"
            >
              로그인하기
            </button>
          </div>
        )}
        {userInfo && (
          <div ref={containerRef} className="group relative">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="cursor-pointer text-[24px] text-black"
            >
              <span className="font-semibold">{userInfo.name}</span>
              <span className="font-medium"> 님</span>
            </button>

            <div
              className={`absolute top-full right-0 z-20 w-[220px] pt-2 transition-opacity group-hover:visible group-hover:opacity-100 ${
                isOpen ? 'visible opacity-100' : 'invisible opacity-0'
              }`}
            >
              <div className="rounded-[12px] border border-gray-100 bg-white p-5 shadow-lg">
                <p className="text-[13px] text-gray-700">닉네임</p>
                <p className="mb-4 text-[18px] font-semibold text-primary-mint-900">
                  {userInfo.nickname}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full cursor-pointer rounded-[8px] bg-gray-100 py-[10px] text-[14px] font-semibold text-system-red mb-3"
                >
                  로그아웃
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/withdraw')}
                  className="w-full cursor-pointer rounded-[8px] bg-gray-100 py-[10px] text-[14px] font-semibold text-system-red"
                >
                  회원탈퇴
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
