import { useEffect, useState } from 'react';
import type { PeerFinancialProfile } from '../../../constants/main/mockData';
import { buildComparisonGroups } from '../../../utils/buildComparisonGroups';
import PeerBarChart from '../ui/PeerBarChart';
import PeerPieChart from '../ui/PeerPieChart';
import PeerCompareRadarChart from './PeerCompareRadarChart';

type PeerCompareViewMode = 'bar' | 'pie' | 'radar';

interface PeerCompareModalProps {
  myName: string;
  myProfile: PeerFinancialProfile;
  peerName: string;
  peerProfile: PeerFinancialProfile;
  onClose: () => void;
}

const VIEW_MODE_OPTIONS: { mode: PeerCompareViewMode; label: string }[] = [
  { mode: 'bar', label: '막대로 보기' },
  { mode: 'pie', label: '원형 차트' },
  { mode: 'radar', label: '레이더 차트' },
];

const PeerCompareModal = ({
  myName,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[900px] flex-col gap-8 overflow-y-auto rounded-[24px] bg-white p-8 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-center gap-10">
            <span className="text-[24px] font-bold tracking-[-1.2px] text-primary-mint-900">
              나
            </span>
            <span className="text-[24px] font-bold tracking-[-1.2px] text-primary-mint-900">
              {peerName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className="inline-flex overflow-hidden rounded-[100px] border border-primary-mint-900 text-[14px] font-semibold tracking-[-0.7px]">
            {VIEW_MODE_OPTIONS.map((option) => (
              <button
                key={option.mode}
                type="button"
                onClick={() => setViewMode(option.mode)}
                className={`cursor-pointer px-5 py-2 transition-colors ${
                  viewMode === option.mode
                    ? 'bg-primary-mint-900 text-white'
                    : 'bg-white text-primary-mint-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {viewMode === 'bar' && (
          <div className="flex flex-col gap-10">
            {groups.map((group) => (
              <PeerBarChart
                key={group.title}
                title={group.title}
                metrics={group.metrics}
                myLabel="나"
                otherLabel={peerName}
              />
            ))}
          </div>
        )}
        {viewMode === 'pie' && (
          <PeerPieChart
            myLabel="나"
            myProfile={myProfile}
            otherLabel={peerName}
            otherProfile={peerProfile}
          />
        )}
        {viewMode === 'radar' && (
          <PeerCompareRadarChart
            myName={myName}
            peerName={peerName}
            myProfile={myProfile}
            peerProfile={peerProfile}
          />
        )}
      </div>
    </div>
  );
};

export default PeerCompareModal;
