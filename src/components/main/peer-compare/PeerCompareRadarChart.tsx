import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { formatWon } from '../../../utils/mapFinancialInfo';
import type { PeerFinancialProfile } from '../../../constants/main/mockData';

interface PeerCompareRadarChartProps {
  myName: string;
  peerName: string;
  myProfile: PeerFinancialProfile;
  peerProfile: PeerFinancialProfile;
}

interface RadarDatum {
  axis: string;
  my: number;
  other: number;
  myRaw: number;
  otherRaw: number;
}

const buildRadarData = (my: PeerFinancialProfile, other: PeerFinancialProfile): RadarDatum[] => {
  const rows = [
    { axis: '수입', myRaw: my.totalIncome, otherRaw: other.totalIncome },
    { axis: '현금', myRaw: my.cash, otherRaw: other.cash },
    { axis: '국내주식', myRaw: my.domesticStock, otherRaw: other.domesticStock },
    { axis: '해외주식', myRaw: my.foreignStock, otherRaw: other.foreignStock },
    {
      axis: '예적금·기타',
      myRaw: my.depositBond + my.alternative,
      otherRaw: other.depositBond + other.alternative,
    },
  ];

  return rows.map((row) => {
    const max = Math.max(row.myRaw, row.otherRaw, 1);
    return { ...row, my: (row.myRaw / max) * 100, other: (row.otherRaw / max) * 100 };
  });
};

interface RadarTooltipProps {
  active?: boolean;
  payload?: { payload: RadarDatum }[];
}

const RadarTooltip = ({ active, payload }: RadarTooltipProps) => {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-[13px] shadow-md">
      <p className="mb-1 font-semibold text-primary-mint-900">{datum.axis}</p>
      <p className="text-gray-700">나: {formatWon(datum.myRaw)}</p>
      <p className="text-gray-700">상대: {formatWon(datum.otherRaw)}</p>
    </div>
  );
};

const PeerCompareRadarChart = ({
  myName,
  peerName,
  myProfile,
  peerProfile,
}: PeerCompareRadarChartProps) => {
  const data = buildRadarData(myProfile, peerProfile);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data} outerRadius="62%" margin={{ top: 30, right: 50, bottom: 30, left: 50 }}>
        <PolarGrid stroke="#e5e5e5" />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 13, fill: '#555' }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip content={<RadarTooltip />} />
        <Radar
          name={myName}
          dataKey="my"
          stroke="#013e39"
          fill="#013e39"
          fillOpacity={0.25}
          animationDuration={700}
        />
        <Radar
          name={peerName}
          dataKey="other"
          stroke="#75e0d7"
          fill="#75e0d7"
          fillOpacity={0.4}
          animationDuration={700}
        />
        <Legend wrapperStyle={{ fontSize: 13 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default PeerCompareRadarChart;
