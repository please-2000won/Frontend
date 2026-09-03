import PillButton from '../ui/PillButton';
import PeerBarChart from '../ui/PeerBarChart';
import PeerPieChart from '../ui/PeerPieChart';
import RiskAnalysisCard from '../ui/RiskAnalysisCard';
import type { PeerFinancialProfile, RiskInfo } from '../../../constants/main/mockData';
import { buildComparisonGroups } from '../../../utils/buildComparisonGroups';

interface ComparisonSectionProps {
  hasAssetInfo: boolean;
  onReanalyzeClick: () => void;
  onAskChatbot: () => void;
  myProfile: PeerFinancialProfile;
  peerGroupProfile: PeerFinancialProfile;
  aiAnalysisText: string;
  risk: RiskInfo | null;
  // 현재 분석 결과가 예전 자산 정보 기준일 때 true
  isStale?: boolean;
}

const ComparisonSection = ({
  hasAssetInfo,
  onReanalyzeClick,
  onAskChatbot,
  myProfile,
  peerGroupProfile,
  aiAnalysisText,
  risk,
  isStale = false,
}: ComparisonSectionProps) => {
  const groups = buildComparisonGroups(myProfile, peerGroupProfile);

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
            {isStale && (
              <div className="flex items-start gap-3 rounded-[16px] border border-amber-300 bg-amber-50 px-5 py-4">
                <span aria-hidden className="text-[16px] leading-[1.4]">
                  ⚠️
                </span>
                <p className="text-[14px] font-medium leading-[1.5] text-amber-800">
                  자산 정보가 변경되어 현재 분석 결과는 이전 정보를 기준으로 해요.
                  최신 비교 결과를 보려면{' '}
                  <button
                    type="button"
                    onClick={onReanalyzeClick}
                    className="cursor-pointer font-semibold text-amber-900 underline underline-offset-2"
                  >
                    다시 분석하기
                  </button>
                  를 눌러 주세요.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-5 rounded-[32px] border border-gray-300 bg-white p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-[24px] font-semibold tracking-[-1.2px] text-primary-mint-900">
                  AI 분석
                </h3>
                <button
                  type="button"
                  onClick={onAskChatbot}
                  className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-primary-mint-800 px-5 py-2.5 text-[16px] font-semibold text-white transition-colors hover:bg-primary-mint-900"
                >
                  <span aria-hidden>🤖</span>
                  챗봇에게 질문하기
                </button>
              </div>
              <p className="text-[16px] font-medium leading-[1.3] tracking-[-0.5px] text-gray-800 sm:text-[20px]">
                {aiAnalysisText}
              </p>
            </div>

            {risk && <RiskAnalysisCard risk={risk} />}

            <div className="flex flex-col gap-10">
              {groups.map((group) => (
                <PeerBarChart
                  key={group.title}
                  title={group.title}
                  metrics={group.metrics}
                  myLabel="나"
                  otherLabel="Peer Group 평균"
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-[20px] font-semibold tracking-[-1px] text-primary-mint-900">
                투자 자산 비중
              </h3>
              <PeerPieChart
                myLabel="나"
                myProfile={myProfile}
                otherLabel="Peer Group 평균"
                otherProfile={peerGroupProfile}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ComparisonSection;
