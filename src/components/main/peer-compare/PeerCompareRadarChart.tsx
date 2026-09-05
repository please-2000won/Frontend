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

// 값이 0이어도 최소한 이만큼은 중심에서 벗어나 보이게 한다.
const MIN_VISIBLE = 8;
const ZERO_VISIBLE = 3;

const buildRadarData = (
  my: PeerFinancialProfile,
  other: PeerFinancialProfile
): RadarDatum[] => {
  const rows = [
    { axis: '가용 금액', myRaw: my.totalIncome, otherRaw: other.totalIncome },
    { axis: '현금성 자산', myRaw: my.cash, otherRaw: other.cash },
    { axis: '국내 주식', myRaw: my.domesticStock, otherRaw: other.domesticStock },
    { axis: '해외 주식', myRaw: my.foreignStock, otherRaw: other.foreignStock },
    {
      axis: '예적금·대체',
      myRaw: my.depositBond + my.alternative,
      otherRaw: other.depositBond + other.alternative,
    },
  ];

  // 축마다 따로 정규화하면 큰 쪽이 항상 정오각형이 된다.
  // 전체에서 가장 큰 값을 기준으로 한 번에 정규화해 실제 비율이 드러나게 한다.
  const globalMax = Math.max(
    ...rows.flatMap((row) => [row.myRaw, row.otherRaw]),
    1
  );

  const scale = (value: number) => {
    if (value <= 0) return ZERO_VISIBLE;
    return Math.max((value / globalMax) * 100, MIN_VISIBLE);
  };

  return rows.map((row) => ({
    ...row,
    my: scale(row.myRaw),
    other: scale(row.otherRaw),
  }));
};

interface RadarTooltipProps {
  active?: boolean;
  payload?: { payload: RadarDatum }[];
  myName: string;
  peerName: string;
}

const RadarTooltip = ({ active, payload, myName, peerName }: RadarTooltipProps) => {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-[13px] shadow-md">
      <p className="mb-1 font-semibold text-primary-mint-900">{datum.axis}</p>
      <p className="text-gray-800">
        {myName}: {formatWon(datum.myRaw)}
      </p>
      <p className="text-gray-800">
        {peerName}: {formatWon(datum.otherRaw)}
      </p>
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
    <ResponsiveContainer width="100%" height={360}>
      <RadarChart
        data={data}
        outerRadius="70%"
        margin={{ top: 12, right: 56, bottom: 4, left: 56 }}
      >
        <PolarGrid stroke="#e5e5e5" />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: '#555555' }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip content={<RadarTooltip myName={myName} peerName={peerName} />} />
        <Radar
          name={myName}
          dataKey="my"
          stroke="#013e39"
          fill="#013e39"
          fillOpacity={0.22}
          animationDuration={600}
        />
        <Radar
          name={peerName}
          dataKey="other"
          stroke="#75e0d7"
          fill="#75e0d7"
          fillOpacity={0.4}
          animationDuration={600}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default PeerCompareRadarChart;
