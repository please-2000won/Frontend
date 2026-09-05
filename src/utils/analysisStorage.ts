import type { AnalysisResponse } from '../api/analysis';
import type { MyFinancialResult } from '../api/financial';

// 분석은 시간이 걸리므로 마지막 결과를 로컬에 캐싱해두고,
// 페이지 재진입 시 즉시 보여준 뒤(백그라운드 GET으로) 갱신한다. (stale-while-revalidate)
const ANALYSIS_KEY = 'peerfolio:analysis-cache';

interface CachedAnalysis {
  userId: number;
  cachedAt: number;
  analysis: AnalysisResponse;
  // 이 분석이 어떤 자산 정보를 기준으로 만들어졌는지 나타내는 지문.
  // 현재 자산 정보의 지문과 다르면 분석 결과가 예전 정보 기준이라는 뜻이다.
  financialFingerprint?: string | null;
}

// 분석 결과에 영향을 주는 숫자 필드만 뽑아 안정적인 문자열로 만든다.
export const financialFingerprint = (
  info: MyFinancialResult | null | undefined
): string | null => {
  if (!info) return null;
  const p = info.financialProfile;
  const a = info.financialAsset;
  return JSON.stringify([
    p.age,
    p.monthlyIncome,
    p.fixedExpense,
    p.savingsGoal,
    p.totalAssetAmount,
    p.totalDebtAmount,
    a.depositBondAmount,
    a.domesticStockAmount,
    a.foreignStockAmount,
    a.alternativeAmount,
  ]);
};

const loadCachedRecord = (userId?: number): CachedAnalysis | null => {
  try {
    const raw = localStorage.getItem(ANALYSIS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedAnalysis;
    // 다른 계정으로 로그인한 경우 캐시를 쓰지 않는다.
    if (userId != null && parsed.userId !== userId) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const loadCachedAnalysis = (userId?: number): AnalysisResponse | null =>
  loadCachedRecord(userId)?.analysis ?? null;

// 캐시된 분석이 어떤 자산 정보를 기준으로 만들어졌는지의 지문.
export const loadAnalyzedFingerprint = (userId?: number): string | null =>
  loadCachedRecord(userId)?.financialFingerprint ?? null;

export const saveCachedAnalysis = (
  analysis: AnalysisResponse,
  userId?: number,
  financialFingerprintValue?: string | null
) => {
  try {
    const payload: CachedAnalysis = {
      userId: userId ?? 0,
      cachedAt: Date.now(),
      analysis,
      financialFingerprint: financialFingerprintValue ?? null,
    };
    localStorage.setItem(ANALYSIS_KEY, JSON.stringify(payload));
  } catch {
    // 저장 실패(용량 초과/프라이빗 모드 등)는 무시한다.
  }
};

// 로그아웃 / 회원탈퇴 시 캐시를 비운다.
export const clearAnalysisStorage = () => {
  try {
    localStorage.removeItem(ANALYSIS_KEY);
  } catch {
    // 무시
  }
};
