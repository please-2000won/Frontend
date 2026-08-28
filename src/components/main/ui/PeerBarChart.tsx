import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatWon } from '../../../utils/mapFinancialInfo';
import type { ComparisonMetric } from '../../../utils/buildComparisonGroups';

interface PeerBarChartProps {
  title: string;
  metrics: ComparisonMetric[];
  myLabel: string;
  otherLabel: string;
}

const MY_COLOR = '#00897e';
const OTHER_COLOR = '#b5e6e3';

const PeerBarChart = ({ title, metrics, myLabel, otherLabel }: PeerBarChartProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[20px] font-semibold tracking-[-1px] text-primary-mint-900">{title}</h3>
      <ResponsiveContainer width="100%" height={metrics.length * 72 + 20}>
        <BarChart
          data={metrics}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
          barGap={4}
        >
          <CartesianGrid horizontal={false} stroke="#eee" />
          <XAxis
            type="number"
            tickFormatter={(value: number) => formatWon(value)}
            tick={{ fontSize: 12, fill: '#999' }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={110}
            tick={{ fontSize: 14, fill: '#013e39' }}
          />
          <Tooltip formatter={(value) => formatWon(Number(value))} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey="my" name={myLabel} fill={MY_COLOR} radius={[0, 6, 6, 0]} animationDuration={700} />
          <Bar
            dataKey="other"
            name={otherLabel}
            fill={OTHER_COLOR}
            radius={[0, 6, 6, 0]}
            animationDuration={700}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PeerBarChart;
