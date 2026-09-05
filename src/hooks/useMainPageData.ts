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
export const useMainPageData = () => {
  const [data, setData] = useState<MainPageData>({
    isLoading: true,
    hasAssetInfo: false,
    assetCards: ASSET_CARDS,
    investCards: INVEST_CARDS,
    myProfile: DEFAULT_MY_PROFILE,
    financialInfo: null,
  });

  useEffect(() => {
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
  }, []);

  return data;
};
