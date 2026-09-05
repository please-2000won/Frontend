import { useEffect, useState } from 'react';
import type { PeerFinancialProfile } from '../../../constants/main/mockData';
import { buildComparisonGroups } from '../../../utils/buildComparisonGroups';
import PeerBarChart from '../ui/PeerBarChart';
import PeerPieChart from '../ui/PeerPieChart';
import PeerCompareRadarChart from './PeerCompareRadarChart';

type PeerCompareViewMode = 'bar' | 'pie' | 'radar';

interface PeerCompareModalProps {
  myProfile: PeerFinancialProfile;
  peerName: string;
  peerProfile: PeerFinancialProfile;
  onClose: () => void;
}

const VIEW_MODE_OPTIONS: { mode: PeerCompareViewMode; label: string }[] = [
  { mode: 'bar', label: '막대' },
  { mode: 'pie', label: '원형' },
  { mode: 'radar', label: '레이더' },
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-y-auto rounded-[20px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-primary-mint-900">
            {MY_LABEL} vs {peerName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          {/* 보기 방식 토글 */}
          <div className="flex justify-center">
            <div className="inline-flex overflow-hidden rounded-full border border-primary-mint-900 text-[13px] font-semibold">
              {VIEW_MODE_OPTIONS.map((option) => (
                <button
                  key={option.mode}
                  type="button"
                  onClick={() => setViewMode(option.mode)}
                  className={`cursor-pointer px-4 py-1.5 transition-colors ${
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
            {viewMode === 'radar' && (
              <PeerCompareRadarChart
                myName={MY_LABEL}
                peerName={peerName}
                myProfile={myProfile}
                peerProfile={peerProfile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerCompareModal;
