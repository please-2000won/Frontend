import type { AnalysisResponse } from '../api/analysis';
import type { MyFinancialResult } from '../api/financial';

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

// 캐싱으로 인한 잘못된/과거 데이터 노출을 방지하기 위해 로컬 캐시 조회는 항상 null을 반환하도록 비활성화한다.
export const loadCachedAnalysis = (_userId?: number): AnalysisResponse | null =>
  null;

export const loadAnalyzedFingerprint = (_userId?: number): string | null =>
  null;

// 분석 결과 캐싱을 비활성화하여 항상 백엔드 최신 API 결과를 사용하도록 한다.
export const saveCachedAnalysis = (
  _analysis: AnalysisResponse,
  _userId?: number,
  _financialFingerprintValue?: string | null
) => {
  // 캐싱 비활성화: 항상 서버 최신 데이터를 조회
};

// 로그아웃 / 회원탈퇴 시 브라우저 스토리지(로컬 및 세션)를 완전히 비운다.
export const clearAppStorage = () => {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // 무시
  }
};

// 이전 코드와의 호환성을 위해 유지
export const clearAnalysisStorage = clearAppStorage;
