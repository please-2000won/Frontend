import type { ComparisonRowData } from './mockData';

const ComparisonRow = ({ label, my, peer }: ComparisonRowData) => {
  return (
    <div className="flex items-center justify-between">
      <span className="w-[140px] text-center text-[18px] font-bold tracking-[-1.2px] text-primary-mint-900 sm:w-[360px] sm:text-[24px]">
        {my}
      </span>
      <span className="flex-1 text-center text-[18px] font-medium tracking-[-1.2px] text-primary-mint-900 sm:text-[24px]">
        {label}
      </span>
      <span className="w-[140px] text-center text-[18px] font-bold tracking-[-1.2px] text-primary-mint-900 sm:w-[360px] sm:text-[24px]">
        {peer}
      </span>
    </div>
  );
};

export default ComparisonRow;
