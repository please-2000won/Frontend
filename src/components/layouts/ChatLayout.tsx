import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import TopNavbar from './TopNavbar';
import ChatRoom from '../chatbot/ChatRoom';

const ChatLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  return (
    <div className="bg-system-background h-screen flex flex-col overflow-hidden">
      <TopNavbar />

      {/* 네브바 아래 영역 */}
      <div className="flex flex-1 min-h-0 pt-[80px]">
        <motion.div
          animate={{
            width: isChatOpen ? '50%' : '100%',
          }}
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
          className="min-h-0 overflow-y-auto no-scrollbar"
        >
          <main className="w-full">
            <Outlet context={{ isChatOpen, setIsChatOpen }} />
          </main>
        </motion.div>

        {/* 오른쪽: 챗봇 */}
        {isChatOpen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            className="h-full flex-shrink-0 bg-system-background text-black border-l border-gray-200 overflow-hidden "
          >
            <ChatRoom onClose={() => setIsChatOpen(false)} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
