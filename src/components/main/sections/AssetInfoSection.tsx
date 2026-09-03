import Tag from '../ui/Tag';
import PillButton from '../ui/PillButton';
import dividerLine from '../../../assets/main/divider-line.svg';
import type { AssetCardData, InvestCardData } from '../../../constants/main/mockData';

interface AssetInfoSectionProps {
  name: string;
  hasAssetInfo: boolean;
  assetCards: AssetCardData[];
  investCards: InvestCardData[];
  onWriteClick: () => void;
  onEditClick: () => void;
}

const AssetInfoSection = ({
  name,
  hasAssetInfo,
  assetCards,
  investCards,
  onWriteClick,
  onEditClick,
}: AssetInfoSectionProps) => {
  if (!hasAssetInfo) {
    return (
      <section className="bg-primary-mint-200">
        <div className="mx-auto flex max-w-[1080px] flex-col items-start justify-between gap-10 px-5 py-16 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-5 text-primary-mint-900">
            <h1 className="text-[32px] font-semibold leading-tight sm:text-[40px]">
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
      <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-5 py-16">
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-[32px] font-semibold text-primary-mint-900 sm:text-[40px]">
            {name} 님, 반갑습니다
          </h1>
          <PillButton variant="outline" onClick={onEditClick}>
            정보 수정하기
          </PillButton>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-[33px]">
            <h2 className="text-[24px] font-semibold text-primary-mint-900">
              자산 정보
            </h2>
            {/* 왼쪽은 항목 3개, 오른쪽은 2개라 높이가 다르므로
                items-stretch + 행 영역 flex-1로 구분선과 합계 줄을 맞춘다. */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
              {assetCards.map((card) => (
                <div
                  key={card.tag}
                  className="flex w-full flex-col items-start gap-5 rounded-[16px] bg-white p-[26px] sm:w-[530px]"
                >
                  <Tag>{card.tag}</Tag>
                  <div className="flex w-full flex-1 flex-col justify-between gap-[15px] text-[20px] font-medium">
                    {card.rows.map((row) => (
                      <div
                        key={row.label}
                        className={`flex items-center justify-between ${row.emphasis ? 'text-primary-mint-900' : 'text-gray-700'}`}
                      >
                        <span>{row.label}</span>
                        <span>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <img src={dividerLine} alt="" className="w-full" />
                  <p className="w-full text-right text-[24px] font-bold text-primary-mint-900">
                    {card.total}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[33px]">
            <h2 className="text-[24px] font-semibold text-primary-mint-900">
              투자 정보
            </h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              {investCards.map((card) => (
                <div
                  key={card.tag}
                  className="flex flex-col items-start gap-[45px] rounded-[16px] bg-white p-[26px]"
                >
                  <Tag>{card.tag}</Tag>
                  <p className="w-full text-right text-[24px] font-bold text-primary-mint-900">
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
