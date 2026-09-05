import api from './axiosInstance';

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T; // 실제 데이터는 여기에 들어감
}

export interface FinacialSaveRequest {
  financialProfile: {
    age: number;
    monthlyIncome: number;
    fixedExpense: number;
    savingsGoal: number;
    totalAssetAmount: number;
    totalDebtAmount: number;
  };
  financialAsset: {
    depositBondAmount: number;
    domesticStockAmount: number;
    foreignStockAmount: number;
    alternativeAmount: number;
  };
}

export interface MyFinancialResult {
  financialProfile: {
    age: number;
    monthlyIncome: number;
    fixedExpense: number;
    savingsGoal: number;
    totalAssetAmount: number;
    totalDebtAmount: number;
    netAssetAmount: number;
  };
  financialAsset: {
    depositBondAmount: number;
    domesticStockAmount: number;
    foreignStockAmount: number;
    alternativeAmount: number;
    totalFinancialAssetAmount: number;
  };
  // 금융 정보 최종 수정 시각 (ISO date-time)
  updatedAt?: string;
}

//내 금융정보 저장(요청 리퀘 있고, 응답 없음)
export const saveFinancial = async (
  data: FinacialSaveRequest
): Promise<void> => {
  await api.put<ApiResponse<void>>('/api/v1/financial-info', data);
};

//내 금융정보 조회(요청 리퀘 없고, 응답 있음)
export const getMyFinancial = async (): Promise<MyFinancialResult> => {
  const response = await api.get<ApiResponse<MyFinancialResult>>(
    '/api/v1/financial-info'
  );
  return response.data.result;
};
