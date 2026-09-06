import Button from '../../common/Button';

interface AnalysisErrorStateProps {
  onRetry?: () => void;
  onReanalyze?: () => void;
  isAnalyzing?: boolean;
}

const AnalysisErrorState = ({
  onRetry,
  onReanalyze,
  isAnalyzing = false,
}: AnalysisErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xs">
      <div className="flex size-14 items-center justify-center rounded-full bg-red-50 text-[28px]">
        ⚠️
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[18px] font-bold text-gray-900">
          분석 결과를 불러오지 못했어요
        </h3>
        <p className="text-[14px] text-gray-600 leading-relaxed max-w-[420px]">
          일시적인 서버 문제이거나 아직 생성된 분석 데이터가 없을 수 있습니다.
          <br />
          다시 시도하거나 새로운 분석을 진행해 주세요.
        </p>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onRetry}
            disabled={isAnalyzing}
          >
            다시 시도
          </Button>
        )}
        {onReanalyze && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onReanalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? '분석 진행 중…' : '새로 분석하기'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnalysisErrorState;
