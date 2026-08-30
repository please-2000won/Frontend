import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

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
    clearAuth();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 z-10 h-[80px] w-full border-b border-gray-100 bg-system-background">
      <div className="mx-auto flex h-full max-w-[1080px] items-center justify-end px-5">
        {userInfo && (
          <div ref={containerRef} className="group relative">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="cursor-pointer text-[24px] tracking-[-1.2px] text-black"
            >
              <span className="font-semibold">{userInfo.name}</span>
              <span className="font-medium"> 님</span>
            </button>

            <div
              className={`absolute top-full right-0 z-20 mt-2 w-[220px] rounded-[12px] border border-gray-100 bg-white p-5 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 ${
                isOpen ? 'visible opacity-100' : 'invisible opacity-0'
              }`}
            >
              <p className="text-[13px] text-gray-300">닉네임</p>
              <p className="mb-4 text-[18px] font-semibold text-primary-mint-900">
                {userInfo.nickname}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full cursor-pointer rounded-[8px] bg-gray-100 py-[10px] text-[14px] font-semibold text-system-red"
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
