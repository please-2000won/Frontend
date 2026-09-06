import { useState } from 'react';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import AssetInfoSection from '../components/main/sections/AssetInfoSection';
import ComparisonSection from '../components/main/sections/ComparisonSection';
import SimilarPeopleSection from '../components/main/sections/SimilarPeopleSection';
import MainEmptyState from '../components/main/sections/MainEmptyState';
import PeerCompareModal from '../components/main/peer-compare/PeerCompareModal';
import AnalysisLoadingModal from '../components/main/ui/AnalysisLoadingModal';
import Button from '../components/common/Button';
import { useMainPageData } from '../hooks/useMainPageData';
import { usePeerGroupAnalysis } from '../hooks/usePeerGroupAnalysis';
import {
  useSimilarPeers,
  type PeerComparePayload,
} from '../hooks/useSimilarPeers';
import useAuthStore from '../stores/useAuthStore';

const DEFAULT_NAME = '회원';

type ChatContextType = {
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MainPage = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  // 로그인 시 채워둔 유저 정보를 재사용한다.
  const userInfo = useAuthStore((state) => state.userInfo);
  const name = userInfo?.name ?? DEFAULT_NAME;

  const {
    isLoading,
    isError: isMainError,
    hasAssetInfo,
    assetCards,
    investCards,
    myProfile,
    financialInfo,
    refetch: refetchMain,
  } = useMainPageData(Boolean(accessToken), userInfo?.userId);

  const {
    peerGroupProfile,
    aiAnalysisText,
    risk,
    peerCount,
    analyzedAt,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
    isAnalyzing,
    isStale,
    reanalyze,
    refetch: refetchAnalysis,
  } = usePeerGroupAnalysis(hasAssetInfo, userInfo?.userId, financialInfo);

  const {
    peers,
    isLoading: isPeersLoading,
    isError: isPeersError,
    getComparison,
    refetch: refetchPeers,
  } = useSimilarPeers(hasAssetInfo, userInfo?.userId);

  const [compare, setCompare] = useState<PeerComparePayload | null>(null);

  const { setIsChatOpen } = useOutletContext<ChatContextType>();

  // 로그인 안 했으면 랜딩 페이지로 이동.
  if (!accessToken) {
    return <Navigate to="/landing" replace />;
  }

  // 내 금융정보를 불러오는 중에는 로딩 표시.
  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-24 text-[15px] text-gray-500">
        불러오는 중…
      </div>
    );
  }

  // 내 자산 정보 조회에 실패한 경우
  if (isMainError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-5 text-center">
        <div className="text-[32px]">⚠️</div>
        <p className="text-[16px] font-medium text-gray-800">
          자산 정보를 불러오는 데 실패했습니다.
        </p>
        <Button variant="secondary" size="md" onClick={() => refetchMain()}>
          다시 시도
        </Button>
      </div>
    );
  }

  // 로그인은 했지만 아직 아무 정보도 입력하지 않은 상태.
  if (!hasAssetInfo) {
    return <MainEmptyState />;
  }

  const goToInfoInput = () => navigate('/infoInput');

  const handleSelectPeer = async (peerUserId: number) => {
    const payload = await getComparison(peerUserId);
    if (payload) setCompare(payload);
  };

  // 재분석 시 피어 매칭도 갱신
  const handleReanalyze = async () => {
    await reanalyze();
    await refetchPeers();
  };

  return (
    <div className="flex flex-col">
      <AssetInfoSection
        name={name}
        hasAssetInfo={hasAssetInfo}
        assetCards={assetCards}
        investCards={investCards}
        updatedAt={financialInfo?.updatedAt}
        onWriteClick={goToInfoInput}
        onEditClick={goToInfoInput}
      />
      <ComparisonSection
        hasAssetInfo={hasAssetInfo}
        onReanalyzeClick={handleReanalyze}
        onAskChatbot={() => setIsChatOpen((prev) => !prev)}
        myProfile={myProfile}
        peerGroupProfile={peerGroupProfile}
        aiAnalysisText={aiAnalysisText}
        risk={risk}
        peerCount={peerCount}
        analyzedAt={analyzedAt}
        isStale={isStale}
        isLoading={isAnalysisLoading}
        isError={isAnalysisError}
        onRetry={refetchAnalysis}
        isAnalyzing={isAnalyzing}
      />
      {hasAssetInfo && (
        <SimilarPeopleSection
          peers={peers}
          isLoading={isPeersLoading}
          isError={isPeersError}
          onSelectPeer={handleSelectPeer}
        />
      )}
      {compare && (
        <PeerCompareModal
          myProfile={compare.myProfile}
          peerName={compare.peerName}
          peerProfile={compare.peerProfile}
          onClose={() => setCompare(null)}
        />
      )}
      <AnalysisLoadingModal open={isAnalyzing} />
    </div>
  );
};

export default MainPage;
