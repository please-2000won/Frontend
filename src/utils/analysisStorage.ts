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

// 계정(userId)별로 분석 시점의 금융 정보 지문(fingerprint)을 안전하게 격리 저장한다.
const FINGERPRINT_PREFIX = 'peerfolio:analyzed-fingerprint:';

// 캐싱으로 인한 잘못된/과거 데이터 노출을 방지하기 위해 분석 결과 데이터 캐시 조회는 비활성화한다.
export const loadCachedAnalysis = (_userId?: number): AnalysisResponse | null =>
  null;

export const loadAnalyzedFingerprint = (userId?: number): string | null => {
  if (!userId) return null;
  try {
    return localStorage.getItem(`${FINGERPRINT_PREFIX}${userId}`);
  } catch {
    return null;
  }
};

export const saveAnalyzedFingerprint = (
  userId: number | undefined,
  fingerprint: string | null | undefined
) => {
  if (!userId || !fingerprint) return;
  try {
    localStorage.setItem(`${FINGERPRINT_PREFIX}${userId}`, fingerprint);
  } catch {
    // 무시
  }
};

// 분석 결과 캐싱은 하지 않고, 분석 시점의 금융 지문만 계정별로 안전하게 기록한다.
export const saveCachedAnalysis = (
  _analysis: AnalysisResponse,
  userId?: number,
  financialFingerprintValue?: string | null
) => {
  if (userId && financialFingerprintValue) {
    saveAnalyzedFingerprint(userId, financialFingerprintValue);
  }
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
