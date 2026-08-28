import type { FinancialInfoResponse } from '../api/financialInfoAPI';
import type { AssetCardData, ComparisonRowData, InvestCardData } from '../constants/main/mockData';

const formatWon = (amount: number) => `${amount.toLocaleString('ko-KR')}원`;
const formatExpenseWon = (amount: number) => `-${Math.abs(amount).toLocaleString('ko-KR')}원`;

export const mapToAssetCards = (info: FinancialInfoResponse): AssetCardData[] => {
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

export const mapToInvestCards = (info: FinancialInfoResponse): InvestCardData[] => {
  const { financialAsset } = info;

  return [
    { tag: '국내 주식', amount: formatWon(financialAsset.domesticStockAmount) },
    { tag: '해외 주식', amount: formatWon(financialAsset.foreignStockAmount) },
    { tag: '예·적금 및 채권', amount: formatWon(financialAsset.depositBondAmount) },
    { tag: '대체·고위험 자산', amount: formatWon(financialAsset.alternativeAmount) },
  ];
};

// Peer Group 평균은 아직 API가 없어 더미 데이터(peerRows)를 그대로 유지하고,
// "나" 값만 실제 응답으로 대체한다.
export const mapToComparisonAssetRows = (
  info: FinancialInfoResponse,
  peerRows: ComparisonRowData[]
): ComparisonRowData[] => {
  const { monthlyIncome, fixedExpense, savingsGoal, netAssetAmount } = info.financialProfile;
  const myValues = [formatWon(monthlyIncome - fixedExpense - savingsGoal), formatWon(netAssetAmount)];

  return peerRows.map((row, index) => ({ ...row, my: myValues[index] ?? row.my }));
};

export const mapToComparisonInvestRows = (
  info: FinancialInfoResponse,
  peerRows: ComparisonRowData[]
): ComparisonRowData[] => {
  const { domesticStockAmount, foreignStockAmount, depositBondAmount, alternativeAmount } = info.financialAsset;
  const myValues = [
    formatWon(domesticStockAmount),
    formatWon(foreignStockAmount),
    formatWon(depositBondAmount),
    formatWon(alternativeAmount),
  ];

  return peerRows.map((row, index) => ({ ...row, my: myValues[index] ?? row.my }));
};
