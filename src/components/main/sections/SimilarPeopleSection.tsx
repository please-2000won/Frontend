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
      <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-5 py-12">
        <div className="flex flex-col gap-5 text-primary-mint-900">
          <h2 className="text-[28px] font-semibold tracking-[-0.04em] sm:text-[34px]">
            Peer Group 사람들은 어떨까?
          </h2>
          <p className="text-[16px] font-medium leading-relaxed sm:text-[20px]">
            Peer Group에서 무작위로 뽑은 3명이에요.
            <br />
            프로필을 눌러 나와 비교해 볼 수 있어요.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-5 sm:flex-row">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col gap-4 rounded-2xl bg-white p-4"
              >
                <div className="h-[22px] w-[80px] animate-pulse rounded-[4px] bg-gray-100" />
                <div className="h-[24px] w-full animate-pulse rounded-[4px] bg-gray-100" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-[16px] font-medium text-primary-mint-900">
            추천 피어를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        ) : peers.length === 0 ? (
          <p className="text-[16px] font-medium text-primary-mint-900">
            아직 비교할 피어가 없어요.
          </p>
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row">
            {peers.map((person) => (
              <button
                key={person.peerUserId}
                type="button"
                onClick={() => onSelectPeer(person.peerUserId)}
                className="flex flex-1 cursor-pointer flex-col items-start gap-4 rounded-2xl bg-white p-4 text-left transition-shadow hover:shadow-md"
              >
                <Tag size="sm">
                  유사도 {formatSimilarity(person.similarityScore)}%
                </Tag>
                <p className="w-full text-right text-[18px] font-bold text-primary-mint-900">
                  {person.nickname}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SimilarPeopleSection;
