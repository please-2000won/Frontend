import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.svg';
import useAuthStore from '../../stores/useAuthStore';
import { clearAnalysisStorage } from '../../utils/analysisStorage';

const TopNavbar = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const clearAuth = useAuthStore((state) => state.clearAuth);
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
    if (window.confirm('로그아웃 하시겠습니까?')) {
      clearAuth();
      clearAnalysisStorage();
      setIsOpen(false);
      navigate('/login');
    }
  };

  return (
    <nav className="fixed top-0 left-0 z-10 h-[60px] w-full border-b border-gray-100 bg-system-background">
      <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between px-5">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="peerfolio" className="h-[26px] w-auto" />
        </div>
        {userInfo && (
          <div ref={containerRef} className="group relative">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="cursor-pointer text-[15px] text-black"
            >
              <span className="font-semibold">{userInfo.name}</span>
              <span className="font-medium"> 님</span>
            </button>

            <div
              className={`absolute top-full right-0 z-20 w-[220px] pt-2 transition-opacity group-hover:visible group-hover:opacity-100 ${
                isOpen ? 'visible opacity-100' : 'invisible opacity-0'
              }`}
            >
              <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[12px] text-gray-500">닉네임</p>
                  <p className="text-[16px] font-semibold text-primary-mint-900">
                    {userInfo.nickname}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full cursor-pointer rounded-lg border border-primary-mint-800 py-2.5 text-[14px] font-semibold text-primary-mint-800 transition-colors hover:bg-primary-mint-200"
                >
                  로그아웃
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/withdraw')}
                  className="cursor-pointer text-center text-[12px] text-gray-500 underline underline-offset-2 transition-colors hover:text-system-red"
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
