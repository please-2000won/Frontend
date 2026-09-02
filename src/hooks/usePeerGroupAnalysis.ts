import { useCallback, useEffect, useState } from 'react';
import { createAnalysis, getLatestAnalysis, type AnalysisResponse } from '../api/analysis';
import {
  AI_ANALYSIS_TEXT,
  DEFAULT_PEER_GROUP_PROFILE,
  type PeerFinancialProfile,
} from '../constants/main/mockData';
import { mapToPeerGroupProfile } from '../utils/mapFinancialInfo';

interface PeerGroupAnalysisData {
  isLoading: boolean;
  peerGroupProfile: PeerFinancialProfile;
  aiAnalysisText: string;
}

const INITIAL_DATA: PeerGroupAnalysisData = {
  isLoading: true,
  peerGroupProfile: DEFAULT_PEER_GROUP_PROFILE,
  aiAnalysisText: AI_ANALYSIS_TEXT,
};

// 게스트 모드일 때는 API를 호출하지 않고 목데이터를 그대로 보여준다.
const GUEST_DATA: PeerGroupAnalysisData = {
  isLoading: false,
  peerGroupProfile: DEFAULT_PEER_GROUP_PROFILE,
  aiAnalysisText: AI_ANALYSIS_TEXT,
};

const toPeerGroupData = (analysis: AnalysisResponse): PeerGroupAnalysisData => ({
  isLoading: false,
  peerGroupProfile: mapToPeerGroupProfile(analysis),
  aiAnalysisText: analysis.analysisComment || AI_ANALYSIS_TEXT,
});

// 금융정보(hasAssetInfo)가 있어야 비교할 피어 그룹이 존재하므로, 있을 때만 조회한다.
// 최초 이용자는 아직 분석 결과가 없을 수 있어 GET이 실패하면 POST로 새로 생성해본다.
export const usePeerGroupAnalysis = (isGuestMode: boolean, hasAssetInfo: boolean) => {
  const [data, setData] = useState<PeerGroupAnalysisData>(INITIAL_DATA);

  useEffect(() => {
    if (isGuestMode || !hasAssetInfo) return;

    let cancelled = false;

    const load = async () => {
      try {
        const analysis = await getLatestAnalysis();
        if (!cancelled) setData(toPeerGroupData(analysis));
      } catch {
        try {
          const analysis = await createAnalysis();
          if (!cancelled) setData(toPeerGroupData(analysis));
        } catch {
          if (!cancelled) setData((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [isGuestMode, hasAssetInfo]);

  // "다시 분석하기" 버튼에서 사용: 항상 새 분석을 생성한다.
  const reanalyze = useCallback(async () => {
    if (isGuestMode) return;
    try {
      const analysis = await createAnalysis();
      setData(toPeerGroupData(analysis));
    } catch {
      // 실패 시 기존 데이터를 유지한다.
    }
  }, [isGuestMode]);

  if (isGuestMode) {
    return { ...GUEST_DATA, reanalyze };
  }

  return { ...data, reanalyze };
};
