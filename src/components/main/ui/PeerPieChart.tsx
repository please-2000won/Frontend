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
  const total = CATEGORIES.reduce((sum, category) => sum + profile[category.key], 0) || 1;
  const data = CATEGORIES.map((category) => ({
    name: category.name,
    value: profile[category.key],
    percent: Math.round((profile[category.key] / total) * 100),
    color: category.color,
  }));

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[16px] font-semibold text-primary-mint-900">
        {label}
      </span>
      <ResponsiveContainer width={220} height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={48}
            outerRadius={90}
            paddingAngle={2}
            minAngle={3}
            animationDuration={700}
          >
            {data.map((entry) => (
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
      <div className="flex flex-col gap-1.5">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-[13px]">
            <span
              className="size-[10px] shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">
              {entry.name} {entry.percent}%
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
