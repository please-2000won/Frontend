import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PeerPieChart from '../components/main/ui/PeerPieChart';
import {
  AI_ANALYSIS_TEXT,
  DEFAULT_PEER_GROUP_PROFILE,
  type PeerFinancialProfile,
} from '../constants/main/mockData';

// 페이지에 전달될 Props (필요에 따라 수정하여 사용하세요)
interface AnalysisChatPageProps {
  myProfile?: PeerFinancialProfile;
}

const AnalysisChatPage = ({
  myProfile = DEFAULT_PEER_GROUP_PROFILE,
}: AnalysisChatPageProps) => {
  const navigate = useNavigate();

  // 챗봇 입력 상태 관리
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: '내 자산 관리를 어떻게 해야할까?', isUser: true },
    {
      id: 2,
      text: '내 자산 관리를 어떻게 해야할지 분석해 드릴게요. 자산 관리는 우선 본인의 수입과 지출을 정확히 파악하는 것에서 시작합니다...',
      isUser: false,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: chatInput, isUser: true },
    ]);
    setChatInput('');

    // AI API 호출 로직
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* 왼쪽: 투자 분석 결과 영역 */}
      <div className="flex w-1/2 flex-col bg-primary-mint-200 overflow-y-auto p-10 2xl:px-20">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 self-start text-gray-700 text-[15px] font-medium hover:text-black"
        >
          ← 뒤로 가기
        </button>

        <h1 className="mb-10 text-[32px] font-bold text-primary-mint-900">
          투자 분석 결과
        </h1>

        {/* 나 vs Peer Group 평균 헤더 */}
        <div className="flex justify-between border-b-2 border-gray-400 pb-2 mb-6 px-10">
          <span className="text-[18px] font-semibold text-gray-800">나</span>
          <span className="text-[18px] font-semibold text-gray-800">
            Peer Group 평균
          </span>
        </div>

        {/* 자산 현황 테이블 */}
        <div className="mb-8 flex flex-col">
          <div className="bg-primary-mint-900 py-1 text-center text-white font-medium mb-4 rounded-sm">
            자산 현황
          </div>
          <div className="flex justify-between px-10 py-3 text-[18px]">
            <span className="font-semibold text-black">100,000원</span>
            <span className="text-gray-800 font-medium">총 수입</span>
            <span className="font-semibold text-black">100,000원</span>
          </div>
          <div className="flex justify-between px-10 py-3 text-[18px]">
            <span className="font-semibold text-black">100,000원</span>
            <span className="text-gray-800 font-medium">현금</span>
            <span className="font-semibold text-black">100,000원</span>
          </div>
        </div>

        {/* 투자 정보 테이블 및 파이 차트 */}
        <div className="mb-10 flex flex-col">
          <div className="bg-primary-mint-900 py-1 text-center text-white font-medium mb-8 rounded-sm">
            투자 정보
          </div>

          <div className="px-4">
            {/* 기존에 만드신 PeerPieChart 컴포넌트 재사용 */}
            <PeerPieChart
              myLabel="나"
              myProfile={myProfile}
              otherLabel="Peer Group 평균"
              otherProfile={DEFAULT_PEER_GROUP_PROFILE}
            />
          </div>
        </div>

        {/* AI 분석 텍스트 영역 */}
        <div className="mt-auto flex flex-col gap-3">
          <h3 className="text-[20px] font-bold text-primary-mint-900">
            AI 분석
          </h3>
          <p className="text-[15px] font-medium leading-relaxed tracking-[-0.5px] text-gray-800 break-keep">
            {AI_ANALYSIS_TEXT}
          </p>
        </div>
      </div>

      {/* 오른쪽: AI 챗봇 영역 */}
      <div className="flex w-1/2 flex-col bg-system-background relative">
        {/* 채팅 내역 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex max-w-[70%] ${
                msg.isUser ? 'self-end' : 'self-start'
              }`}
            >
              {!msg.isUser && (
                <div className="w-10 h-10 rounded-full bg-gray-300 shrink-0 mr-3" /> // 봇 아바타 대체
              )}
              <div
                className={`p-4 rounded-2xl text-[15px] leading-relaxed break-keep ${
                  msg.isUser
                    ? 'bg-primary-mint-900 text-white rounded-tr-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* 채팅 입력창 */}
        <div className="bg-system-background p-6 border-t border-gray-200">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center bg-white border border-gray-300 rounded-full pr-2 pl-6 py-2 shadow-sm"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="무엇이든 물어보세요"
              className="flex-1 bg-transparent outline-none text-[15px]"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-primary-mint-900 flex items-center justify-center cursor-pointer transition-colors hover:bg-primary-mint-800 shrink-0 ml-3"
            >
              {/* 전송 아이콘 대체 (SVG) */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z" fill="white" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnalysisChatPage;
