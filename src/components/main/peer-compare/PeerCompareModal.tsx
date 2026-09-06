import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { PeerFinancialProfile } from '../../../constants/main/mockData';
import { buildComparisonGroups } from '../../../utils/buildComparisonGroups';
import PeerBarChart from '../ui/PeerBarChart';
import PeerPieChart from '../ui/PeerPieChart';
import ComparisonTable from '../ui/ComparisonTable';

type PeerCompareViewMode = 'bar' | 'pie' | 'table';

interface PeerCompareModalProps {
  myProfile: PeerFinancialProfile;
  peerName: string;
  peerProfile: PeerFinancialProfile;
  onClose: () => void;
}

const VIEW_MODE_OPTIONS: {
  mode: PeerCompareViewMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    mode: 'bar',
    label: '막대 차트',
    icon: (
      <svg
        className="size-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    mode: 'pie',
    label: '원형 차트',
    icon: (
      <svg
        className="size-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    ),
  },
  {
    mode: 'table',
    label: '비교 표',
    icon: (
      <svg
        className="size-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="12" y1="3" x2="12" y2="21" />
      </svg>
    ),
  },
];

const MY_LABEL = '나';

const PeerCompareModal = ({
  myProfile,
  peerName,
  peerProfile,
  onClose,
}: PeerCompareModalProps) => {
  const [viewMode, setViewMode] = useState<PeerCompareViewMode>('bar');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const groups = buildComparisonGroups(myProfile, peerProfile);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-mint-50 px-2.5 py-0.5 text-[12px] font-semibold text-primary-mint-900 border border-primary-mint-100">
              1:1 비교
            </span>
            <h3 className="text-[18px] font-bold tracking-[-0.03em] text-primary-mint-900">
              {MY_LABEL} vs {peerName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-all duration-150 hover:bg-gray-100 hover:text-gray-700 active:scale-95"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* 모던 트렌디 Segmented Control 토글 */}
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-xl bg-gray-100/90 p-1 shadow-2xs">
              {VIEW_MODE_OPTIONS.map((option) => {
                const isSelected = viewMode === option.mode;
                return (
                  <button
                    key={option.mode}
                    type="button"
                    onClick={() => setViewMode(option.mode)}
                    className={`relative z-10 flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors duration-150 ${
                      isSelected
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="peerCompareTab"
                        className="absolute inset-0 -z-10 rounded-lg bg-white shadow-xs"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                    <span
                      className={`transition-colors ${
                        isSelected
                          ? 'text-primary-mint-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {option.icon}
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 차트 영역: 어떤 보기든 같은 높이·정렬 */}
          <div className="flex min-h-[380px] flex-col justify-center">
            {viewMode === 'bar' && (
              <div className="flex flex-col gap-8">
                {groups.map((group) => (
                  <PeerBarChart
                    key={group.title}
                    title={group.title}
                    metrics={group.metrics}
                    myLabel={MY_LABEL}
                    otherLabel={peerName}
                  />
                ))}
              </div>
            )}
            {viewMode === 'pie' && (
              <PeerPieChart
                myLabel={MY_LABEL}
                myProfile={myProfile}
                otherLabel={peerName}
                otherProfile={peerProfile}
              />
            )}
            {viewMode === 'table' && (
              <ComparisonTable
                groups={groups}
                myLabel={MY_LABEL}
                otherLabel={peerName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerCompareModal;
