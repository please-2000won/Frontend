import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AssetInfoSection from '../components/main/sections/AssetInfoSection';
import ComparisonSection from '../components/main/sections/ComparisonSection';
import SimilarPeopleSection from '../components/main/sections/SimilarPeopleSection';
import PeerCompareModal from '../components/main/peer-compare/PeerCompareModal';
import { useMainPageData } from '../hooks/useMainPageData';
import useAuthStore from '../stores/useAuthStore';
import type { SimilarPersonData } from '../constants/main/mockData';

const DEFAULT_NAME = '회원';

const MainPage = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  // 팀원이 로그인 시 채워두는 유저 정보(useAuthStore.userInfo)를 그대로 재사용한다.
  const name = useAuthStore((state) => state.userInfo?.name) ?? DEFAULT_NAME;

  const { hasAssetInfo, assetCards, investCards, myProfile } = useMainPageData();

  const [selectedPeer, setSelectedPeer] = useState<SimilarPersonData | null>(null);

  // 비로그인 사용자는 메인페이지를 볼 수 없고 로그인 화면으로 이동해야 한다.
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const goToInfoInput = () => navigate('/infoInput');

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
        onReanalyzeClick={() => {}}
        myProfile={myProfile}
      />
      {hasAssetInfo && <SimilarPeopleSection onSelectPeer={setSelectedPeer} />}
      {selectedPeer && (
        <PeerCompareModal
          myName={name}
          myProfile={myProfile}
          peer={selectedPeer}
          onClose={() => setSelectedPeer(null)}
        />
      )}
    </div>
  );
};

export default MainPage;
