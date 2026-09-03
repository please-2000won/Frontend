interface AnalysisLoadingModalProps {
  open: boolean;
}

// 분석(POST /api/v1/analysis) 응답을 기다리는 동안 배경을 딤 처리하고
// 가운데에 스피너를 띄운다.
const AnalysisLoadingModal = ({ open }: AnalysisLoadingModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center gap-5 rounded-[24px] bg-white px-10 py-9 shadow-xl">
        <span
          className="size-12 animate-spin rounded-full border-4 border-primary-mint-200 border-t-primary-mint-800"
          role="status"
          aria-label="분석 중"
        />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[18px] font-semibold text-primary-mint-900">
            AI가 분석하고 있어요
          </p>
          <p className="text-[14px] font-medium text-gray-700">
            잠시만 기다려 주세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoadingModal;
