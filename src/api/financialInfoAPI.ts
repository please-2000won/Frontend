import api from './testApiClient';

export interface FinancialProfileResponse {
  age: number;
  monthlyIncome: number;
  fixedExpense: number;
  savingsGoal: number;
  totalAssetAmount: number;
  totalDebtAmount: number;
  netAssetAmount: number;
}

export interface FinancialAssetResponse {
  depositBondAmount: number;
  domesticStockAmount: number;
  foreignStockAmount: number;
  alternativeAmount: number;
  totalFinancialAssetAmount: number;
}

export interface FinancialInfoResponse {
  financialProfile: FinancialProfileResponse;
  financialAsset: FinancialAssetResponse;
}

export interface FinancialProfileRequest {
  age: number;
  monthlyIncome: number;
  fixedExpense: number;
  savingsGoal: number;
  totalAssetAmount: number;
  totalDebtAmount: number;
}

export interface FinancialAssetRequest {
  depositBondAmount: number;
  domesticStockAmount: number;
  foreignStockAmount: number;
  alternativeAmount: number;
}

export interface FinancialInfoRequest {
  financialProfile: FinancialProfileRequest;
  financialAsset: FinancialAssetRequest;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 내 금융 정보 조회
export const getFinancialInfo = async (): Promise<FinancialInfoResponse> => {
  const response =
    await api.get<ApiResponse<FinancialInfoResponse>>('/api/v1/financial-info');
  return response.data.result;
};

// 내 금융 정보 저장
export const updateFinancialInfo = async (
  data: FinancialInfoRequest
): Promise<FinancialInfoResponse> => {
  const response = await api.put<ApiResponse<FinancialInfoResponse>>(
    '/api/v1/financial-info',
    data
  );
  return response.data.result;
};
