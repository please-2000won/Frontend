import { useCallback, useEffect, useState } from 'react';
import { createAnalysis, getLatestAnalysis, type AnalysisResponse } from '../api/analysis';
import {
  AI_ANALYSIS_TEXT,
  DEFAULT_PEER_GROUP_PROFILE,
  DEFAULT_RISK,
  type PeerFinancialProfile,
  type RiskInfo,
} from '../constants/main/mockData';
import { mapToPeerGroupProfile } from '../utils/mapFinancialInfo';
import { loadCachedAnalysis, saveCachedAnalysis } from '../utils/analysisStorage';

interface PeerGroupAnalysisData {
  isLoading: boolean;
  peerGroupProfile: PeerFinancialProfile;
  aiAnalysisText: string;
  risk: RiskInfo | null;
  analysis: AnalysisResponse | null;
}

const INITIAL_DATA: PeerGroupAnalysisData = {
  isLoading: true,
  peerGroupProfile: DEFAULT_PEER_GROUP_PROFILE,
  aiAnalysisText: AI_ANALYSIS_TEXT,
  risk: null,
  analysis: null,
};

// 게스트 모드일 때는 API를 호출하지 않고 목데이터를 그대로 보여준다.
const GUEST_DATA: PeerGroupAnalysisData = {
  isLoading: false,
  peerGroupProfile: DEFAULT_PEER_GROUP_PROFILE,
  aiAnalysisText: AI_ANALYSIS_TEXT,
  risk: DEFAULT_RISK,
  analysis: null,
};

const toPeerGroupData = (analysis: AnalysisResponse): PeerGroupAnalysisData => ({
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
});

// 금융정보(hasAssetInfo)가 있어야 비교할 피어 그룹이 존재하므로, 있을 때만 조회한다.
// GET은 "페이지에 새로 접근했을 때" 최근 분석 결과를 불러오는 용도로만 쓴다.
// 새 분석 생성(POST)은 "다시 분석하기"에서만 한다. (reanalyze)
export const usePeerGroupAnalysis = (
  isGuestMode: boolean,
  hasAssetInfo: boolean,
  userId?: number
) => {
  // 캐시가 있으면 우선 보여주고 뒤에서 갱신한다. (stale-while-revalidate)
  const [data, setData] = useState<PeerGroupAnalysisData>(() => {
    if (isGuestMode) return GUEST_DATA;
    const cached = loadCachedAnalysis(userId);
    return cached ? toPeerGroupData(cached) : INITIAL_DATA;
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isGuestMode || !hasAssetInfo) return;

    let cancelled = false;

    const load = async () => {
      try {
        const analysis = await getLatestAnalysis();
        if (cancelled) return;
        setData(toPeerGroupData(analysis));
        saveCachedAnalysis(analysis, userId);
      } catch {
        if (!cancelled) setData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [isGuestMode, hasAssetInfo, userId]);

  // "다시 분석하기" 버튼에서 사용: 항상 새 분석을 생성한다. (GET 없이 POST만)
  const reanalyze = useCallback(async () => {
    if (isGuestMode || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const analysis = await createAnalysis();
      setData(toPeerGroupData(analysis));
      saveCachedAnalysis(analysis, userId);
    } catch {
      // 실패 시 기존 데이터를 유지한다.
    } finally {
      setIsAnalyzing(false);
    }
  }, [isGuestMode, isAnalyzing, userId]);

  if (isGuestMode) {
    return { ...GUEST_DATA, isAnalyzing: false, reanalyze };
  }

  return { ...data, isAnalyzing, reanalyze };
};
