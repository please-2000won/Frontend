import type { AnalysisResponse } from '../api/analysis';
import type { MyFinancialResult } from '../api/financial';
import type { AssetCardData, InvestCardData, PeerFinancialProfile } from '../constants/main/mockData';

export const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`;
const formatExpenseWon = (amount: number) => `-${Math.abs(amount).toLocaleString('ko-KR')}원`;

export const mapToAssetCards = (info: MyFinancialResult): AssetCardData[] => {
  const { financialProfile } = info;
  const { monthlyIncome, fixedExpense, savingsGoal, totalAssetAmount, totalDebtAmount, netAssetAmount } =
    financialProfile;

  return [
    {
      tag: '총 수입',
      rows: [
        { label: '월 수입', value: formatWon(monthlyIncome), emphasis: true },
        { label: '고정 지출', value: formatExpenseWon(fixedExpense) },
        { label: '저축', value: formatExpenseWon(savingsGoal) },
      ],
      total: formatWon(monthlyIncome - fixedExpense - savingsGoal),
    },
    {
      tag: '현금',
      rows: [
        { label: '보유 자산', value: formatWon(totalAssetAmount), emphasis: true },
        { label: '부채', value: formatExpenseWon(totalDebtAmount) },
      ],
      total: formatWon(netAssetAmount),
    },
  ];
};

export const mapToInvestCards = (info: MyFinancialResult): InvestCardData[] => {
  const { financialAsset } = info;

  return [
    { tag: '국내 주식', amount: formatWon(financialAsset.domesticStockAmount) },
    { tag: '해외 주식', amount: formatWon(financialAsset.foreignStockAmount) },
    { tag: '예·적금 및 채권', amount: formatWon(financialAsset.depositBondAmount) },
    { tag: '대체·고위험 자산', amount: formatWon(financialAsset.alternativeAmount) },
  ];
};

// Peer Group 비교 / Peer 1:1 비교 차트에서 공통으로 쓰는 원본 수치 프로필
export const mapToProfile = (info: MyFinancialResult): PeerFinancialProfile => {
  const { monthlyIncome, fixedExpense, savingsGoal, netAssetAmount } = info.financialProfile;
  const { domesticStockAmount, foreignStockAmount, depositBondAmount, alternativeAmount } =
    info.financialAsset;

  return {
    totalIncome: monthlyIncome - fixedExpense - savingsGoal,
    cash: netAssetAmount,
    domesticStock: domesticStockAmount,
    foreignStock: foreignStockAmount,
    depositBond: depositBondAmount,
    alternative: alternativeAmount,
  };
};

// Peer Group 비교 차트에서 쓰는 피어 그룹 평균 프로필 (/api/v1/analysis 응답 매핑)
export const mapToPeerGroupProfile = (analysis: AnalysisResponse): PeerFinancialProfile => {
  const { profile, investment } = analysis.benchmarkResult;

  return {
    totalIncome: profile.averageMonthlyIncome,
    cash: profile.averageTotalAssetAmount,
    domesticStock: investment.averageDomesticStockAmount,
    foreignStock: investment.averageForeignStockAmount,
    depositBond: investment.averageDepositBondAmount,
    alternative: investment.averageAlternativeAmount,
  };
};

