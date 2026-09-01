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
  similarity: string;
  nickname: string;
  financialProfile: PeerFinancialProfile;
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
      { label: '고정 지출', value: '-1,000,000원' },
      { label: '저축', value: '-1,000,000원' },
    ],
    total: '100,000원',
  },
  {
    tag: '현금',
    rows: [
      { label: '보유 자산', value: '2,000,000원', emphasis: true },
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

export const SIMILAR_PEOPLE: SimilarPersonData[] = [
  {
    similarity: '유사도 70%',
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
    similarity: '유사도 65%',
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
    similarity: '유사도 62%',
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

export const AI_ANALYSIS_TEXT =
  '수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로.';
