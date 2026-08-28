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

export interface ComparisonRowData {
  label: string;
  my: string;
  peer: string;
}

export interface PieLegendItem {
  colorClassName: string;
  label: string;
}

export interface SimilarPersonData {
  similarity: string;
  nickname: string;
}

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
    total: '100,000원',
  },
];

export const INVEST_CARDS: InvestCardData[] = [
  { tag: '국내 주식', amount: '100,000원' },
  { tag: '해외 주식', amount: '100,000원' },
  { tag: '예·적금 및 채권', amount: '100,000원' },
  { tag: '대체·고위험 자산', amount: '100,000원' },
];

export const COMPARISON_ASSET_ROWS: ComparisonRowData[] = [
  { label: '총 수입', my: '100,000원', peer: '100,000원' },
  { label: '현금', my: '100,000원', peer: '100,000원' },
];

export const COMPARISON_INVEST_ROWS: ComparisonRowData[] = [
  { label: '국내 주식', my: '100,000원', peer: '100,000원' },
  { label: '해외 주식', my: '100,000원', peer: '100,000원' },
  { label: '예·적금 및 채권', my: '100,000원', peer: '100,000원' },
  { label: '대체·고위험 자산', my: '100,000원', peer: '100,000원' },
];

export const PIE_LEGEND: PieLegendItem[] = [
  { colorClassName: 'bg-primary-mint-500', label: '국내 주식 25%' },
  { colorClassName: 'bg-primary-mint-300', label: '국내 주식 25%' },
  { colorClassName: 'bg-primary-mint-900', label: '국내 주식 25%' },
  {
    colorClassName: 'bg-white border border-primary-mint-800',
    label: '국내 주식 25%',
  },
];

export const SIMILAR_PEOPLE: SimilarPersonData[] = [
  { similarity: '유사도 70%', nickname: '사나운고양이815' },
  { similarity: '유사도 70%', nickname: '사나운고양이815' },
  { similarity: '유사도 70%', nickname: '사나운고양이815' },
];

export const AI_ANALYSIS_TEXT =
  '수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로 수입과 보유 현금, 국내 주식과 해외 주식부터 해서 모든 금융 자산이 동일합니다. 본인과 비슷한 집단에서 비슷한 수준으로.';
