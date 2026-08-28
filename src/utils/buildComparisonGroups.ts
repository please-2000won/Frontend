import type { PeerFinancialProfile } from '../constants/main/mockData';

export interface ComparisonMetric {
  label: string;
  my: number;
  other: number;
}

export interface ComparisonGroup {
  title: string;
  metrics: ComparisonMetric[];
}

// 경제적 여건(수입/현금)과 투자 자산(주식/예적금 등)을 구분해서 보여주기 위한 그룹핑
export const buildComparisonGroups = (
  my: PeerFinancialProfile,
  other: PeerFinancialProfile
): ComparisonGroup[] => [
  {
    title: '경제적 여건',
    metrics: [
      { label: '총 수입', my: my.totalIncome, other: other.totalIncome },
      { label: '현금', my: my.cash, other: other.cash },
    ],
  },
  {
    title: '투자 자산',
    metrics: [
      { label: '국내 주식', my: my.domesticStock, other: other.domesticStock },
      { label: '해외 주식', my: my.foreignStock, other: other.foreignStock },
      { label: '예·적금 및 채권', my: my.depositBond, other: other.depositBond },
      { label: '대체·고위험 자산', my: my.alternative, other: other.alternative },
    ],
  },
];
