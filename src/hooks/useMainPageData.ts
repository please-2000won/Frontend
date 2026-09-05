import { useEffect, useState } from 'react';
import { getMyFinancial, type MyFinancialResult } from '../api/financial';
import {
  ASSET_CARDS,
  DEFAULT_MY_PROFILE,
  INVEST_CARDS,
  type AssetCardData,
  type InvestCardData,
  type PeerFinancialProfile,
} from '../constants/main/mockData';
import { mapToAssetCards, mapToInvestCards, mapToProfile } from '../utils/mapFinancialInfo';

interface MainPageData {
  isLoading: boolean;
  hasAssetInfo: boolean;
  assetCards: AssetCardData[];
  investCards: InvestCardData[];
  myProfile: PeerFinancialProfile;
  // 챗봇 컨텍스트로 넘기기 위한 원본 응답
  financialInfo: MyFinancialResult | null;
}

// 내 금융정보를 조회한다. 실패하거나 데이터가 없으면 더미(플레이스홀더)를 그대로 둔다.
// enabled=false(로그인 안 됨)면 요청 자체를 하지 않는다. (401 → 강제 리다이렉트 방지)
export const useMainPageData = (enabled: boolean) => {
  const [data, setData] = useState<MainPageData>(() => ({
    isLoading: enabled,
    hasAssetInfo: false,
    assetCards: ASSET_CARDS,
    investCards: INVEST_CARDS,
    myProfile: DEFAULT_MY_PROFILE,
    financialInfo: null,
  }));

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const fetchData = async () => {
      try {
        const info = await getMyFinancial();
        if (cancelled) return;

        setData({
          isLoading: false,
          hasAssetInfo: true,
          assetCards: mapToAssetCards(info),
          investCards: mapToInvestCards(info),
          myProfile: mapToProfile(info),
          financialInfo: info,
        });
      } catch {
        if (cancelled) return;
        setData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return data;
};
