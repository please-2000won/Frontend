import { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';
import AssetInfoSection from '../components/main/AssetInfoSection';
import ComparisonSection, {
  type ComparisonViewMode,
} from '../components/main/ComparisonSection';
import SimilarPeopleSection from '../components/main/SimilarPeopleSection';

const MainPage = () => {
  const name = useAuthStore((state) => state.name) || '회원';

  const [hasAssetInfo, setHasAssetInfo] = useState(false);
  const [viewMode, setViewMode] = useState<ComparisonViewMode>('table');

  return (
    <div className="flex flex-col">
      <AssetInfoSection
        name={name}
        hasAssetInfo={hasAssetInfo}
        onWriteClick={() => setHasAssetInfo(true)}
        onEditClick={() => setHasAssetInfo(false)}
      />
      <ComparisonSection
        hasAssetInfo={hasAssetInfo}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReanalyzeClick={() => {}}
      />
      {hasAssetInfo && <SimilarPeopleSection />}
    </div>
  );
};

export default MainPage;
