import { useState, useEffect, useRef } from 'react';

import { postChatMessage, postChatFeedback } from '../../api/chatbot';
import FeedbackModal from './FeedbackModal';

import copy_gray from '../../assets/chatbot/copy-gray.svg';
import copy_black from '../../assets/chatbot/copy-black.svg';

import thumbs_up_gray from '../../assets/chatbot/thumbs-up-gray.svg';
import thumbs_up_black from '../../assets/chatbot/thumbs-up-black.svg';

import thumbs_down_gray from '../../assets/chatbot/thumbs-down-gray.svg';
import thumbs_down_black from '../../assets/chatbot/thumbs-down-black.svg';

import send from '../../assets/chatbot/send-plain-white.svg';
import robot from '../../assets/chatbot/robot-profile.png';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  responseId?: string;
  question?: string;
}

const DEFAULT_QUESTIONS = [
  '내 위험등급은 왜 이렇게 나왔나요?',
  '방어적 자산이 무엇인가요?',
  'Peer 평균과 다르면 위험한가요?',
];

// onClose 타입 정의
interface ChatRoomProps {
  onClose: () => void;
}

const ChatRoom = ({ onClose }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '어떤 데이터 분석을 도와드릴까요?', isBot: true },
  ]);

  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<'LIKE' | 'DISLIKE' | null>(
    null
  );

  // 피드백 대상 메시지 별도 저장
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  //해당 요소를 부르는게 useRef
  const messagesEndRef = useRef<HTMLDivElement>(null);

  //messages에 새로운 내용이 추가되면, 밑바닥(<div>)로 스크롤 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //메시지 전송 함수
  const handleSendMessage = async (textToSend?: string) => {
    const userText = textToSend || inputValue;
    if (!userText.trim()) return;

    const newUserMessage = { id: Date.now(), text: userText, isBot: false };

    setMessages((prev) => [...prev, newUserMessage]);

    //직접 입력한 경우에만 입력창 초기화
    if (!textToSend) {
      setInputValue('');
    }

    try {
      setIsLoading(true);
      const response = await postChatMessage({ message: userText });

      if (response.isSuccess) {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: response.result.answer,
          isBot: true,
          responseId: response.result.responseId,
          question: userText,
        };
        console.log(messages);
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

  const handleFeedback = (type: 'LIKE' | 'DISLIKE', msg: Message) => {
    setFeedbackType(type);
    setSelectedMessage(msg);
    setIsFeedbackOpen(true);
  };

  const handleSendFeedback = async (comment: string) => {
    if (!selectedMessage || !feedbackType) return;

    const { responseId, question, text: answer } = selectedMessage;

    if (!responseId || !question) return;

    try {
      const feedbackResponse = await postChatFeedback({
        responseId,
        message: question,
        answer,
        rating: feedbackType,
        comment,
      });
      console.log(feedbackResponse);
    } catch (error) {
      console.error('피드백 전송 에러:', error);
    } finally {
      setIsFeedbackOpen(false);
      setFeedbackType(null);
      setSelectedMessage(null);
    }
  };
  return (
    <div className="w-full h-full p-6 flex flex-col">
      {/*헤더 */}
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={onClose}
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
                <div className="w-10 h-10 rounded-full flex-shrink-0 mt-1 border border-primary-mint-900">
                  <img src={robot} alt="" />
                </div>
              )}
              <div className="flex flex-col gap-2 items-end">
                <div
                  className={`px-5 py-3 rounded-2xl shadow-sm leading-relaxed text-[16px] break-all ${
                    msg.isBot
                      ? 'bg-white text-black border border-gray-100 rounded-bl-sm py-4 whitespace-pre-wrap'
                      : 'bg-primary-mint-900 text-white rounded-br-sm'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.isBot && (
                  <div className="flex  gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                      className="group cursor-pointer flex-shrink-0 mb-3"
                      title="복사하기"
                    >
                      <img
                        src={copy_gray}
                        alt="복사하기"
                        className="w-4 h-5 block group-hover:hidden"
                      />
                      <img
                        src={copy_black}
                        alt="복사하기"
                        className="w-4 h-5 hidden group-hover:block"
                      />
                    </button>
                    <button
                      onClick={() => handleFeedback('LIKE', msg)}
                      className="group cursor-pointer flex-shrink-0 mb-3"
                      title="좋아요"
                    >
                      <img
                        src={thumbs_up_gray}
                        alt="좋아요"
                        className="w-4 h-5 block group-hover:hidden"
                      />
                      <img
                        src={thumbs_up_black}
                        alt="좋아요"
                        className="w-4 h-5 hidden group-hover:block"
                      />
                    </button>
                    <button
                      onClick={() => handleFeedback('DISLIKE', msg)}
                      className="group cursor-pointer flex-shrink-0 mb-3"
                      title="별로예요"
                    >
                      <img
                        src={thumbs_down_gray}
                        alt="별로예요"
                        className="w-4 h-5 block group-hover:hidden"
                      />
                      <img
                        src={thumbs_down_black}
                        alt="별로예요"
                        className="w-4 h-5 hidden group-hover:block"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 w-full">
            <div className="flex flex-col gap-3 max-w-[55%] items-start">
              <div className="w-10 h-10 rounded-full flex-shrink-0 mt-1 border border-primary-mint-900">
                <img src={robot} alt="" />
              </div>
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

      <div className="flex flex-col w-full gap-3 pt-2">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2">
            {DEFAULT_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                disabled={isLoading}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-primary-mint-100 hover:border-primary-mint-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {question}
              </button>
            ))}
          </div>
        )}

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
            onClick={() => handleSendMessage()}
            disabled={isLoading}
            className="bg-primary-mint-900 w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer"
          >
            <img src={send} alt="전송" />
          </button>
        </div>
      </div>

      {isFeedbackOpen && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          type={feedbackType}
          onClose={() => {
            setIsFeedbackOpen(false);
            setFeedbackType(null);
            setSelectedMessage(null);
          }}
          onSubmit={(_type, comment) => handleSendFeedback(comment)}
        />
      )}
    </div>
  );
};

export default ChatRoom;
