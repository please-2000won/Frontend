import Tag from '../ui/Tag';
import PillButton from '../ui/PillButton';
import InfoTooltip from '../../InfoTooltip';
import dividerLine from '../../../assets/main/divider-line.svg';
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
            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.04em] sm:text-[34px]">
              자산 정보를 등록하고,
              <br />
              본인의 투자행동을 점검해요
            </h1>
            <p className="text-[16px] font-medium leading-relaxed sm:text-[20px]">
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
      <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-5 py-12">
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-primary-mint-900 sm:text-[34px]">
            {name} 님, 반갑습니다
          </h1>
          <PillButton variant="outline" onClick={onEditClick}>
            정보 수정하기
          </PillButton>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-primary-mint-900">
                재무 현황
              </h2>
              {updatedAt && (
                <span
                  className="text-[12px] font-medium text-primary-mint-900/60"
                  title={formatDateTime(updatedAt)}
                >
                  마지막 수정 · {formatTimeAgo(updatedAt)}
                </span>
              )}
            </div>
            {/* 두 카드 높이를 맞추고(items-stretch), 행 영역을 flex-1 + justify-between으로
                둬서 첫 행끼리·마지막 행끼리 같은 높이에 오게 한다. (부채 ↔ 월 저축 계획) */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              {assetCards.map((card) => (
                <div
                  key={card.tag}
                  className="flex w-full flex-col items-start gap-2.5 rounded-2xl bg-white p-4 sm:w-[530px]"
                >
                  <div className="flex items-center gap-1.5">
                    <Tag>{card.tag}</Tag>
                    {FIELD_HINTS[card.tag] && (
                      <InfoTooltip text={FIELD_HINTS[card.tag]} placement="bottom" />
                    )}
                  </div>
                  <div className="mt-2.5 flex w-full flex-1 flex-col justify-between gap-2.5 text-[16px] font-medium">
                    {card.rows.map((row) => {
                      // 지출/부채 등 음수 값은 부호를 왼쪽 칸으로 빼고 금액은 절댓값만 표시한다.
                      const isNegative = row.value.trimStart().startsWith('-');
                      const displayValue = isNegative
                        ? row.value.replace('-', '')
                        : row.value;

                      return (
                        <div
                          key={row.label}
                          className={`flex items-center gap-3 ${row.emphasis ? 'text-primary-mint-900' : 'text-gray-700'}`}
                        >
                          <span className="w-3 shrink-0 text-center">
                            {isNegative ? '-' : ''}
                          </span>
                          <span className="flex flex-1 items-center justify-between gap-1.5">
                            <span className="flex items-center gap-1.5">
                              {row.label}
                              {FIELD_HINTS[row.label] && (
                                <InfoTooltip
                                  text={FIELD_HINTS[row.label]}
                                  placement="bottom"
                                />
                              )}
                            </span>
                            <span>{displayValue}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <img src={dividerLine} alt="" className="w-full" />
                  <p className="w-full text-right text-[20px] font-bold text-primary-mint-900">
                    {card.total}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-primary-mint-900">
              투자 현황
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3">
              {investCards.map((card) => (
                <div
                  key={card.tag}
                  className="flex flex-col items-start gap-3 rounded-2xl bg-white p-4"
                >
                  <div className="flex items-center gap-1.5">
                    <Tag>{card.tag}</Tag>
                    {FIELD_HINTS[card.tag] && (
                      <InfoTooltip text={FIELD_HINTS[card.tag]} placement="bottom" />
                    )}
                  </div>
                  <p className="w-full text-right text-[20px] font-bold text-primary-mint-900">
                    {card.amount}
                  </p>
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
