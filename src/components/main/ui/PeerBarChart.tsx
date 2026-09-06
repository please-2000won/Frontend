import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatWon } from '../../../utils/mapFinancialInfo';
import type { ComparisonMetric } from '../../../utils/buildComparisonGroups';
import {
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
} from './chartTooltipStyle';

interface PeerBarChartProps {
  title: string;
  metrics: ComparisonMetric[];
  myLabel: string;
  otherLabel: string;
}

const MY_COLOR = '#00897e';
const OTHER_COLOR = '#a3e4df';

// 값이 아주 작아도(0 제외) 최소 너비만큼은 보이도록 한다.
const minBarSize = (value: number | null | undefined) =>
  value != null && value > 0 ? 4 : 0;

const PeerBarChart = ({ title, metrics, myLabel, otherLabel }: PeerBarChartProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[18px] font-bold tracking-[-0.03em] text-primary-mint-900">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={metrics.length * 72 + 24}>
        <BarChart
          data={metrics}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 16 }}
          barGap={4}
        >
          <CartesianGrid horizontal={false} stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={(value: number) => formatWon(value)}
            tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={125}
            tick={{ fontSize: 14, fill: '#111827', fontWeight: 600 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip
            formatter={(value) => formatWon(Number(value))}
            contentStyle={TOOLTIP_CONTENT_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
            itemStyle={TOOLTIP_ITEM_STYLE}
            cursor={{ fill: 'rgba(0, 137, 126, 0.06)' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 10 }}
            formatter={(value) => (
              <span style={{ color: '#111827', fontWeight: 600, marginLeft: 2 }}>
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="my"
            name={myLabel}
            fill={MY_COLOR}
            radius={[0, 6, 6, 0]}
            minPointSize={minBarSize}
            animationDuration={700}
          />
          <Bar
            dataKey="other"
            name={otherLabel}
            fill={OTHER_COLOR}
            radius={[0, 6, 6, 0]}
            minPointSize={minBarSize}
            animationDuration={700}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeerBarChart;
