import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatWon } from '../../../utils/mapFinancialInfo';
import type { PeerFinancialProfile } from '../../../constants/main/mockData';
import {
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
} from './chartTooltipStyle';

const CATEGORIES = [
  { key: 'domesticStock', name: '국내 주식', color: '#013e39' },
  { key: 'foreignStock', name: '해외 주식', color: '#00897e' },
  { key: 'depositBond', name: '예·적금 및 채권', color: '#75e0d7' },
  { key: 'alternative', name: '대체·고위험 자산', color: '#b5e6e3' },
] as const;

interface InvestmentPieChartProps {
  label: string;
  profile: PeerFinancialProfile;
}

const InvestmentPieChart = ({ label, profile }: InvestmentPieChartProps) => {
  const total = CATEGORIES.reduce((sum, category) => sum + (profile[category.key] || 0), 0);
  const isZero = total <= 0;

  const data = CATEGORIES.map((category) => ({
    name: category.name,
    value: profile[category.key] || 0,
    percent: isZero ? 0 : Math.round(((profile[category.key] || 0) / total) * 100),
    color: category.color,
  }));

  // 실제 투자 금액이 있는 항목만 원형 차트에 조각으로 표시 (0원인 항목이 minAngle로 인해 왜곡되는 현상 방지)
  const chartData = data.filter((entry) => entry.value > 0);

  if (isZero) {
    return (
      <div className="flex flex-col items-center gap-3">
        <span className="text-[16px] font-semibold text-primary-mint-900">
          {label}
        </span>
        <div className="relative flex size-[220px] items-center justify-center">
          <svg className="size-[180px]" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="16"
            />
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center px-2 text-center">
            <span className="text-[12px] font-medium text-gray-400">투자 자산</span>
            <span className="text-[16px] font-bold text-gray-700">0원</span>
            <span className="text-[11px] font-medium text-gray-400">비중 없음</span>
          </div>
        </div>
        <div className="flex min-h-[98px] flex-col items-center justify-center gap-1 text-center">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-[12px] font-semibold text-gray-600">
            보유 중인 투자 자산 없음
          </span>
          <p className="mt-1 text-[12px] leading-relaxed text-gray-400">
            등록된 투자 자산이 없어
            <br />
            비중 차트가 생성되지 않아요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[16px] font-semibold text-primary-mint-900">
        {label}
      </span>
      <ResponsiveContainer width={220} height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={48}
            outerRadius={90}
            paddingAngle={2}
            minAngle={3}
            animationDuration={700}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [formatWon(Number(value)), name]}
            contentStyle={TOOLTIP_CONTENT_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
            itemStyle={TOOLTIP_ITEM_STYLE}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex min-h-[98px] flex-col justify-center gap-1.5">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-[13px]">
            <span
              className="size-[10px] shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-800 font-medium">
              {entry.name} <strong className="font-bold text-gray-900">{entry.percent}%</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PeerPieChartComparisonProps {
  myLabel: string;
  myProfile: PeerFinancialProfile;
  otherLabel: string;
  otherProfile: PeerFinancialProfile;
}

const PeerPieChartComparison = ({
  myLabel,
  myProfile,
  otherLabel,
  otherProfile,
}: PeerPieChartComparisonProps) => {
  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16">
      <InvestmentPieChart label={myLabel} profile={myProfile} />
      <InvestmentPieChart label={otherLabel} profile={otherProfile} />
    </div>
  );
};

export default PeerPieChartComparison;
