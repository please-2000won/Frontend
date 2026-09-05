import { useNavigate } from 'react-router-dom';
import PillButton from '../ui/PillButton';
import MiniMock, { type MiniMockId } from '../ui/MiniMock';

// 로그인은 했지만 아직 재무 정보를 입력하지 않은 사용자가 기본 경로(`/`)에서 보는 화면.
// 랜딩처럼 무엇을 얻는지 보여주고 정보 입력을 유도한다.
const BENEFITS: { mock: MiniMockId; title: string; desc: string }[] = [
  {
    mock: 'peer',
    title: 'Peer Group 비교',
    desc: '나와 경제적 여건이 비슷한 사람들의 평균과 금액·비중을 나란히 비교해요.',
  },
  {
    mock: 'risk',
    title: 'AI 위험 분석',
    desc: '0~100 위험점수와 LOW·MEDIUM·HIGH 단계를 쉬운 문장으로 설명해줘요.',
  },
  {
    mock: 'chat',
    title: '분석 챗봇',
    desc: '분석 결과에 나온 어려운 용어를 챗봇에게 바로 물어볼 수 있어요.',
  },
];

const MainEmptyState = () => {
  const navigate = useNavigate();
  const goInput = () => navigate('/infoInput');

  return (
    <div className="flex flex-col">
      <section className="bg-primary-mint-200">
        <div className="mx-auto flex max-w-[1080px] flex-col items-start gap-6 px-5 py-16 sm:py-20">
          <span className="rounded-lg bg-white/70 px-3 py-1.5 text-[13px] font-semibold text-primary-mint-900">
            아직 재무 정보가 없어요
          </span>
          <h1 className="break-keep text-[28px] font-bold leading-tight tracking-[-0.04em] text-primary-mint-900 sm:text-[38px]">
            재무 정보를 입력하면,
            <br />
            또래와 비교한 내 위치가 보여요
          </h1>
          <p className="max-w-[620px] break-keep text-[15px] font-medium leading-relaxed tracking-[-0.02em] text-primary-mint-900/75 sm:text-[16px]">
            월수입·고정지출·저축목표·보유자산·부채와 투자자산 금액을 한 번만 입력하면,
            <br className="hidden sm:block" />
            나와 비슷한 Peer Group과 비교한 AI 분석이 만들어져요.
          </p>
          <PillButton variant="filled" size="lg" onClick={goInput}>
            재무 정보 입력하기
          </PillButton>
        </div>
      </section>

      <section className="bg-system-background">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-5 py-16 sm:py-20">
          <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-primary-mint-900 sm:text-[26px]">
            입력하면 이런 걸 볼 수 있어요
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {BENEFITS.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6"
              >
                <MiniMock id={item.mock} />
                <h3 className="text-[16px] font-semibold text-primary-mint-900">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-gray-700">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainEmptyState;
