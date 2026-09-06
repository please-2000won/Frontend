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
// 자산 정보가 없는 경우(404 등)는 에러가 아니라 hasAssetInfo: false(정보 미입력 상태)로 처리한다.
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
      if (!info || !info.financialProfile) {
        // 데이터가 없거나 비어있는 경우 -> 자산 미입력 상태
        setData({
          ...INITIAL_DATA,
          isLoading: false,
          hasAssetInfo: false,
          isError: false,
        });
        return;
      }

      setData({
        isLoading: false,
        isError: false,
        hasAssetInfo: true,
        assetCards: mapToAssetCards(info),
        investCards: mapToInvestCards(info),
        myProfile: mapToProfile(info),
        financialInfo: info,
      });
    } catch (error: unknown) {
      const err = error as {
        response?: {
          status?: number;
          data?: { code?: string; message?: string };
        };
      };
      const status = err?.response?.status;
      const message = err?.response?.data?.message ?? '';
      // 404 등 자산 정보가 아직 등록되지 않은 경우: 에러가 아니라 '미입력(hasAssetInfo: false)' 상태!
      if (
        status === 404 ||
        status === 204 ||
        message.includes('존재하지') ||
        message.includes('없습니다')
      ) {
        setData({
          ...INITIAL_DATA,
          isLoading: false,
          hasAssetInfo: false,
          isError: false,
        });
      } else {
        // 실제 통신 장애나 서버 오류인 경우에만 isError: true
        setData((prev) => ({ ...prev, isLoading: false, isError: true }));
      }
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
        if (!info || !info.financialProfile) {
          setData({
            ...INITIAL_DATA,
            isLoading: false,
            hasAssetInfo: false,
            isError: false,
          });
          return;
        }

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
      .catch((error: unknown) => {
        if (cancelled) return;
        const err = error as {
          response?: {
            status?: number;
            data?: { code?: string; message?: string };
          };
        };
        const status = err?.response?.status;
        const message = err?.response?.data?.message ?? '';
        // 404 등 자산 정보가 아직 등록되지 않은 경우: 에러가 아니라 '미입력(hasAssetInfo: false)' 상태!
        if (
          status === 404 ||
          status === 204 ||
          message.includes('존재하지') ||
          message.includes('없습니다')
        ) {
          setData({
            ...INITIAL_DATA,
            isLoading: false,
            hasAssetInfo: false,
            isError: false,
          });
        } else {
          // 실제 통신 장애나 서버 오류인 경우에만 isError: true
          setData((prev) => ({ ...prev, isLoading: false, isError: true }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, userId]);

  return { ...data, refetch: fetchData };
};
