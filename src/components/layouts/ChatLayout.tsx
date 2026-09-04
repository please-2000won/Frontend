import { Outlet } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopNavbar from './TopNavbar';
import { postChatMessage } from '../../api/chatbot';

import copy from '../../assets/main/copy-gray.svg';
import send from '../../assets/main/send-plain-white.svg';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const ChatLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState([
    { id: 1, text: '어떤 데이터 분석을 도와드릴까요?', isBot: true },
  ]);

  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //해당 요소를 부르는게 useRef
  const messagesEndRef = useRef<HTMLDivElement>(null);

  //messages에 새로운 내용이 추가되면, 밑바닥(<div>)로 스크롤 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //메시지 전송 함수
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newUserMessage = { id: Date.now(), text: inputValue, isBot: false };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');

    try {
      setIsLoading(true);
      const response = await postChatMessage({ message: userText });

      if (response.isSuccess) {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: response.result.answer,
          isBot: true,
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        throw new Error(response.message || 'API 응답 실패');
      }
    } catch (error) {
      console.error('챗봇 API 에러:', error);

      const errorResponse: Message = {
        id: Date.now() + 1,
        text: '서버와 연결이 불안정합니다. 다시 시도해주세요.',
        isBot: true,
      };
      console.log(messages);
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  //엔터키 입력 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-system-background h-screen flex flex-col overflow-hidden">
      <TopNavbar />

      {/* 네브바 아래 영역 */}
      <div className="flex flex-1 min-h-0 pt-[80px]">
        {/* 왼쪽: 챗봇 열리면 50%, 닫히면 100% */}
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
            {/* 내부 컨텐츠 */}
            <div className="w-full h-full p-6 flex flex-col">
              {/*헤더 */}
              <div className="flex justify-end items-center mb-4">
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-500 hover:text-black font-bold px-2 text-lg"
                >
                  ✕
                </button>
              </div>
              {/*말풍선 대화창*/}
              <div className="flex-1 overflow-y-auto flex flex-col gap-10 no-scrollbar pb-10">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isBot ? 'gap-3 w-full' : 'justify-end'}`}
                  >
                    <div
                      className={`flex flex-col gap-3 max-w-[55%] ${msg.isBot ? 'items-start' : 'items-end'}`}
                    >
                      {msg.isBot && (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                      <div className="flex gap-2 items-end">
                        <div
                          className={`px-5 py-3 rounded-2xl shadow-sm leading-relaxed text-[20px] break-all ${
                            msg.isBot
                              ? 'bg-white text-black border border-gray-100 rounded-bl-sm py-4 whitespace-pre-wrap'
                              : 'bg-primary-mint-900 text-white rounded-br-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        {msg.isBot && (
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(msg.text)
                            }
                            className="cursor-pointer flex-shrink-0 mb-3"
                          >
                            <img
                              src={copy}
                              alt="복사하기"
                              className="w-4 h-5"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 w-full">
                    <div className="flex flex-col gap-3 max-w-[55%] items-start">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 mt-1"></div>
                      <div className="flex gap-2 items-end">
                        <div className="px-5 py-5 rounded-2xl shadow-sm bg-white border border-gray-100 rounded-bl-sm flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0ms' }}
                          ></div>
                          <div
                            className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '150ms' }}
                          ></div>
                          <div
                            className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '300ms' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/*입력창*/}
              <div className="flex w-full gap-4 ">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="무엇이든 물어보세요!"
                  className="flex flex-1 p-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-mint-900 disabled:cursor-not-allowed "
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading} // 로딩 중일 때 클릭 방지
                  className="bg-primary-mint-900 w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer"
                >
                  <img src={send} alt="전송" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
