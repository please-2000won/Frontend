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

// 재무 현황(가용 금액/현금성 자산)과 투자 현황을 구분해서 보여주기 위한 그룹핑.
// 라벨은 정보 입력 폼과 동일하게 맞춘다.
export const buildComparisonGroups = (
  my: PeerFinancialProfile,
  other: PeerFinancialProfile
): ComparisonGroup[] => [
  {
    title: '재무 현황',
    metrics: [
      { label: '월 가용 금액', my: my.totalIncome, other: other.totalIncome },
      { label: '현금성 자산', my: my.cash, other: other.cash },
    ],
  },
  {
    title: '투자 현황',
    metrics: [
      { label: '국내 주식', my: my.domesticStock, other: other.domesticStock },
      { label: '해외 주식', my: my.foreignStock, other: other.foreignStock },
      { label: '예·적금 및 채권', my: my.depositBond, other: other.depositBond },
      { label: '대체·고위험 자산', my: my.alternative, other: other.alternative },
    ],
  },
];
