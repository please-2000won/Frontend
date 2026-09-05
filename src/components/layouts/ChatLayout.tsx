import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopNavbar from './TopNavbar';
import ChatRoom from '../chatbot/ChatRoom';

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isDesktop;
};

const TRANSITION =
  'transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]';
const FADE_TRANSITION = 'transition-opacity duration-300 ease-out';

type Mode = 'desktop' | 'mobile';

const ChatLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const [isChatMounted, setIsChatMounted] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  const [displayMode, setDisplayMode] = useState<Mode>(
    isDesktop ? 'desktop' : 'mobile'
  );
  const [isSwitchingMode, setIsSwitchingMode] = useState(false);
  // 이번 전환이 "모바일 → 데스크탑(넓어지는)" 방향인지 기억
  const [isGrowingToDesktop, setIsGrowingToDesktop] = useState(false);

  useEffect(() => {
    const targetMode: Mode = isDesktop ? 'desktop' : 'mobile';
    if (targetMode === displayMode) return;

    if (!isChatOpen) {
      setDisplayMode(targetMode);
      return;
    }

    const growing = targetMode === 'desktop';
    setIsGrowingToDesktop(growing);
    setIsSwitchingMode(true); // 1) 숨김

    const id1 = requestAnimationFrame(() => {
      // 2) 숨겨진 채로 모드 교체 + 최종 상태로 스냅
      setDisplayMode(targetMode);
      setIsChatMounted(true);
      setIsChatExpanded(true);

      requestAnimationFrame(() => setIsSwitchingMode(false)); // 3) 다시 보여줌
    });
    return () => cancelAnimationFrame(id1);
  }, [isDesktop, isChatOpen, displayMode]);

  // 사용자가 직접 열고 닫을 때의 정상 애니메이션
  useEffect(() => {
    if (isChatOpen) {
      setIsChatMounted(true);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsChatExpanded(true))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setIsChatExpanded(false);
      const timeout = setTimeout(() => setIsChatMounted(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isChatOpen]);

  return (
    <div className="bg-system-background h-screen flex flex-col overflow-hidden">
      <TopNavbar />
      <div className="flex flex-1 min-h-0 pt-[60px]">
        <div
          className={`min-h-0 overflow-y-auto no-scrollbar ${TRANSITION} ${
            displayMode === 'desktop' && isChatExpanded ? 'w-1/2' : 'w-full'
          }`}
        >
          <main className="w-full">
            <Outlet context={{ isChatOpen, setIsChatOpen }} />
          </main>
        </div>

        {/* 데스크탑 패널: 넓어지는 방향일 때만 페이드인 적용 */}
        {isChatMounted && displayMode === 'desktop' && (
          <div
            className={`h-full flex-shrink-0 bg-system-background text-black border-l border-gray-200 overflow-hidden ${
              isSwitchingMode ? '' : TRANSITION
            } ${isGrowingToDesktop ? FADE_TRANSITION : ''} ${
              isChatExpanded ? 'w-1/2' : 'w-0'
            } ${
              isSwitchingMode && isGrowingToDesktop
                ? 'opacity-0'
                : 'opacity-100'
            }`}
          >
            <div className="h-full w-[50vw] sm:w-full">
              <ChatRoom onClose={() => setIsChatOpen(false)} />
            </div>
          </div>
        )}

        {/* 모바일 패널: 좁아지는 방향일 때만 페이드인 적용 */}
        <AnimatePresence>
          {isChatOpen && displayMode === 'mobile' && (
            <motion.div
              key="mobile-chat"
              initial={{ x: '100%' }}
              animate={{
                x: 0,
                opacity: isSwitchingMode && !isGrowingToDesktop ? 0 : 1,
              }}
              exit={{
                x: '100%',
                transition: { duration: isSwitchingMode ? 0 : 0.5 },
              }}
              transition={{
                x: {
                  type: isSwitchingMode ? 'tween' : 'spring',
                  bounce: 0,
                  duration: isSwitchingMode ? 0 : 0.5,
                },
                opacity: { duration: 0.3, ease: 'easeOut' },
              }}
              className="fixed inset-0 top-[60px] z-50 bg-system-background text-black overflow-hidden w-full"
            >
              <ChatRoom onClose={() => setIsChatOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatLayout;
