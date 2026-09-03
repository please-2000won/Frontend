import { useCallback, useEffect, useState } from 'react';
import { createAnalysis, getLatestAnalysis, type AnalysisResponse } from '../api/analysis';
import type { MyFinancialResult } from '../api/financial';
import {
  AI_ANALYSIS_TEXT,
  DEFAULT_PEER_GROUP_PROFILE,
  DEFAULT_RISK,
  type PeerFinancialProfile,
  type RiskInfo,
} from '../constants/main/mockData';
import { mapToPeerGroupProfile } from '../utils/mapFinancialInfo';
import {
  financialFingerprint,
  loadAnalyzedFingerprint,
  loadCachedAnalysis,
  saveCachedAnalysis,
} from '../utils/analysisStorage';

interface PeerGroupAnalysisData {
  isLoading: boolean;
  peerGroupProfile: PeerFinancialProfile;
  aiAnalysisText: string;
  risk: RiskInfo | null;
  analysis: AnalysisResponse | null;
  // 현재 보여주는 분석이 기준으로 삼은 자산 정보의 지문
  analyzedFingerprint: string | null;
}

const INITIAL_DATA: PeerGroupAnalysisData = {
  isLoading: true,
  peerGroupProfile: DEFAULT_PEER_GROUP_PROFILE,
  aiAnalysisText: AI_ANALYSIS_TEXT,
  risk: null,
  analysis: null,
  analyzedFingerprint: null,
};

// 게스트 모드일 때는 API를 호출하지 않고 목데이터를 그대로 보여준다.
const GUEST_DATA: PeerGroupAnalysisData = {
  isLoading: false,
  peerGroupProfile: DEFAULT_PEER_GROUP_PROFILE,
  aiAnalysisText: AI_ANALYSIS_TEXT,
  risk: DEFAULT_RISK,
  analysis: null,
  analyzedFingerprint: null,
};

const toPeerGroupData = (
  analysis: AnalysisResponse,
  analyzedFingerprint: string | null
): PeerGroupAnalysisData => ({
  isLoading: false,
  peerGroupProfile: mapToPeerGroupProfile(analysis),
  aiAnalysisText: analysis.analysisComment || AI_ANALYSIS_TEXT,
  risk: {
    riskLevel: analysis.riskResult.riskLevel,
    summary: analysis.riskResult.summary,
    totalRiskScore: analysis.totalRiskScore,
    incomeBalanceRiskScore: analysis.riskResult.incomeBalanceRiskScore,
    debtRiskScore: analysis.riskResult.debtRiskScore,
    investmentConcentrationRiskScore:
      analysis.riskResult.investmentConcentrationRiskScore,
  },
  analysis,
  analyzedFingerprint,
});

// 금융정보(hasAssetInfo)가 있어야 비교할 피어 그룹이 존재하므로, 있을 때만 조회한다.
// GET은 "페이지에 새로 접근했을 때" 최근 분석 결과를 불러오는 용도로만 쓴다.
// 새 분석 생성(POST)은 "다시 분석하기"에서만 한다. (reanalyze)
export const usePeerGroupAnalysis = (
  isGuestMode: boolean,
  hasAssetInfo: boolean,
  userId?: number,
  financialInfo?: MyFinancialResult | null
) => {
  const currentFingerprint = financialFingerprint(financialInfo);

  // 캐시가 있으면 우선 보여주고 뒤에서 갱신한다. (stale-while-revalidate)
  const [data, setData] = useState<PeerGroupAnalysisData>(() => {
    if (isGuestMode) return GUEST_DATA;
    const cached = loadCachedAnalysis(userId);
    return cached
      ? toPeerGroupData(cached, loadAnalyzedFingerprint(userId))
      : INITIAL_DATA;
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isGuestMode || !hasAssetInfo) return;

    let cancelled = false;

    const load = async () => {
      try {
        const analysis = await getLatestAnalysis();
        if (cancelled) return;
        // GET은 이 분석이 어떤 자산 정보 기준인지 알 수 없다.
        // 이전에 저장해둔 지문이 있으면 그대로 쓰고,
        // 없으면 지금 자산 정보 기준이라고 낙관적으로 가정한다.
        const fingerprint = loadAnalyzedFingerprint(userId) ?? currentFingerprint;
        setData(toPeerGroupData(analysis, fingerprint));
        saveCachedAnalysis(analysis, userId, fingerprint);
      } catch {
        if (!cancelled) setData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [isGuestMode, hasAssetInfo, userId, currentFingerprint]);

  // "다시 분석하기" 버튼에서 사용: 항상 새 분석을 생성한다. (GET 없이 POST만)
  const reanalyze = useCallback(async () => {
    if (isGuestMode || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const analysis = await createAnalysis();
      // 방금 만든 분석은 현재 자산 정보 기준이다.
      setData(toPeerGroupData(analysis, currentFingerprint));
      saveCachedAnalysis(analysis, userId, currentFingerprint);
    } catch {
      // 실패 시 기존 데이터를 유지한다.
    } finally {
      setIsAnalyzing(false);
    }
  }, [isGuestMode, isAnalyzing, userId, currentFingerprint]);

  // 현재 자산 정보가 분석 기준과 달라졌는지 (분석 결과가 예전 정보 기준인지)
  const isStale =
    !isGuestMode &&
    data.analysis != null &&
    data.analyzedFingerprint != null &&
    currentFingerprint != null &&
    data.analyzedFingerprint !== currentFingerprint;

  if (isGuestMode) {
    return { ...GUEST_DATA, isAnalyzing: false, isStale: false, reanalyze };
  }

  return { ...data, isAnalyzing, isStale, reanalyze };
};
