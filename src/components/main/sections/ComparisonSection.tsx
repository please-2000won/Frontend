import PillButton from '../ui/PillButton';
import PeerBarChart from '../ui/PeerBarChart';
import PeerPieChart from '../ui/PeerPieChart';
import type { PeerFinancialProfile } from '../../../constants/main/mockData';
import { buildComparisonGroups } from '../../../utils/buildComparisonGroups';

interface ComparisonSectionProps {
  hasAssetInfo: boolean;
  onReanalyzeClick: () => void;
  myProfile: PeerFinancialProfile;
  peerGroupProfile: PeerFinancialProfile;
  aiAnalysisText: string;
}

const ComparisonSection = ({
  hasAssetInfo,
  onReanalyzeClick,
  myProfile,
  peerGroupProfile,
  aiAnalysisText,
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
            <div className="flex flex-col gap-5 rounded-[32px] border border-gray-300 bg-white p-8">
              <h3 className="text-[24px] font-semibold tracking-[-1.2px] text-primary-mint-900">
                AI 분석
              </h3>
              <p className="text-[16px] font-medium leading-[1.3] tracking-[-0.5px] text-gray-800 sm:text-[20px]">
                {aiAnalysisText}
              </p>
            </div>

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
