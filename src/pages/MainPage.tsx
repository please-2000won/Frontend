import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AssetInfoSection from '../components/main/sections/AssetInfoSection';
import ComparisonSection from '../components/main/sections/ComparisonSection';
import SimilarPeopleSection from '../components/main/sections/SimilarPeopleSection';
import MainEmptyState from '../components/main/sections/MainEmptyState';
import PeerCompareModal from '../components/main/peer-compare/PeerCompareModal';
import AnalysisLoadingModal from '../components/main/ui/AnalysisLoadingModal';
import { useMainPageData } from '../hooks/useMainPageData';
import { usePeerGroupAnalysis } from '../hooks/usePeerGroupAnalysis';
import {
  useSimilarPeers,
  type PeerComparePayload,
} from '../hooks/useSimilarPeers';
import useAuthStore from '../stores/useAuthStore';

import { useOutletContext } from 'react-router-dom';

const DEFAULT_NAME = '회원';

type ChatContextType = {
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MainPage = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  // 팀원이 로그인 시 채워두는 유저 정보(useAuthStore.userInfo)를 그대로 재사용한다.
  const userInfo = useAuthStore((state) => state.userInfo);
  const name = userInfo?.name ?? DEFAULT_NAME;

  const {
    isLoading,
    hasAssetInfo,
    assetCards,
    investCards,
    myProfile,
    financialInfo,
  } = useMainPageData(Boolean(accessToken));

  // 팀원의 업데이트 내역: financialInfo 파라미터 추가 및 isStale 상태 추가
  const {
    peerGroupProfile,
    aiAnalysisText,
    risk,
    peerCount,
    analyzedAt,
    isAnalyzing,
    isStale,
    reanalyze,
  } = usePeerGroupAnalysis(hasAssetInfo, userInfo?.userId, financialInfo);

  // 팀원의 업데이트 내역: 로딩, 에러 상태 및 refetch 기능 추가
  const {
    peers,
    isLoading: isPeersLoading,
    isError: isPeersError,
    getComparison,
    refetch: refetchPeers,
  } = useSimilarPeers(hasAssetInfo);

  const [compare, setCompare] = useState<PeerComparePayload | null>(null);

  const { setIsChatOpen } = useOutletContext<ChatContextType>();

  // 로그인 안 했으면 랜딩 페이지로.
  if (!accessToken) {
    return <Navigate to="/landing" replace />;
  }

  // 내 금융정보를 불러오는 중에는 판단을 미룬다.
  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-24 text-[15px] text-gray-500">
        불러오는 중…
      </div>
    );
  }

  // 로그인은 했지만 아직 아무 정보도 입력하지 않은 상태.
  // 기본 경로에 머무르되, 정보 입력을 유도하는 화면을 보여준다.
  if (!hasAssetInfo) {
    return <MainEmptyState />;
  }

  const goToInfoInput = () => navigate('/infoInput');

  const handleSelectPeer = async (peerUserId: number) => {
    const payload = await getComparison(peerUserId);
    if (payload) setCompare(payload);
  };

  // 팀원의 업데이트 내역: 재분석하면 피어 매칭도 새로 갱신되므로 추천 피어를 다시 불러온다.
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
        // 나의 업데이트 내역: 별도 페이지 라우팅 대신 방금 구현한 우측 챗봇 패널 열기 유지
        onAskChatbot={() => setIsChatOpen((prev) => !prev)}
        myProfile={myProfile}
        peerGroupProfile={peerGroupProfile}
        aiAnalysisText={aiAnalysisText}
        risk={risk}
        peerCount={peerCount}
        analyzedAt={analyzedAt}
        isStale={isStale}
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
