import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo.svg';

// 기획서(docs/plan.md) 3.1 "해결하려는 문제"에서 발췌
const QUESTIONS = [
  '매달 투자하는 금액이 내 소득과 지출에 비해 큰가요?',
  '내 자산은 한 유형에 지나치게 집중되어 있나요?',
  '나와 경제적 여건이 비슷한 사람들은 어떤 비율로 투자하고 있나요?',
  '분석 결과에 나온 어려운 용어는 정확히 무슨 뜻인가요?',
];

// 기획서 4.1 "핵심 컨셉" 5단계. mock은 각 단계의 실제 앱 화면을 축소한 미니 목업.
const STEPS = [
  {
    mock: 'profile',
    title: 'Financial Profile',
    desc: '월수입·고정지출·저축목표·보유자산·부채와 투자자산 금액을 입력해요.',
  },
  {
    mock: 'peer',
    title: 'Peer Matching & Benchmark',
    desc: '경제적 여건이 비슷한 Peer Group을 구성하고 집계 평균을 산출해요.',
  },
  {
    mock: 'risk',
    title: 'AI Risk Review',
    desc: 'AI가 위험점수·위험단계와 분석문구로 지금 상태를 설명해줘요.',
  },
  {
    mock: 'compare',
    title: 'Random Peer Comparison',
    desc: 'Peer Group에서 임의로 뽑힌 3명 중 한 명과 직접 차트로 비교해요.',
  },
  {
    mock: 'chat',
    title: 'Analysis Chatbot',
    desc: '분석 결과에 등장한 어려운 개념을 챗봇에게 바로 물어봐요.',
  },
] as const;

// 기획서 4.2 "기존 서비스 대비 차별성" 요약
const DIFFERENTIATORS = [
  {
    title: 'Market Benchmark가 아닌\nPersonal Benchmark',
    desc: '전체 시장이 아니라 경제적 여건이 비슷한 집단을 비교 기준으로 사용해요.',
  },
  {
    title: '결과가 아닌\n과정 비교',
    desc: '수익률이나 자산순위 대신 투자금액, 자산배분, 부채 부담과 집중도를 비교해요.',
  },
  {
    title: '비교와 위험 판단을\n분리',
    desc: 'Peer와 다르다는 이유만으로 위험하다고 보지 않고, 자산 특성과 집중도를 함께 살펴요.',
  },
  {
    title: '집단 평균과\n개인 사례를 구분',
    desc: 'AI는 집계 평균만 분석하고, 임의 Peer 3명은 참고용 사례로 따로 제공돼요.',
  },
];

// 기능명세서 CHAT-06, 4.5 "개인정보 및 브라우저 저장" 요약
const SAFEGUARDS = [
  '특정 종목·상품을 추천하거나 매수·매도를 권유하지 않아요.',
  '개별 Peer의 정보는 공개하지 않고, 집계된 평균만 비교에 사용해요.',
  '챗봇 대화는 세션이 끝나면 삭제되고, 이후에는 다시 불러올 수 없어요.',
];

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
    aria-hidden
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// 히어로에 띄우는 미리보기 카드용 더미 수치. 실제 위험 분석 카드·비교표와 같은
// 형태(점수 바 + 평균 대비 퍼센트 배지)를 흉내내 우리 앱 화면처럼 보이게 한다.
const PREVIEW_SCORE = 62;
const PREVIEW_ROWS = [
  { label: '국내 주식', diff: 24 },
  { label: '해외 주식', diff: -17 },
  { label: '예·적금', diff: -9 },
];

type LandingButtonVariant = 'primary' | 'outline';

const LANDING_BUTTON_CLASSNAMES: Record<LandingButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary-mint-800 to-primary-mint-900 text-white shadow-lg shadow-primary-mint-900/25 hover:-translate-y-0.5 hover:shadow-xl',
  outline:
    'border border-primary-mint-900/20 bg-white/80 text-primary-mint-900 backdrop-blur hover:border-primary-mint-900/40 hover:bg-white',
};

// 히어로/마무리 CTA에서 공통으로 쓰는 버튼. 완전히 둥근 필 대신 각진 라운드로
// 톤을 낮추고, 그라데이션 채움으로 강조를 준다.
const LandingButton = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}: {
  variant?: LandingButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className={`group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold transition-all sm:text-[16px] ${LANDING_BUTTON_CLASSNAMES[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

// 스크롤에 들어오면 위로 살짝 떠오르며 나타나는 섹션 래퍼
const Reveal = ({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.25 }}
    variants={fadeUp}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// 실제 위험 분석 카드·비교표(RiskAnalysisCard, ComparisonTable)와 같은 생김새로
// 만든 장식용 미리보기. 실제 화면처럼 보이도록 점수 바 + 그라데이션 글로우를 곁들인다.
const PreviewCard = () => (
  <div className="relative w-full max-w-[380px]">
    <div
      aria-hidden
      className="absolute inset-0 translate-y-6 scale-95 rounded-[32px] bg-gradient-to-br from-primary-mint-500 to-primary-mint-900 opacity-40 blur-2xl"
    />
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: 4 }}
      animate={{ opacity: 1, y: 0, rotate: 1.5 }}
      whileHover={{ rotate: 0, y: -4 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative rounded-3xl bg-white p-7 shadow-2xl shadow-primary-mint-900/25 ring-1 ring-black/5"
    >
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-mint-900 text-[13px] font-bold text-white">
            P
          </span>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-primary-mint-900">
              AI 분석 리포트
            </span>
            <span className="text-[11px] text-gray-400">방금 생성됨</span>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
          MEDIUM
        </span>
      </div>

      <div className="mb-2 flex items-end justify-between">
        <span className="text-[13px] font-medium text-gray-500">종합 위험 점수</span>
        <span className="text-[28px] font-bold text-primary-mint-900">
          {PREVIEW_SCORE}
          <span className="text-[13px] font-medium text-gray-400"> / 100</span>
        </span>
      </div>
      <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
          style={{ width: `${PREVIEW_SCORE}%` }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {PREVIEW_ROWS.map((row) => {
          const isAbove = row.diff > 0;
          return (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-3.5 py-2.5"
            >
              <span className="text-[13px] font-medium text-gray-700">{row.label}</span>
              <span
                className={`inline-flex items-center gap-0.5 rounded-lg px-2 py-1 text-[11px] font-bold ${
                  isAbove
                    ? 'bg-primary-mint-200 text-primary-mint-900'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <span aria-hidden>{isAbove ? '▲' : '▼'}</span>
                {Math.abs(row.diff)}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  </div>
);

// 문제 정의 / 차별성 카드에서 공통으로 쓰는 카드 스타일. 색 채운 박스 대신
// 흰 배경 + 옅은 테두리로 담백하게 가고, 호버 시에만 그림자를 준다.
const CARD_CLASSNAME =
  'h-full rounded-2xl border border-gray-100 bg-white p-6 transition-shadow duration-200 hover:shadow-[0_12px_32px_-16px_rgba(1,62,57,0.25)]';

// 각 단계의 실제 앱 화면을 축소한 미니 목업. 이모지 대신 "이 서비스가 실제로
// 이렇게 생겼다"를 보여주기 위해 우리 컴포넌트 톤 그대로 작게 그린다.
const StepMock = ({ id }: { id: string }) => {
  const frame =
    'flex h-[150px] w-full flex-col justify-center gap-2.5 overflow-hidden rounded-xl bg-primary-mint-200/40 p-4';

  if (id === 'profile') {
    return (
      <div className={frame}>
        {['월 수입', '월 고정 지출'].map((label) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500">{label}</span>
            <div className="flex items-center justify-end rounded-md bg-white px-2.5 py-1.5 text-[12px] font-bold text-primary-mint-900 ring-1 ring-gray-200">
              3,000,000
              <span className="ml-1 text-[10px] font-medium text-gray-400">원</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === 'peer') {
    return (
      <div className={`${frame} items-center`}>
        <div className="flex -space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`size-7 rounded-full ring-2 ring-white ${
                i === 2 ? 'bg-primary-mint-800' : 'bg-primary-mint-300'
              }`}
            />
          ))}
        </div>
        <span className="rounded-md bg-primary-mint-900 px-2.5 py-1 text-[11px] font-bold text-white">
          Peer Group 평균
        </span>
      </div>
    );
  }

  if (id === 'risk') {
    return (
      <div className={frame}>
        <div className="flex items-end justify-between">
          <span className="text-[11px] font-medium text-gray-500">종합 위험 점수</span>
          <span className="text-[19px] font-bold text-primary-mint-900">62</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white">
          <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-amber-400 to-amber-500" />
        </div>
        <span className="w-fit rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
          MEDIUM
        </span>
      </div>
    );
  }

  if (id === 'compare') {
    const bars = [
      { label: '나', width: 74, color: 'bg-primary-mint-900' },
      { label: '상대', width: 46, color: 'bg-primary-mint-300' },
    ];
    return (
      <div className={`${frame} gap-3`}>
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-2.5">
            <span className="w-6 shrink-0 text-[11px] font-semibold text-gray-500">
              {bar.label}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white">
              <div
                className={`h-full rounded-full ${bar.color}`}
                style={{ width: `${bar.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // chat
  return (
    <div className={`${frame} gap-2.5`}>
      <div className="w-fit max-w-[88%] rounded-lg rounded-bl-sm bg-white px-2.5 py-1.5 text-[11px] text-gray-700 ring-1 ring-gray-200">
        무엇을 도와드릴까요?
      </div>
      <div className="ml-auto w-fit max-w-[88%] rounded-lg rounded-br-sm bg-primary-mint-900 px-2.5 py-1.5 text-[11px] text-white">
        방어적 자산이 뭔가요?
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  const goSignup = () => navigate('/signup');
  const goLogin = () => navigate('/login');

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-mint-300 to-primary-mint-200">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 size-[420px] rounded-full bg-primary-mint-500/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-[-80px] size-[320px] rounded-full bg-white/50 blur-3xl"
        />

        <div className="relative mx-auto flex max-w-[1080px] flex-col items-center gap-14 px-5 py-20 sm:py-28 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
            className="flex max-w-[560px] flex-col items-start gap-7"
          >
            <motion.img
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              src={logo}
              alt="peerfolio"
              className="h-[28px] w-auto"
            />

            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-lg bg-white/70 px-3.5 py-1.5 text-[13px] font-semibold text-primary-mint-900 backdrop-blur"
            >
              Peer Benchmark 기반 AI 투자행동 점검 서비스
            </motion.span>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-[36px] font-semibold leading-[1.15] tracking-[-0.04em] text-primary-mint-900 sm:text-[52px] lg:text-[58px]"
            >
              시장보다{' '}
              <span className="text-primary-mint-800">먼저</span>,
              <br />
              내 투자행동부터
              <br />
              점검해요
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-[16px] font-medium leading-relaxed text-primary-mint-900/75 sm:text-[19px]"
            >
              나와 경제적 여건이 비슷한 Peer Group과 비교하고, AI가 위험 요인을
              짚어주고, 막히는 용어는 챗봇에게 바로 물어보세요.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <LandingButton variant="primary" onClick={goSignup}>
                무료로 시작하기
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </LandingButton>
              <LandingButton variant="outline" onClick={goLogin}>
                로그인
              </LandingButton>
            </motion.div>
          </motion.div>

          <div className="flex w-full justify-center lg:w-auto lg:justify-end">
            <PreviewCard />
          </div>
        </div>
      </section>

      {/* 문제 정의 — 가볍게 한 줄씩 훑는 리스트 */}
      <section className="bg-system-background">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-5 py-14 sm:py-16">
          <Reveal>
            <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-primary-mint-900 sm:text-[26px]">
              종목·수익률만으론 답하기 어려운 질문들
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {QUESTIONS.map((question, index) => (
              <Reveal key={question} delay={index * 0.05}>
                <p className="border-l-2 border-primary-mint-300 pl-4 text-[15px] font-medium leading-relaxed text-gray-700">
                  {question}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 작동 방식 — 이 서비스의 핵심 흐름이라 카드/글씨를 가장 도드라지게 */}
      <section className="bg-primary-mint-200/40">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-10 px-5 py-20 sm:py-28">
          <Reveal>
            <h2 className="text-[28px] font-bold tracking-[-0.04em] text-primary-mint-900 sm:text-[36px]">
              Peerfolio는 이렇게 동작해요
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex h-full flex-col gap-4 rounded-[20px] border border-primary-mint-900/10 bg-white p-7 shadow-[0_20px_44px_-22px_rgba(1,62,57,0.3)] transition-shadow hover:shadow-[0_28px_56px_-20px_rgba(1,62,57,0.4)]"
                >
                  <span className="text-[13px] font-bold tracking-[0.08em] text-primary-mint-800">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <StepMock id={step.mock} />
                  <h3 className="text-[20px] font-bold tracking-[-0.02em] text-primary-mint-900">
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-gray-700">
                    {step.desc}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 차별성 */}
      <section className="bg-system-background">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-5 py-16 sm:py-20">
          <Reveal>
            <h2 className="text-[26px] font-semibold tracking-[-0.04em] text-primary-mint-900 sm:text-[32px]">
              다른 서비스와는 이렇게 달라요
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DIFFERENTIATORS.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className={CARD_CLASSNAME}>
                  <h3 className="whitespace-pre-line text-[18px] font-semibold leading-snug text-primary-mint-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-gray-700">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 안전장치 — 가벼운 신뢰 문구 리스트 */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-5 px-5 py-14 sm:py-16">
          <Reveal>
            <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-primary-mint-900 sm:text-[22px]">
              투자 권유 없이, 비교와 설명만 해요
            </h2>
          </Reveal>
          <ul className="flex flex-col gap-2.5">
            {SAFEGUARDS.map((text, index) => (
              <Reveal key={text} delay={index * 0.05}>
                <li className="flex items-start gap-2.5 text-[14px] font-medium leading-relaxed text-gray-700 sm:text-[15px]">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-mint-200 text-primary-mint-900">
                    <CheckIcon />
                  </span>
                  {text}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 마무리 CTA */}
      <section className="bg-primary-mint-200">
        <Reveal className="mx-auto flex max-w-[1080px] flex-col items-center gap-6 px-5 py-16 text-center sm:py-20">
          <h2 className="text-[24px] font-semibold leading-tight tracking-[-0.04em] text-primary-mint-900 sm:text-[32px]">
            지금 바로 내 투자행동을 점검해보세요
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LandingButton variant="primary" onClick={goSignup}>
              무료로 시작하기
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </LandingButton>
            <LandingButton variant="outline" onClick={goLogin}>
              로그인
            </LandingButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default LandingPage;
