import type { AnalysisResponse } from '../api/analysis';
import type { MyFinancialResult } from '../api/financial';

// 분석은 시간이 걸리므로 마지막 결과를 로컬에 캐싱해두고,
// 페이지 재진입 시 즉시 보여준 뒤(백그라운드 GET으로) 갱신한다. (stale-while-revalidate)
const ANALYSIS_KEY = 'peerfolio:analysis-cache';
// 챗봇에게 넘겨야 하는 컨텍스트(내 금융정보 + 분석 결과)를 담아둔다.
const CHATBOT_KEY = 'peerfolio:chatbot-context';

interface CachedAnalysis {
  userId: number;
  cachedAt: number;
  analysis: AnalysisResponse;
}

export interface ChatbotContext {
  updatedAt: number;
  userId: number;
  financialInfo: MyFinancialResult | null;
  analysis: AnalysisResponse | null;
}

export const loadCachedAnalysis = (userId?: number): AnalysisResponse | null => {
  try {
    const raw = localStorage.getItem(ANALYSIS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedAnalysis;
    // 다른 계정으로 로그인한 경우 캐시를 쓰지 않는다.
    if (userId != null && parsed.userId !== userId) return null;
    return parsed.analysis ?? null;
  } catch {
    return null;
  }
};

export const saveCachedAnalysis = (analysis: AnalysisResponse, userId?: number) => {
  try {
    const payload: CachedAnalysis = {
      userId: userId ?? 0,
      cachedAt: Date.now(),
      analysis,
    };
    localStorage.setItem(ANALYSIS_KEY, JSON.stringify(payload));
  } catch {
    // 저장 실패(용량 초과/프라이빗 모드 등)는 무시한다.
  }
};

export const loadChatbotContext = (): ChatbotContext | null => {
  try {
    const raw = localStorage.getItem(CHATBOT_KEY);
    return raw ? (JSON.parse(raw) as ChatbotContext) : null;
  } catch {
    return null;
  }
};

export const saveChatbotContext = (
  context: Omit<ChatbotContext, 'updatedAt'>
) => {
  try {
    localStorage.setItem(
      CHATBOT_KEY,
      JSON.stringify({ ...context, updatedAt: Date.now() })
    );
  } catch {
    // 무시
  }
};

// 로그아웃 / 회원탈퇴 시 캐시를 비운다.
export const clearAnalysisStorage = () => {
  try {
    localStorage.removeItem(ANALYSIS_KEY);
    localStorage.removeItem(CHATBOT_KEY);
  } catch {
    // 무시
  }
};
