import api from './axiosInstance';

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T; // 실제 데이터는 여기에 들어감
}

// 경제적 여건 관련 피어 그룹 평균
export interface PeerProfileBenchmark {
  averageMonthlyIncome: number;
  averageTotalAssetAmount: number;
}

// 투자 자산 관련 피어 그룹 평균
export interface InvestmentBenchmark {
  peerCount: number;
  averageDepositBondAmount: number;
  averageDomesticStockAmount: number;
  averageForeignStockAmount: number;
  averageAlternativeAmount: number;
  averageDepositBondRatio: number;
  averageDomesticStockRatio: number;
  averageForeignStockRatio: number;
  averageAlternativeRatio: number;
}

export interface BenchmarkResult {
  profile: PeerProfileBenchmark;
  investment: InvestmentBenchmark;
}

export interface RiskResult {
  riskLevel: string; // LOW, MEDIUM, HIGH
  summary: string; // 위험 분석 요약
  // 아래 세부 점수는 백엔드 배포 시점에 따라 아직 응답에 없을 수 있어 optional 처리
  incomeBalanceRiskScore?: number; // 수입·고정지출·저축목표 균형 위험도
  debtRiskScore?: number; // 보유자산 대비 부채 위험도
  investmentConcentrationRiskScore?: number; // 특정 투자자산 편중 위험도
}

export interface AnalysisResponse {
  analysisResultId: number;
  peerCount: number;
  benchmarkResult: BenchmarkResult;
  riskResult: RiskResult;
  totalRiskScore: number;
  analysisComment: string;
  createdAt: string;
}

// 가장 최근 피어 그룹 평균 + AI 분석 결과 조회
export const getLatestAnalysis = async (): Promise<AnalysisResponse> => {
  const response = await api.get<ApiResponse<AnalysisResponse>>(
    '/api/v1/analysis'
  );
  return response.data.result;
};

// 피어 그룹 및 AI 분석 새로 생성(최초 생성 및 "다시 분석하기"에 사용)
export const createAnalysis = async (): Promise<AnalysisResponse> => {
  const response = await api.post<ApiResponse<AnalysisResponse>>(
    '/api/v1/analysis'
  );
  return response.data.result;
};
