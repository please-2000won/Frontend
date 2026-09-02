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

// 게스트 모드일 때는 API를 호출하지 않고 이 목데이터를 그대로 보여준다.
const GUEST_DATA: MainPageData = {
  isLoading: false,
  hasAssetInfo: true,
  assetCards: ASSET_CARDS,
  investCards: INVEST_CARDS,
  myProfile: DEFAULT_MY_PROFILE,
  financialInfo: null,
};

// 실제 API 응답이 있으면 그 값을, 실패하거나 데이터가 없으면 더미 데이터를 사용한다.
export const useMainPageData = (isGuestMode: boolean) => {
  const [data, setData] = useState<MainPageData>({
    isLoading: true,
    hasAssetInfo: false,
    assetCards: ASSET_CARDS,
    investCards: INVEST_CARDS,
    myProfile: DEFAULT_MY_PROFILE,
    financialInfo: null,
  });

  useEffect(() => {
    if (isGuestMode) return;

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
  }, [isGuestMode]);

  return isGuestMode ? GUEST_DATA : data;
};
