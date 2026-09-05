import { Fragment } from 'react';
import { formatWon } from '../../../utils/mapFinancialInfo';
import type { ComparisonGroup } from '../../../utils/buildComparisonGroups';

interface ComparisonTableProps {
  groups: ComparisonGroup[];
  myLabel: string;
  otherLabel: string;
}

// Peer Group 평균 대비 몇 % 차이인지. 비교 기준(평균)이 0이면 계산할 수 없다.
const getDiffPercent = (my: number, other: number): number | null => {
  if (other <= 0) return null;
  return Math.round(((my - other) / other) * 100);
};

// 평균보다 높으면 민트, 낮으면 회색 톤으로 방향을 바로 구분할 수 있게 한다.
// (어느 쪽이 "좋다"는 판단은 하지 않고, 방향과 크기만 강조한다.)
const DiffBadge = ({ diff }: { diff: number }) => {
  if (diff === 0) {
    return (
      <span className="whitespace-nowrap text-[10px] font-medium text-gray-400 sm:text-[11px]">
        평균과 동일
      </span>
    );
  }

  const isAbove = diff > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px] font-bold sm:text-[11px] ${
        isAbove ? 'bg-primary-mint-200 text-primary-mint-900' : 'bg-gray-100 text-gray-600'
      }`}
    >
      <span aria-hidden>{isAbove ? '▲' : '▼'}</span>
      {Math.abs(diff)}%
    </span>
  );
};

// 두 그룹(재무 현황/투자 현황) 항목을 한눈에 훑어볼 수 있는 표.
// 좁은 화면에서도 가로 스크롤 없이 그대로 줄어들도록 폭 고정값 없이 3열 그리드로만 짠다.
const ComparisonTable = ({ groups, myLabel, otherLabel }: ComparisonTableProps) => {
  return (
    <div className="grid grid-cols-3 gap-x-1">
      <div className="flex flex-col items-center gap-2 px-1 pb-2">
        <span className="break-keep text-center text-[13px] font-semibold text-primary-mint-900 sm:text-[14px]">
          {myLabel}
        </span>
        <span className="h-px w-full bg-primary-mint-900" />
      </div>
      <div />
      <div className="flex flex-col items-center gap-2 px-1 pb-2">
        <span className="break-keep text-center text-[13px] font-semibold text-primary-mint-900 sm:text-[14px]">
          {otherLabel}
        </span>
        <span className="h-px w-full bg-primary-mint-900" />
      </div>

      {groups.map((group) => (
        <Fragment key={group.title}>
          <div className="col-span-3 mt-2 rounded-md bg-primary-mint-900 py-1.5 text-center text-[11px] font-bold text-white first:mt-0 sm:text-[12px]">
            {group.title}
          </div>
          {group.metrics.map((metric) => {
            const diff = getDiffPercent(metric.my, metric.other);

            return (
              <Fragment key={metric.label}>
                <div className="flex items-center justify-center break-keep px-1 py-3 text-center text-[13px] font-bold text-primary-mint-900 sm:px-2 sm:text-[14px]">
                  {formatWon(metric.my)}
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-1 py-3 text-center sm:px-2">
                  <span className="break-keep text-[12px] text-gray-700 sm:text-[13px]">
                    {metric.label}
                  </span>
                  {diff !== null && <DiffBadge diff={diff} />}
                </div>
                <div className="flex items-center justify-center break-keep px-1 py-3 text-center text-[13px] font-bold text-primary-mint-900 sm:px-2 sm:text-[14px]">
                  {formatWon(metric.other)}
                </div>
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
};

export default ComparisonTable;
