import { useCallback, useEffect, useState } from 'react';
import { getMyFinancial, type MyFinancialResult } from '../api/financial';
import type {
  AssetCardData,
  InvestCardData,
  PeerFinancialProfile,
} from '../constants/main/mockData';
import { mapToAssetCards, mapToInvestCards, mapToProfile } from '../utils/mapFinancialInfo';

interface MainPageData {
  isLoading: boolean;
  isError: boolean;
  hasAssetInfo: boolean;
  assetCards: AssetCardData[];
  investCards: InvestCardData[];
  myProfile: PeerFinancialProfile | null;
  // 챗봇 컨텍스트로 넘기기 위한 원본 응답
  financialInfo: MyFinancialResult | null;
}

const INITIAL_DATA: MainPageData = {
  isLoading: false,
  isError: false,
  hasAssetInfo: false,
  assetCards: [],
  investCards: [],
  myProfile: null,
  financialInfo: null,
};

// 내 금융정보를 조회한다.
// enabled=false(로그인 안 됨)면 요청 자체를 하지 않는다. (401 → 강제 리다이렉트 방지)
// userId가 바뀌면 이전 사용자의 데이터를 즉시 리셋하고 새로 조회한다.
export const useMainPageData = (enabled: boolean, userId?: number) => {
  const [data, setData] = useState<MainPageData>(() => ({
    ...INITIAL_DATA,
    isLoading: enabled,
  }));

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setData((prev) => ({ ...prev, isLoading: true, isError: false }));
    try {
      const info = await getMyFinancial();
      setData({
        isLoading: false,
        isError: false,
        hasAssetInfo: true,
        assetCards: mapToAssetCards(info),
        investCards: mapToInvestCards(info),
        myProfile: mapToProfile(info),
        financialInfo: info,
      });
    } catch {
      setData((prev) => ({ ...prev, isLoading: false, isError: true }));
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setData(INITIAL_DATA);
      return;
    }

    // 계정이 바뀌면 이전 데이터를 즉시 초기화
    setData({
      ...INITIAL_DATA,
      isLoading: true,
    });

    let cancelled = false;

    getMyFinancial()
      .then((info) => {
        if (cancelled) return;
        setData({
          isLoading: false,
          isError: false,
          hasAssetInfo: true,
          assetCards: mapToAssetCards(info),
          investCards: mapToInvestCards(info),
          myProfile: mapToProfile(info),
          financialInfo: info,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setData((prev) => ({ ...prev, isLoading: false, isError: true }));
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, userId]);

  return { ...data, refetch: fetchData };
};
