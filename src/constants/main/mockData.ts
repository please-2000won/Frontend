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
