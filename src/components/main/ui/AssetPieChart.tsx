import pieChart from '../../../assets/main/asset-pie-chart.svg';
import { PIE_LEGEND } from '../../../constants/main/mockData';

interface AssetPieChartProps {
  title: string;
}

const AssetPieChart = ({ title }: AssetPieChartProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-[16px] font-semibold tracking-[-0.8px] text-primary-mint-900">
        {title}
      </span>
      <div className="flex items-center gap-8">
        <img
          src={pieChart}
          alt={`${title} 자산 비중 차트`}
          className="size-[160px] shrink-0 sm:size-[200px]"
        />
        <div className="flex flex-col gap-3">
          {PIE_LEGEND.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-center gap-3">
              <span className={`size-[16px] shrink-0 rounded-[10px] ${item.colorClassName}`} />
              <span className="whitespace-nowrap text-[14px] font-medium tracking-[-0.7px] text-gray-800">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetPieChart;
