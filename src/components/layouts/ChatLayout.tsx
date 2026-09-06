import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import TopNavbar from './TopNavbar';
import ChatRoom from '../chatbot/ChatRoom';

const ChatLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="bg-system-background h-screen flex flex-col overflow-hidden">
      <TopNavbar />
      <div className="flex flex-1 min-h-0 pt-[60px] relative">
        {/* 본문: lg 이상에서 채팅 열리면 절반으로 줄어듦 */}
        <div
          className={`min-h-0 overflow-y-auto no-scrollbar w-full transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isChatOpen ? 'lg:w-1/2' : 'lg:w-full'
          }`}
        >
          <main className="w-full">
            <Outlet context={{ isChatOpen, setIsChatOpen }} />
          </main>
        </div>

        {/*
          채팅 패널: ChatRoom 인스턴스는 이 하나뿐!
          화면 크기가 lg 기준(1024px)을 넘나들어도 컴포넌트가 리마운트되지 않으므로
          대화 내용(messages state)이 절대 초기화되지 않음.

          - 모바일(lg 미만): fixed + translate-x로 전체화면 슬라이드 인/아웃
          - 데스크탑(lg 이상): static 배치 + width만 트랜지션 (0 <-> 50%)
        */}
        <div
          className={`
            fixed inset-0 top-[60px] z-50 w-full
            lg:static lg:inset-auto lg:top-auto lg:z-auto
            lg:h-full lg:flex-shrink-0 lg:border-l lg:border-gray-200
            bg-system-background text-black overflow-hidden
            transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:translate-x-0
            lg:transition-[width] lg:duration-500 lg:ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isChatOpen ? 'lg:w-1/2' : 'lg:w-0'}
          `}
        >
          <div className="h-full w-full">
            <ChatRoom onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
