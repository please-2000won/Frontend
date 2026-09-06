import PeerBarChart from '../ui/PeerBarChart';
import PeerPieChart from '../ui/PeerPieChart';
import ComparisonTable from '../ui/ComparisonTable';
import RiskAnalysisCard from '../ui/RiskAnalysisCard';
import AnalysisErrorState from '../ui/AnalysisErrorState';
import Button from '../../common/Button';
import type {
  PeerFinancialProfile,
  RiskInfo,
} from '../../../constants/main/mockData';
import { buildComparisonGroups } from '../../../utils/buildComparisonGroups';
import { formatDateTime, formatTimeAgo } from '../../../utils/formatDate';

interface ComparisonSectionProps {
  hasAssetInfo: boolean;
  onReanalyzeClick: () => void;
  onAskChatbot: () => void;
  myProfile: PeerFinancialProfile | null;
  peerGroupProfile: PeerFinancialProfile | null;
  aiAnalysisText: string;
  risk: RiskInfo | null;
  // 이번 분석이 비교한 피어 그룹 인원수
  peerCount?: number | null;
  // 이번 분석이 생성된 시각 (ISO date-time)
  analyzedAt?: string | null;
  // 현재 분석 결과가 예전 자산 정보 기준일 때 true
  isStale?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  isAnalyzing?: boolean;
}

const ComparisonSection = ({
  hasAssetInfo,
  onReanalyzeClick,
  onAskChatbot,
  myProfile,
  peerGroupProfile,
  aiAnalysisText,
  risk,
  peerCount,
  analyzedAt,
  isStale = false,
  isLoading = false,
  isError = false,
  onRetry,
  isAnalyzing = false,
}: ComparisonSectionProps) => {
  const otherLabelText =
    peerCount != null
      ? `Peer Group 평균 (${peerCount.toLocaleString('ko-KR')}명)`
      : 'Peer Group 평균';

  return (
    <section className="bg-system-background">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-5 py-12">
        {/* 섹션 헤더: 좌측 메인 타이틀 + 우측 최근 분석 시간 칩 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2.5 text-primary-mint-900">
            <span className="text-[12px] font-bold tracking-[0.06em] text-primary-mint-800 uppercase">
              Peer Group Benchmark
            </span>
            <h2 className="text-[28px] font-bold leading-tight tracking-[-0.04em] sm:text-[34px]">
              나와 비슷한 사람들은 얼마나 벌고 어떻게 투자할까?
            </h2>
            <p className="text-[15px] font-medium leading-relaxed text-gray-700 sm:text-[18px]">
              비슷한 경제 여건을 가진 피어 그룹의 통계를 기반으로,
              <br className="hidden sm:inline" /> 객관적인 관점에서 본인의 투자행동을 진단해 드려요.
            </p>
          </div>

          {hasAssetInfo && analyzedAt && (
            <div className="shrink-0 self-start sm:self-auto">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white px-3 py-1 text-[12px] font-medium text-primary-mint-900 shadow-2xs"
                title={formatDateTime(analyzedAt)}
              >
                <span className="size-1.5 rounded-full bg-primary-mint-800 animate-pulse" />
                마지막 분석 · {formatTimeAgo(analyzedAt)}
              </span>
            </div>
          )}
        </div>

        {hasAssetInfo && (
          <>
            {isLoading ? (
              <div className="flex w-full items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 text-[15px] font-medium text-gray-500 shadow-xs">
                분석 결과를 불러오는 중입니다…
              </div>
            ) : isError || !peerGroupProfile || !myProfile ? (
              <AnalysisErrorState
                onRetry={onRetry}
                onReanalyze={onReanalyzeClick}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              <>
                {/* 피어 표본 수 (Peer Count) 별도 표시 안내 바 */}
                {peerCount != null && (
                  <div className="flex items-center gap-2 text-[14px] text-gray-700">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-mint-50 px-2.5 py-0.5 text-[12px] font-semibold text-primary-mint-900 border border-primary-mint-100/80">
                      <span className="size-1.5 rounded-full bg-primary-mint-800" />
                      비교 집단
                    </span>
                    <span>
                      나와 조건이 가장 유사한{' '}
                      <strong className="font-bold text-primary-mint-900">
                        {peerCount.toLocaleString('ko-KR')}명
                      </strong>
                      의 Peer Group 데이터 기준
                    </span>
                  </div>
                )}

                {isStale && (
                  <div className="flex flex-col gap-4 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <div className="flex items-start gap-4">
                      <span aria-hidden className="text-[32px] leading-none">
                        ⚠️
                      </span>
                      <div className="flex flex-col gap-1">
                        <p className="text-[20px] font-bold text-amber-900">
                          지금 보이는 분석은 예전 자산 정보 기준이에요
                        </p>
                        <p className="text-[16px] font-medium leading-[1.5] text-amber-800">
                          자산 정보를 수정했어요. 최신 비교 결과를 보려면 다시
                          분석해 주세요.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="warning"
                      size="md"
                      onClick={onReanalyzeClick}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? '분석 진행 중…' : '다시 분석하기'}
                    </Button>
                  </div>
                )}

                <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-primary-mint-900">
                        AI 분석
                      </h3>
                      {peerCount != null && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                          {peerCount.toLocaleString('ko-KR')}명 표본
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="soft"
                      size="sm"
                      onClick={onAskChatbot}
                      className="group shrink-0"
                    >
                      <svg
                        className="size-4 text-primary-mint-800 transition-transform group-hover:scale-110"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                      <span>챗봇에게 질문하기</span>
                      <span
                        aria-hidden="true"
                        className="text-[12px] text-primary-mint-800 transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Button>
                  </div>
                  <p className="whitespace-pre-line text-[14px] font-medium leading-[1.6] text-gray-800 sm:text-[15px]">
                    {aiAnalysisText || '분석 코멘트가 없습니다.'}
                  </p>
                </div>

                {risk && <RiskAnalysisCard risk={risk} />}

                {(() => {
                  const groups = buildComparisonGroups(myProfile, peerGroupProfile);
                  return (
                    <>
                      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                        <ComparisonTable
                          groups={groups}
                          myLabel="나"
                          otherLabel={otherLabelText}
                        />
                      </div>

                      <div className="flex flex-col gap-10">
                        {groups.map((group) => (
                          <PeerBarChart
                            key={group.title}
                            title={group.title}
                            metrics={group.metrics}
                            myLabel="나"
                            otherLabel={otherLabelText}
                          />
                        ))}
                      </div>

                      <div className="flex flex-col gap-4">
                        <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-primary-mint-900">
                          투자 자산 비중
                        </h3>
                        <PeerPieChart
                          myLabel="나"
                          myProfile={myProfile}
                          otherLabel={otherLabelText}
                          otherProfile={peerGroupProfile}
                        />
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ComparisonSection;
