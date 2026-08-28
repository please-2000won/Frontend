import { useEffect, useState } from 'react';
import { getFinancialInfo } from '../api/financialInfoAPI';
import { getMyInfo } from '../api/userAPI';
import {
  ASSET_CARDS,
  COMPARISON_ASSET_ROWS,
  COMPARISON_INVEST_ROWS,
  INVEST_CARDS,
  type AssetCardData,
  type ComparisonRowData,
  type InvestCardData,
} from '../constants/main/mockData';
import {
  mapToAssetCards,
  mapToComparisonAssetRows,
  mapToComparisonInvestRows,
  mapToInvestCards,
} from '../utils/mapFinancialInfo';

interface MainPageData {
  isLoading: boolean;
  name: string;
  hasAssetInfo: boolean;
  assetCards: AssetCardData[];
  investCards: InvestCardData[];
  comparisonAssetRows: ComparisonRowData[];
  comparisonInvestRows: ComparisonRowData[];
}

const DEFAULT_NAME = '회원';

// 실제 API 응답이 있으면 그 값을, 실패하거나 데이터가 없으면 더미 데이터를 사용한다.
export const useMainPageData = () => {
  const [data, setData] = useState<MainPageData>({
    isLoading: true,
    name: DEFAULT_NAME,
    hasAssetInfo: false,
    assetCards: ASSET_CARDS,
    investCards: INVEST_CARDS,
    comparisonAssetRows: COMPARISON_ASSET_ROWS,
    comparisonInvestRows: COMPARISON_INVEST_ROWS,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      const [nameResult, financialInfoResult] = await Promise.allSettled([
        getMyInfo(),
        getFinancialInfo(),
      ]);

      if (cancelled) return;

      setData((prev) => {
        const name = nameResult.status === 'fulfilled' ? nameResult.value.name : prev.name;

        if (financialInfoResult.status !== 'fulfilled') {
          return { ...prev, isLoading: false, name };
        }

        const info = financialInfoResult.value;

        return {
          isLoading: false,
          name,
          hasAssetInfo: true,
          assetCards: mapToAssetCards(info),
          investCards: mapToInvestCards(info),
          comparisonAssetRows: mapToComparisonAssetRows(info, COMPARISON_ASSET_ROWS),
          comparisonInvestRows: mapToComparisonInvestRows(info, COMPARISON_INVEST_ROWS),
        };
      });
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
};
