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

export interface SimilarPersonData {
  peerUserId: number;
  similarityScore: number;
  nickname: string;
  financialProfile: PeerFinancialProfile;
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
    tag: '총 수입',
    rows: [
      { label: '월 수입', value: '3,000,000원', emphasis: true },
      { label: '월 고정 지출', value: '-1,000,000원' },
      { label: '월 저축 계획', value: '-1,000,000원' },
    ],
    total: '1,000,000원',
  },
  {
    tag: '보유 자산',
    rows: [
      { label: '현금', value: '2,000,000원', emphasis: true },
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

// 게스트 모드 전용 더미. peerUserId는 실제 API와 겹치지 않도록 음수를 쓴다.
export const SIMILAR_PEOPLE: SimilarPersonData[] = [
  {
    peerUserId: -1,
    similarityScore: 70,
    nickname: '행복한강아지404',
    financialProfile: {
      totalIncome: 3500000,
      cash: 640000,
      domesticStock: 800000,
      foreignStock: 500000,
      depositBond: 450000,
      alternative: 150000,
    },
  },
  {
    peerUserId: -2,
    similarityScore: 65,
    nickname: '느긋한거북이213',
    financialProfile: {
      totalIncome: 2900000,
      cash: 1200000,
      domesticStock: 400000,
      foreignStock: 900000,
      depositBond: 700000,
      alternative: 50000,
    },
  },
  {
    peerUserId: -3,
    similarityScore: 62,
    nickname: '용감한사자678',
    financialProfile: {
      totalIncome: 4100000,
      cash: 300000,
      domesticStock: 1500000,
      foreignStock: 600000,
      depositBond: 200000,
      alternative: 400000,
    },
  },
];

// Peer Group 분석 API가 없을 때 / 게스트 모드에서 쓰는 더미 위험 분석
export const DEFAULT_RISK: RiskInfo = {
  riskLevel: 'MEDIUM',
  totalRiskScore: 48,
  summary:
    '수입 대비 고정지출과 저축 부담은 안정적인 편이지만, 투자 자산이 국내 주식에 다소 집중되어 있어 시장 변동성에 대한 노출이 피어 그룹 평균보다 높은 편이에요.',
  incomeBalanceRiskScore: 32,
  debtRiskScore: 40,
  investmentConcentrationRiskScore: 61,
};

export const AI_ANALYSIS_TEXT =
  '수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로.';
