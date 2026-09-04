import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadChatbotContext } from '../utils/analysisStorage';

// 챗봇 경로/디자인이 확정되지 않아 임시로 두는 페이지.
// AI 분석 카드의 "챗봇에게 질문하기" 버튼이 이곳으로 이동한다.
// 메인 페이지에서 로컬스토리지에 담아둔 컨텍스트(내 금융정보 + 분석 결과)를 읽어온다.
const ChatbotPage = () => {
  const navigate = useNavigate();
  const context = useMemo(() => loadChatbotContext(), []);

  const hasContext = Boolean(context?.financialInfo || context?.analysis);

  return (
    <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-5 py-16">
      <h1 className="text-[32px] font-semibold text-primary-mint-900">
        AI 챗봇에게 질문하기
      </h1>
      <p className="text-[16px] font-medium leading-[1.5] text-gray-700">
        곧 이곳에서 AI 분석 결과에 대해 자유롭게 질문할 수 있어요. (임시 페이지입니다.)
      </p>

      <div className="rounded-[16px] border border-gray-100 bg-white p-6">
        <p className="mb-3 text-[14px] font-semibold text-primary-mint-900">
          챗봇에 전달될 컨텍스트
        </p>
        {hasContext ? (
          <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-all text-[12px] leading-[1.5] text-gray-700">
            {JSON.stringify(
              { financialInfo: context?.financialInfo, analysis: context?.analysis },
              null,
              2
            )}
          </pre>
        ) : (
          <p className="text-[14px] text-gray-700">
            전달된 데이터가 없어요. 메인 페이지에서 분석을 먼저 진행해 주세요.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-fit cursor-pointer rounded-full border border-primary-mint-900 px-5 py-2.5 text-[14px] font-semibold text-primary-mint-900 transition-colors hover:bg-primary-mint-200"
      >
        이전으로 돌아가기
      </button>
    </div>
  );
};

export default ChatbotPage;
