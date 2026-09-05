export type MiniMockId = 'profile' | 'peer' | 'risk' | 'compare' | 'chat';

// 실제 앱 화면(입력 폼 / 위험 카드 / 챗봇 등)을 축소한 장식용 미니 목업.
// 랜딩 페이지와 로그인 후 빈 상태 화면에서 공통으로 쓴다.
const MiniMock = ({ id }: { id: MiniMockId }) => {
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

export default MiniMock;
