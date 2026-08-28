import PillButton from './PillButton';
import ComparisonRow from './ComparisonRow';
import AssetPieChart from './AssetPieChart';
import { AI_ANALYSIS_TEXT, type ComparisonRowData } from './mockData';

export type ComparisonViewMode = 'table' | 'chart';

interface ComparisonSectionProps {
  hasAssetInfo: boolean;
  viewMode: ComparisonViewMode;
  onViewModeChange: (mode: ComparisonViewMode) => void;
  onReanalyzeClick: () => void;
  comparisonAssetRows: ComparisonRowData[];
  comparisonInvestRows: ComparisonRowData[];
}

const ComparisonSection = ({
  hasAssetInfo,
  viewMode,
  onViewModeChange,
  onReanalyzeClick,
  comparisonAssetRows,
  comparisonInvestRows,
}: ComparisonSectionProps) => {
  return (
    <section className="bg-system-background">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-5 py-16">
        <div className="flex items-start justify-between gap-5">
          <div className="flex flex-col gap-5 text-primary-mint-900">
            <h2 className="text-[32px] font-semibold leading-tight tracking-[-2px] sm:text-[40px]">
              나와 비슷한 사람들은
              <br />
              얼마나 벌고 어떻게 투자할까?
            </h2>
            <p className="text-[16px] font-medium leading-relaxed tracking-[-1px] sm:text-[20px]">
              다른 사람들의 통계를 기반으로,
              <br />
              객관적인 관점에서 본인의 투자행동을 바라볼 수 있어요.
            </p>
          </div>
          {hasAssetInfo && (
            <PillButton variant="outline" onClick={onReanalyzeClick}>
              다시 분석하기
            </PillButton>
          )}
        </div>

        {hasAssetInfo && (
          <>
            <div className="flex flex-col gap-5 rounded-[32px] border border-gray-300 bg-white p-8">
              <h3 className="text-[24px] font-semibold tracking-[-1.2px] text-primary-mint-900">
                AI 분석
              </h3>
              <p className="text-[16px] font-medium leading-[1.3] tracking-[-0.5px] text-gray-800 sm:text-[20px]">
                {AI_ANALYSIS_TEXT}
              </p>
            </div>

            <div className="flex items-center justify-end">
              <div className="inline-flex overflow-hidden rounded-[100px] border border-primary-mint-900 text-[14px] font-semibold tracking-[-0.7px]">
                <button
                  type="button"
                  onClick={() => onViewModeChange('table')}
                  className={`px-5 py-2 transition-colors ${
                    viewMode === 'table'
                      ? 'bg-primary-mint-900 text-white'
                      : 'bg-white text-primary-mint-900'
                  }`}
                >
                  표로 보기
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('chart')}
                  className={`px-5 py-2 transition-colors ${
                    viewMode === 'chart'
                      ? 'bg-primary-mint-900 text-white'
                      : 'bg-white text-primary-mint-900'
                  }`}
                >
                  차트로 보기
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 border-b-2 border-primary-mint-900 py-2 text-center text-[20px] font-semibold tracking-[-1.2px] text-primary-mint-900 sm:text-[24px]">
                  나
                </div>
                <div className="w-10 shrink-0" />
                <div className="flex-1 border-b-2 border-primary-mint-900 py-2 text-center text-[20px] font-semibold tracking-[-1.2px] text-primary-mint-900 sm:text-[24px]">
                  Peer Group 평균
                </div>
              </div>

              <div className="rounded-[4px] bg-primary-mint-900 py-[5px] text-center text-[16px] font-bold tracking-[-0.8px] text-white">
                자산 정보
              </div>
              <div className="flex flex-col gap-4">
                {comparisonAssetRows.map((row) => (
                  <ComparisonRow key={row.label} {...row} />
                ))}
              </div>

              <div className="rounded-[4px] bg-primary-mint-900 py-[5px] text-center text-[16px] font-bold tracking-[-0.8px] text-white">
                투자 정보
              </div>
              {viewMode === 'table' ? (
                <div className="flex flex-col gap-4">
                  {comparisonInvestRows.map((row) => (
                    <ComparisonRow key={row.label} {...row} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-10 py-6 sm:flex-row sm:gap-16">
                  <AssetPieChart title="나" />
                  <AssetPieChart title="Peer Group 평균" />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ComparisonSection;
