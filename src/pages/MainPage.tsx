import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AssetInfoSection from '../components/main/sections/AssetInfoSection';
import ComparisonSection from '../components/main/sections/ComparisonSection';
import SimilarPeopleSection from '../components/main/sections/SimilarPeopleSection';
import PeerCompareModal from '../components/main/peer-compare/PeerCompareModal';
import AnalysisLoadingModal from '../components/main/ui/AnalysisLoadingModal';
import { useMainPageData } from '../hooks/useMainPageData';
import { usePeerGroupAnalysis } from '../hooks/usePeerGroupAnalysis';
import { useSimilarPeers, type PeerComparePayload } from '../hooks/useSimilarPeers';
import { saveChatbotContext } from '../utils/analysisStorage';
import useAuthStore from '../stores/useAuthStore';
import useGuestModeStore from '../stores/useGuestModeStore';

const DEFAULT_NAME = '회원';
const GUEST_NAME = '게스트';

// 챗봇 경로가 확정되지 않아 임시로 사용하는 경로
const CHATBOT_PATH = '/chatbot';

const MainPage = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isGuestMode = useGuestModeStore((state) => state.isGuestMode);
  // 팀원이 로그인 시 채워두는 유저 정보(useAuthStore.userInfo)를 그대로 재사용한다.
  const userInfo = useAuthStore((state) => state.userInfo);
  const name = userInfo?.name ?? (isGuestMode ? GUEST_NAME : DEFAULT_NAME);

  const { hasAssetInfo, assetCards, investCards, myProfile, financialInfo } =
    useMainPageData(isGuestMode);
  const { peerGroupProfile, aiAnalysisText, risk, analysis, isAnalyzing, isStale, reanalyze } =
    usePeerGroupAnalysis(isGuestMode, hasAssetInfo, userInfo?.userId, financialInfo);
  const { peers, getComparison } = useSimilarPeers(isGuestMode, hasAssetInfo);

  const [compare, setCompare] = useState<PeerComparePayload | null>(null);

  // 챗봇 페이지로 넘길 컨텍스트(내 금융정보 + 분석 결과)를 로컬스토리지에 담아둔다.
  useEffect(() => {
    if (isGuestMode || (!financialInfo && !analysis)) return;
    saveChatbotContext({
      userId: userInfo?.userId ?? 0,
      financialInfo,
      analysis,
    });
  }, [isGuestMode, financialInfo, analysis, userInfo?.userId]);

  // 비로그인 사용자는 게스트 체험 모드가 아니면 메인페이지를 볼 수 없고 로그인 화면으로 이동해야 한다.
  if (!accessToken && !isGuestMode) {
    return <Navigate to="/login" replace />;
  }

  const goToInfoInput = () => navigate('/infoInput');

  const handleSelectPeer = async (peerUserId: number) => {
    const payload = await getComparison(peerUserId);
    if (payload) setCompare(payload);
  };

  return (
    <div className="flex flex-col">
      <AssetInfoSection
        name={name}
        hasAssetInfo={hasAssetInfo}
        assetCards={assetCards}
        investCards={investCards}
        onWriteClick={goToInfoInput}
        onEditClick={goToInfoInput}
      />
      <ComparisonSection
        hasAssetInfo={hasAssetInfo}
        onReanalyzeClick={reanalyze}
        onAskChatbot={() => navigate(CHATBOT_PATH)}
        myProfile={myProfile}
        peerGroupProfile={peerGroupProfile}
        aiAnalysisText={aiAnalysisText}
        risk={risk}
        isStale={isStale}
      />
      {hasAssetInfo && (
        <SimilarPeopleSection peers={peers} onSelectPeer={handleSelectPeer} />
      )}
      {compare && (
        <PeerCompareModal
          myName={name}
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
