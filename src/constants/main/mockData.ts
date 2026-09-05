export interface AssetBreakdownRow {
  label: string;
  value: string;
  emphasis?: boolean;
}

export interface AssetCardData {
  tag: string;
  rows: AssetBreakdownRow[];
  total: string;
}

export interface InvestCardData {
  tag: string;
  amount: string;
}

export interface PeerFinancialProfile {
  totalIncome: number;
  cash: number;
  domesticStock: number;
  foreignStock: number;
  depositBond: number;
  alternative: number;
}

// 위험 분석(위험 단계 + 세부 위험 점수) 표시에 쓰는 값
export interface RiskInfo {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  totalRiskScore: number; // 종합 위험 점수 0~100
  summary: string; // 위험 분석 요약
  incomeBalanceRiskScore?: number; // 수입·지출·저축 균형 위험도
  debtRiskScore?: number; // 보유자산 대비 부채 위험도
  investmentConcentrationRiskScore?: number; // 특정 투자자산 편중 위험도
}

export const DEFAULT_MY_PROFILE: PeerFinancialProfile = {
  totalIncome: 100000,
  cash: 100000,
  domesticStock: 100000,
  foreignStock: 100000,
  depositBond: 100000,
  alternative: 100000,
};

// Peer Group 평균 API가 아직 없어 사용하는 더미 데이터
export const DEFAULT_PEER_GROUP_PROFILE: PeerFinancialProfile = {
  totalIncome: 3200000,
  cash: 850000,
  domesticStock: 700000,
  foreignStock: 550000,
  depositBond: 600000,
  alternative: 200000,
};

export const ASSET_CARDS: AssetCardData[] = [
  {
    tag: '월 가용 금액',
    rows: [
      { label: '월 수입', value: '3,000,000원', emphasis: true },
      { label: '월 고정 지출', value: '-1,000,000원' },
      { label: '월 저축 계획', value: '-1,000,000원' },
    ],
    total: '1,000,000원',
  },
  {
    tag: '현금성 자산 현황',
    rows: [
      { label: '보유 현금성 자산', value: '2,000,000원', emphasis: true },
      { label: '부채', value: '-1,000,000원' },
    ],
    total: '1,000,000원',
  },
];

export const INVEST_CARDS: InvestCardData[] = [
  { tag: '국내 주식', amount: '100,000원' },
  { tag: '해외 주식', amount: '100,000원' },
  { tag: '예·적금 및 채권', amount: '100,000원' },
  { tag: '대체·고위험 자산', amount: '100,000원' },
];

export const AI_ANALYSIS_TEXT =
  '수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로.';
