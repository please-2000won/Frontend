import { useCallback, useEffect, useState } from 'react';
import { createAnalysis, getLatestAnalysis, type AnalysisResponse } from '../api/analysis';
import type { MyFinancialResult } from '../api/financial';
import type {
  PeerFinancialProfile,
  RiskInfo,
} from '../constants/main/mockData';
import { mapToPeerGroupProfile } from '../utils/mapFinancialInfo';
import {
  financialFingerprint,
  loadAnalyzedFingerprint,
  loadCachedAnalysis,
  saveAnalyzedFingerprint,
} from '../utils/analysisStorage';

interface PeerGroupAnalysisData {
  isLoading: boolean;
  isError: boolean;
  peerGroupProfile: PeerFinancialProfile | null;
  aiAnalysisText: string;
  risk: RiskInfo | null;
  analysis: AnalysisResponse | null;
  // 이번 분석이 비교한 피어 그룹 인원수
  peerCount: number | null;
  // 이번 분석이 생성된 시각 (ISO date-time)
  analyzedAt: string | null;
  // 현재 보여주는 분석이 기준으로 삼은 자산 정보의 지문
  analyzedFingerprint: string | null;
}

const INITIAL_DATA: PeerGroupAnalysisData = {
  isLoading: false,
  isError: false,
  peerGroupProfile: null,
  aiAnalysisText: '',
  risk: null,
  analysis: null,
  peerCount: null,
  analyzedAt: null,
  analyzedFingerprint: null,
};

const toPeerGroupData = (
  analysis: AnalysisResponse,
  analyzedFingerprint: string | null
): PeerGroupAnalysisData => ({
  isLoading: false,
  isError: false,
  peerGroupProfile: mapToPeerGroupProfile(analysis),
  aiAnalysisText: analysis.analysisComment || '',
  risk: {
    riskLevel: analysis.riskResult?.riskLevel ?? 'LOW',
    summary: analysis.riskResult?.summary ?? '',
    totalRiskScore: analysis.totalRiskScore ?? 0,
    incomeBalanceRiskScore: analysis.riskResult?.incomeBalanceRiskScore,
    debtRiskScore: analysis.riskResult?.debtRiskScore,
    investmentConcentrationRiskScore:
      analysis.riskResult?.investmentConcentrationRiskScore,
  },
  analysis,
  peerCount: analysis.peerCount,
  analyzedAt: analysis.createdAt ?? null,
  analyzedFingerprint,
});

// 금융정보(hasAssetInfo)가 있어야 비교할 피어 그룹이 존재하므로, 있을 때만 조회한다.
// GET은 "페이지에 새로 접근했을 때" 최근 분석 결과를 불러오는 용도로만 쓴다.
// 새 분석 생성(POST)은 "다시 분석하기"에서만 한다. (reanalyze)
// 계정(userId)이 변경되면 이전 사용자의 분석 상태를 즉시 완전 초기화한다.
export const usePeerGroupAnalysis = (
  hasAssetInfo: boolean,
  userId?: number,
  financialInfo?: MyFinancialResult | null
) => {
  const currentFingerprint = financialFingerprint(financialInfo);

  const [data, setData] = useState<PeerGroupAnalysisData>(() => {
    const cached = loadCachedAnalysis(userId);
    return cached
      ? toPeerGroupData(cached, loadAnalyzedFingerprint(userId))
      : { ...INITIAL_DATA, isLoading: hasAssetInfo };
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchLatest = useCallback(async () => {
    if (!hasAssetInfo) return;
    setData((prev) => ({ ...prev, isLoading: true, isError: false }));
    try {
      const analysis = await getLatestAnalysis();
      const storedFingerprint = loadAnalyzedFingerprint(userId);
      let fingerprint = storedFingerprint;
      if (!fingerprint && !analysis.canReanalyze && currentFingerprint) {
        fingerprint = currentFingerprint;
        saveAnalyzedFingerprint(userId, currentFingerprint);
      }
      setData(toPeerGroupData(analysis, fingerprint));
    } catch {
      setData({ ...INITIAL_DATA, isLoading: false, isError: true });
    }
  }, [hasAssetInfo, userId, currentFingerprint]);

  useEffect(() => {
    if (!hasAssetInfo) {
      setData(INITIAL_DATA);
      return;
    }

    // 계정이 바뀌면 이전 분석 데이터를 즉시 초기화
    setData({
      ...INITIAL_DATA,
      isLoading: true,
    });

    let cancelled = false;

    const load = async () => {
      try {
        const analysis = await getLatestAnalysis();
        if (cancelled) return;
        const storedFingerprint = loadAnalyzedFingerprint(userId);
        let fingerprint = storedFingerprint;
        if (!fingerprint && !analysis.canReanalyze && currentFingerprint) {
          fingerprint = currentFingerprint;
          saveAnalyzedFingerprint(userId, currentFingerprint);
        }
        setData(toPeerGroupData(analysis, fingerprint));
      } catch {
        if (!cancelled) {
          setData({ ...INITIAL_DATA, isLoading: false, isError: true });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [hasAssetInfo, userId]);

  // "다시 분석하기" / "새로 분석하기" 버튼에서 사용: 항상 새 분석을 생성한다. (GET 없이 POST만)
  const reanalyze = useCallback(async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const analysis = await createAnalysis();
      // 방금 만든 분석은 현재 자산 정보 기준이다.
      setData(toPeerGroupData(analysis, currentFingerprint));
      saveAnalyzedFingerprint(userId, currentFingerprint);
    } catch {
      alert('분석을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, userId, currentFingerprint]);

  // 현재 자산 정보가 분석 기준과 달라졌는지 (분석 결과가 예전 정보 기준인지)
  const isStale = Boolean(
    // 1) 백엔드에서 직접 계산한 재분석 필요 플래그 (금융정보 해시 불일치)
    data.analysis?.canReanalyze ||
    // 2) 분석 생성 당시의 자산 지문과 현재 자산 지문 불일치
    (data.analysis != null &&
      data.analyzedFingerprint != null &&
      currentFingerprint != null &&
      data.analyzedFingerprint !== currentFingerprint) ||
    // 3) 금융 정보 최종 수정 시각(updatedAt)이 분석 생성 시각(createdAt)보다 뒤인 경우
    (financialInfo?.updatedAt &&
      data.analyzedAt &&
      new Date(financialInfo.updatedAt).getTime() >
        new Date(data.analyzedAt).getTime())
  );

  return { ...data, isAnalyzing, isStale, reanalyze, refetch: fetchLatest };
};
