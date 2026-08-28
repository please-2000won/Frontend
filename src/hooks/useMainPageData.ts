import { useEffect, useState } from 'react';
import { getMyFinancial } from '../api/financial';
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
}

// 실제 API 응답이 있으면 그 값을, 실패하거나 데이터가 없으면 더미 데이터를 사용한다.
export const useMainPageData = () => {
  const [data, setData] = useState<MainPageData>({
    isLoading: true,
    hasAssetInfo: false,
    assetCards: ASSET_CARDS,
    investCards: INVEST_CARDS,
    myProfile: DEFAULT_MY_PROFILE,
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
