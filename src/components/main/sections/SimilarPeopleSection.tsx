import Tag from '../ui/Tag';
import type { PeerCard } from '../../../hooks/useSimilarPeers';

interface SimilarPeopleSectionProps {
  peers: PeerCard[];
  isLoading: boolean;
  isError: boolean;
  onSelectPeer: (peerUserId: number) => void;
}

// 유사도 점수가 0~1(비율)로 오든 0~100(퍼센트)으로 오든 퍼센트로 표시한다.
const formatSimilarity = (score: number) =>
  Math.round(score > 1 ? score : score * 100);

const SimilarPeopleSection = ({
  peers,
  isLoading,
  isError,
  onSelectPeer,
}: SimilarPeopleSectionProps) => {
  return (
    <section className="bg-primary-mint-200">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-5 py-12">
        {/* 섹션 헤더 */}
        <div className="flex flex-col gap-2.5 text-primary-mint-900">
          <span className="text-[12px] font-bold tracking-[0.06em] text-primary-mint-800 uppercase">
            Peer Benchmark
          </span>
          <h2 className="text-[28px] font-bold tracking-[-0.04em] sm:text-[34px]">
            나와 비슷한 사람들은 어떻게 투자할까?
          </h2>
          <p className="text-[15px] font-medium leading-relaxed text-primary-mint-900/80 sm:text-[18px]">
            자산과 투자 성향이 가장 유사한 피어 그룹 구성원들이에요.
            <br className="hidden sm:inline" /> 카드를 눌러 1:1로 자산 구성을 비교해보세요.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col justify-between gap-5 rounded-2xl border border-white/80 bg-white p-5 shadow-[0_4px_20px_rgba(1,62,57,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <div className="h-6 w-28 animate-pulse rounded-md bg-gray-100" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
                </div>
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-50" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex w-full items-center justify-center rounded-2xl border border-white/80 bg-white/60 p-8 text-[15px] font-medium text-primary-mint-900">
            추천 피어를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </div>
        ) : peers.length === 0 ? (
          <div className="flex w-full items-center justify-center rounded-2xl border border-white/80 bg-white/60 p-8 text-[15px] font-medium text-primary-mint-900">
            아직 비교할 수 있는 유사 피어가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {peers.map((person) => (
              <button
                key={person.peerUserId}
                type="button"
                onClick={() => onSelectPeer(person.peerUserId)}
                className="group relative flex cursor-pointer flex-col justify-between gap-5 rounded-2xl border border-white/90 bg-white p-5 text-left shadow-[0_4px_20px_rgba(1,62,57,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(1,62,57,0.12)] active:scale-[0.98]"
              >
                {/* 상단: 닉네임 + 유사도 뱃지 (프로필 아바타 및 '유사 사용자' 텍스트 제거) */}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[17px] font-bold text-gray-900 transition-colors group-hover:text-primary-mint-800">
                    {person.nickname}
                  </p>
                  <Tag size="sm" variant="primary" className="shrink-0">
                    유사도 {formatSimilarity(person.similarityScore)}%
                  </Tag>
                </div>

                {/* 하단: 액션 유도 라벨 */}
                <div className="flex items-center justify-between rounded-xl bg-gray-50/80 px-3.5 py-2.5 transition-colors group-hover:bg-primary-mint-50/70">
                  <span className="text-[13px] font-semibold text-gray-600 transition-colors group-hover:text-primary-mint-900">
                    1:1 포트폴리오 비교
                  </span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-white text-[13px] font-bold text-primary-mint-800 shadow-2xs transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SimilarPeopleSection;
