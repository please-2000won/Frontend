import { useState } from 'react';
import AssetInfoSection from '../components/main/AssetInfoSection';
import ComparisonSection, {
  type ComparisonViewMode,
} from '../components/main/ComparisonSection';
import SimilarPeopleSection from '../components/main/SimilarPeopleSection';
import { useMainPageData } from '../components/main/useMainPageData';

const MainPage = () => {
  const {
    name,
    hasAssetInfo: hasFetchedAssetInfo,
    assetCards,
    investCards,
    comparisonAssetRows,
    comparisonInvestRows,
  } = useMainPageData();

  // API로 자산 정보를 받아오지 못했을 때 데모용으로 상태를 눌러볼 수 있도록 로컬 토글도 함께 둔다.
  const [isManuallyToggled, setIsManuallyToggled] = useState(false);
  const [viewMode, setViewMode] = useState<ComparisonViewMode>('table');

  const hasAssetInfo = hasFetchedAssetInfo || isManuallyToggled;

  return (
    <div className="flex flex-col">
      <AssetInfoSection
        name={name}
        hasAssetInfo={hasAssetInfo}
        assetCards={assetCards}
        investCards={investCards}
        onWriteClick={() => setIsManuallyToggled(true)}
        onEditClick={() => setIsManuallyToggled(false)}
      />
      <ComparisonSection
        hasAssetInfo={hasAssetInfo}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReanalyzeClick={() => {}}
        comparisonAssetRows={comparisonAssetRows}
        comparisonInvestRows={comparisonInvestRows}
      />
      {hasAssetInfo && <SimilarPeopleSection />}
    </div>
  );
};

export default MainPage;
