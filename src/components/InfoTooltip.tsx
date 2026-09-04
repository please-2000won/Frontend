import { useState } from 'react';

interface InfoTooltipProps {
  text: string;
  // 말풍선 위치. 카드 상단 요소에는 'bottom'을 써서 잘리지 않게 한다.
  placement?: 'top' | 'bottom';
}

// 라벨 옆의 (i) 아이콘. 마우스를 올리거나 클릭하면 설명이 뜬다.
const InfoTooltip = ({ text, placement = 'top' }: InfoTooltipProps) => {
  const [pinned, setPinned] = useState(false);

  const position =
    placement === 'bottom' ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]';

  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label="설명 보기"
        onClick={() => setPinned((v) => !v)}
        className="flex size-[16px] cursor-pointer items-center justify-center rounded-full border border-gray-300 text-[11px] font-bold leading-none text-gray-700"
      >
        i
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-0 z-20 w-[220px] rounded-lg bg-primary-mint-900 px-3 py-2 text-[12px] font-medium leading-[1.45] text-white shadow-lg transition-opacity duration-150 ${position} ${
          pinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {text}
      </span>
    </span>
  );
};

export default InfoTooltip;
