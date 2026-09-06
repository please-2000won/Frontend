import PillButton from '../ui/PillButton';
import InfoTooltip from '../../InfoTooltip';
import type { AssetCardData, InvestCardData } from '../../../constants/main/mockData';
import { FIELD_HINTS } from '../../../constants/fieldHints';
import { formatDateTime, formatTimeAgo } from '../../../utils/formatDate';

interface AssetInfoSectionProps {
  name: string;
  hasAssetInfo: boolean;
  assetCards: AssetCardData[];
  investCards: InvestCardData[];
  // 금융 정보 최종 수정 시각 (ISO date-time)
  updatedAt?: string;
  onWriteClick: () => void;
  onEditClick: () => void;
}

const AssetInfoSection = ({
  name,
  hasAssetInfo,
  assetCards,
  investCards,
  updatedAt,
  onWriteClick,
  onEditClick,
}: AssetInfoSectionProps) => {
  if (!hasAssetInfo) {
    return (
      <section className="bg-primary-mint-200">
        <div className="mx-auto flex max-w-[1080px] flex-col items-start justify-between gap-10 px-5 py-16 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-5 text-primary-mint-900">
            <span className="text-[13px] font-bold tracking-[0.08em] text-primary-mint-800 uppercase">
              Financial Overview
            </span>
            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.04em] sm:text-[34px]">
              자산 정보를 등록하고,
              <br />
              본인의 투자행동을 점검해요
            </h1>
            <p className="text-[16px] font-medium leading-relaxed sm:text-[20px] text-primary-mint-900/80">
              자산 정보와 함께 입력한 정보들을 기반으로
              <br />
              비슷한 사람들의 평균을 확인할 수 있어요.
            </p>
          </div>
          <PillButton variant="filled" size="lg" onClick={onWriteClick}>
            작성하러 가기
          </PillButton>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-primary-mint-200">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-5 py-12">
        {/* 상단 프로필 환영 헤더 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold tracking-[0.06em] text-primary-mint-800 uppercase">
              My Portfolio
            </span>
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-primary-mint-900 sm:text-[34px]">
              {name} 님, 반갑습니다
            </h1>
          </div>
          <div className="self-start sm:self-auto">
            <PillButton variant="outline" onClick={onEditClick}>
              정보 수정하기
            </PillButton>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* 1. 재무 현황 섹션 */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h2 className="text-[20px] font-bold tracking-[-0.03em] text-primary-mint-900 sm:text-[22px]">
                  재무 현황
                </h2>
                <span className="rounded-full bg-primary-mint-900/10 px-2 py-0.5 text-[11px] font-semibold text-primary-mint-900">
                  수입 · 지출 · 자산
                </span>
              </div>
              {updatedAt && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-[12px] font-medium text-primary-mint-900 shadow-2xs backdrop-blur-xs"
                  title={formatDateTime(updatedAt)}
                >
                  <span className="size-1.5 rounded-full bg-primary-mint-800 animate-pulse" />
                  마지막 수정 · {formatTimeAgo(updatedAt)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
              {assetCards.map((card) => (
                <div
                  key={card.tag}
                  className="flex w-full flex-1 flex-col justify-between rounded-2xl border border-white/80 bg-white p-6 shadow-[0_4px_20px_rgba(1,62,57,0.06)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(1,62,57,0.09)] sm:max-w-[530px]"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[17px] font-bold text-gray-900">
                        {card.tag}
                      </h3>
                      {FIELD_HINTS[card.tag] && (
                        <InfoTooltip text={FIELD_HINTS[card.tag]} placement="bottom" />
                      )}
                    </div>
                  </div>

                  <div className="my-4 flex w-full flex-1 flex-col justify-between gap-3 text-[15px] font-medium">
                    {card.rows.map((row) => {
                      const isNegative = row.value.trimStart().startsWith('-');
                      const displayValue = isNegative
                        ? row.value.replace('-', '').trim()
                        : row.value;

                      return (
                        <div
                          key={row.label}
                          className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50/70 ${
                            row.emphasis ? 'font-semibold text-primary-mint-900' : 'text-gray-700'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="text-gray-900">
                              {isNegative && (
                                <span className="mr-1 font-bold text-gray-500">
                                  -
                                </span>
                              )}
                              {row.label}
                            </span>
                            {FIELD_HINTS[row.label] && (
                              <InfoTooltip
                                text={FIELD_HINTS[row.label]}
                                placement="bottom"
                              />
                            )}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {displayValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end border-t border-gray-100 pt-3.5">
                    <p className="text-[22px] font-bold tracking-tight text-primary-mint-900">
                      {card.total}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 투자 현황 섹션 (아이콘 제거 및 라벨+금액 위주로 심플화) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[20px] font-bold tracking-[-0.03em] text-primary-mint-900 sm:text-[22px]">
                투자 현황
              </h2>
              <span className="rounded-full bg-primary-mint-900/10 px-2 py-0.5 text-[11px] font-semibold text-primary-mint-900">
                자산군별 배분
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {investCards.map((card) => (
                <div
                  key={card.tag}
                  className="group flex flex-col justify-between gap-4 rounded-2xl border border-white/80 bg-white p-5 shadow-[0_4px_20px_rgba(1,62,57,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(1,62,57,0.09)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[17px] font-bold text-gray-900">
                        {card.tag}
                      </span>
                      {FIELD_HINTS[card.tag] && (
                        <InfoTooltip
                          text={FIELD_HINTS[card.tag]}
                          placement="bottom"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-end border-t border-gray-50 pt-3">
                    <span className="text-[22px] font-bold tracking-tight text-primary-mint-900">
                      {card.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssetInfoSection;
