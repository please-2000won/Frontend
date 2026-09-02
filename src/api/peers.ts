import api from './axiosInstance';
import type { ApiResponse } from './analysis';

// 메인 페이지 하단 "나와 유사한 사람들" 카드에 쓰는 랜덤 피어 정보
export interface PeerCardResponse {
  peerUserId: number;
  nickname: string;
  similarityScore: number;
}

export interface InvestmentAssetSummary {
  depositBondAmount: number;
  domesticStockAmount: number;
  foreignStockAmount: number;
  alternativeAmount: number;
  depositBondRatio: number;
  domesticStockRatio: number;
  foreignStockRatio: number;
  alternativeRatio: number;
}

export interface PeerFinancialSummary {
  nickname: string;
  totalIncome: number;
  cash: number;
  investmentAsset: InvestmentAssetSummary;
}

export interface PeerComparisonResponse {
  me: PeerFinancialSummary;
  peer: PeerFinancialSummary;
}

// 페이지 접근 시 보여줄 랜덤 피어 목록(기본 3명)
export const getRandomPeers = async (size = 3): Promise<PeerCardResponse[]> => {
  const response = await api.get<ApiResponse<PeerCardResponse[]>>(
    '/api/v1/peers/random',
    { params: { size } }
  );
  return response.data.result;
};

// 특정 피어를 눌렀을 때 나와의 1:1 비교 데이터
export const getPeerComparison = async (
  peerUserId: number
): Promise<PeerComparisonResponse> => {
  const response = await api.get<ApiResponse<PeerComparisonResponse>>(
    `/api/v1/peers/${peerUserId}`
  );
  return response.data.result;
};
