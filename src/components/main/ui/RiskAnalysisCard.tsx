import type { RiskInfo } from '../../../constants/main/mockData';

interface RiskAnalysisCardProps {
  risk: RiskInfo;
}

interface LevelMeta {
  label: string;
  badge: string;
  bar: string;
}

const LEVEL_META: Record<string, LevelMeta> = {
  LOW: {
    label: '낮음',
    badge: 'bg-primary-mint-200 text-primary-mint-900',
    bar: 'bg-primary-mint-800',
  },
  MEDIUM: {
    label: '보통',
    badge: 'bg-amber-100 text-amber-700',
    bar: 'bg-amber-500',
  },
  HIGH: {
    label: '높음',
    badge: 'bg-red-100 text-system-red',
    bar: 'bg-system-red',
  },
};

const SUB_SCORES = [
  { key: 'incomeBalanceRiskScore', label: '수입·지출·저축 균형' },
  { key: 'debtRiskScore', label: '보유자산 대비 부채' },
  { key: 'investmentConcentrationRiskScore', label: '투자자산 편중' },
] as const;

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

const RiskAnalysisCard = ({ risk }: RiskAnalysisCardProps) => {
  const meta = LEVEL_META[risk.riskLevel] ?? LEVEL_META.MEDIUM;

  const subScores = SUB_SCORES.map((item) => ({
    label: item.label as string,
    value: risk[item.key],
  })).filter(
    (item): item is { label: string; value: number } => typeof item.value === 'number'
  );

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-300 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-primary-mint-900">
          위험 분석
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-gray-700">위험 단계</span>
          <span className={`rounded-full px-3 py-1 text-[14px] font-bold ${meta.badge}`}>
            {meta.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[14px] font-medium text-gray-800">종합 위험 점수</span>
          <span className="text-[20px] font-bold text-primary-mint-900">
            {risk.totalRiskScore}
            <span className="text-[14px] font-medium text-gray-300"> / 100</span>
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${meta.bar}`}
            style={{ width: `${clampPercent(risk.totalRiskScore)}%` }}
          />
        </div>
      </div>

      {subScores.length > 0 && (
        <div className="flex flex-col gap-3">
          {subScores.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between text-[14px]">
                <span className="text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-800">{item.value}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-primary-mint-800"
                  style={{ width: `${clampPercent(item.value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-[14px] font-semibold text-primary-mint-900">
          위험 분석 요약
        </span>
        <p className="whitespace-pre-line text-[14px] font-medium leading-[1.6] text-gray-800 sm:text-[15px]">
          {risk.summary}
        </p>
      </div>
    </div>
  );
};

export default RiskAnalysisCard;
