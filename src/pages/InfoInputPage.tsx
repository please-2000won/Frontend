import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveFinancial, getMyFinancial } from '../api/financial';
import { createAnalysis } from '../api/analysis';

import CategoryCard from '../components/info/CategoryCard';
import CurrencyInput from '../components/info/CurrencyInput';
import AnalysisLoadingModal from '../components/main/ui/AnalysisLoadingModal';

// 헤더의 태그 칩
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block w-fit rounded-md bg-primary-mint-900 px-[10px] py-[5px] text-[16px] font-bold text-white">
    {children}
  </span>
);

const InfoInputPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // 최초 입력 시에만 저장 직후 분석까지 진행한다.
  const [hasExistingInfo, setHasExistingInfo] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // 초기 데이터 로딩 상태
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormDataState] = useState({
    age: '',
    monthlyIncome: '', //월수입
    fixedExpense: '', //고정지출
    savingsGoal: '', //월 저축 -> 이거 디자인에선 반복됨!!
    totalAssetAmount: '', //총 자산 금액
    totalDebtAmount: '', //총 부채금액
    domesticStockAmount: '', //국내 주식
    foreignStockAmount: '', //해외 주식
    depositBondAmount: '', //예적금 및 채권
    alternativeAmount: '', //대체 고위험 자산
  });

  const handleSubmit = async () => {
    const parseNumber = (value: string) => Number(value.replace(/,/g, ''));
    const requestData = {
      financialProfile: {
        age: parseNumber(formData.age),
        monthlyIncome: parseNumber(formData.monthlyIncome),
        fixedExpense: parseNumber(formData.fixedExpense),
        savingsGoal: parseNumber(formData.savingsGoal),
        totalAssetAmount: parseNumber(formData.totalAssetAmount),
        totalDebtAmount: parseNumber(formData.totalDebtAmount),
      },
      financialAsset: {
        depositBondAmount: parseNumber(formData.depositBondAmount),
        domesticStockAmount: parseNumber(formData.domesticStockAmount),
        foreignStockAmount: parseNumber(formData.foreignStockAmount),
        alternativeAmount: parseNumber(formData.alternativeAmount),
      },
    };

    try {
      setIsLoading(true);
      await saveFinancial(requestData);

      // 최초 입력일 때만 저장 직후 분석까지 진행한다. 이후 수정은 저장만 하고,
      // 분석은 메인 페이지의 "다시 분석하기"에서 한다.
      if (!hasExistingInfo) {
        setIsAnalyzing(true);
        try {
          await createAnalysis();
        } catch (error) {
          console.error('최초 분석 생성에 실패했습니다.', error);
        } finally {
          setIsAnalyzing(false);
        }
      } else {
        alert('내 자산 정보를 저장했어요!');
      }

      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //자산 정보 불러오기
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        setIsFetching(true);
        const response = await getMyFinancial();

        if (response) {
          const profile = response.financialProfile;
          // 의미 있는 값이 하나라도 있으면 이미 입력한 적이 있는 것으로 본다.
          const alreadyEntered = Boolean(
            profile &&
              (profile.age ||
                profile.monthlyIncome ||
                profile.totalAssetAmount)
          );
          setHasExistingInfo(alreadyEntered);

          const formatNum = (val?: number) =>
            val !== undefined && val !== null
              ? Number(val).toLocaleString('ko-KR')
              : '';

          setFormDataState({
            age: formatNum(response.financialProfile?.age),
            monthlyIncome: formatNum(response.financialProfile?.monthlyIncome),
            fixedExpense: formatNum(response.financialProfile?.fixedExpense),
            savingsGoal: formatNum(response.financialProfile?.savingsGoal),
            totalAssetAmount: formatNum(
              response.financialProfile?.totalAssetAmount
            ),
            totalDebtAmount: formatNum(
              response.financialProfile?.totalDebtAmount
            ),
            domesticStockAmount: formatNum(
              response.financialAsset?.domesticStockAmount
            ),
            foreignStockAmount: formatNum(
              response.financialAsset?.foreignStockAmount
            ),
            depositBondAmount: formatNum(
              response.financialAsset?.depositBondAmount
            ),
            alternativeAmount: formatNum(
              response.financialAsset?.alternativeAmount
            ),
          });
        }
      } catch (error) {
        console.error('기존 자산 정보를 불러오는 데 실패하였습니다.', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchMyInfo();
  }, []);

  //항목 이름을 먼저 받은 후 입력 이벤트를 처리하는 것 -> 인풋이 많아도 이름표를 달아주면 처리가됨!
  //숫자만 적을 수 있도록 정규표현식 처리
  //오타 검사를 위한 keyof typeof formData -> 이 배열 내부에 있는 애들만 필드값으로 적도록 체킹
  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      //숫자 외의 문자를 받지 않음
      const value = e.target.value.replace(/[^0-9]/g, '');
      //값이 있다면, 숫자로 바꾼 뒤 3자리마다 콤마처리
      const formattedValue =
        value === '' ? '' : Number(value).toLocaleString('ko-KR');
      //추후 콤마 없애고 백에 보내야됨
      setFormDataState((prev) => ({ ...prev, [field]: formattedValue }));
    };

  // 데이터를 불러오는 중일 때 보여줄 UI (선택 사항)
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-[1080px] my-[64px] mx-auto">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-black">정보 입력</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-primary-mint-900 text-[24px] font-semibold mb-[22px]">
            기본 정보
          </h2>
          <div className="flex flex-col gap-0.5">
            <CategoryCard title="수입">
              <div className="grid grid-cols-3 gap-5">
                <CurrencyInput
                  label="월 수입"
                  value={formData.monthlyIncome}
                  onChange={handleChange('monthlyIncome')}
                />
                <CurrencyInput
                  label="월 고정 지출"
                  value={formData.fixedExpense}
                  onChange={handleChange('fixedExpense')}
                />
                <CurrencyInput
                  label="월 저축 계획"
                  value={formData.savingsGoal}
                  onChange={handleChange('savingsGoal')}
                />
              </div>
            </CategoryCard>

            {/* 프로필(나이) + 보유 자산(현금/부채) */}
            <CategoryCard
              title={
                <div className="grid grid-cols-3 gap-5">
                  <Chip>프로필</Chip>
                  <Chip>보유 자산</Chip>
                  <span />
                </div>
              }
            >
              <div className="grid grid-cols-3 gap-5">
                <CurrencyInput
                  label="나이 (만)"
                  value={formData.age}
                  onChange={handleChange('age')}
                  unit="세"
                  type="number"
                />
                <CurrencyInput
                  label="현금"
                  value={formData.totalAssetAmount}
                  onChange={handleChange('totalAssetAmount')}
                />
                <CurrencyInput
                  label="부채"
                  value={formData.totalDebtAmount}
                  onChange={handleChange('totalDebtAmount')}
                />
              </div>
            </CategoryCard>
          </div>
        </div>
        <div>
          <h2 className="text-primary-mint-900 text-[24px] font-semibold mb-[22px]">
            투자 정보
          </h2>
          <div>
            <div>
              <CategoryCard title="투자 자산">
                <div className="grid grid-cols-2 gap-5">
                  <CurrencyInput
                    label="국내 주식"
                    value={formData.domesticStockAmount}
                    onChange={handleChange('domesticStockAmount')}
                  />
                  <CurrencyInput
                    label="해외 주식"
                    value={formData.foreignStockAmount}
                    onChange={handleChange('foreignStockAmount')}
                  />
                  <CurrencyInput
                    label="예·적금 및 채권"
                    value={formData.depositBondAmount}
                    onChange={handleChange('depositBondAmount')}
                  />
                  <CurrencyInput
                    label="대체·고위험 자산"
                    value={formData.alternativeAmount}
                    onChange={handleChange('alternativeAmount')}
                  />
                </div>
              </CategoryCard>
            </div>
          </div>
        </div>
        <div className="flex gap-8 mt-8">
          <button
            type="button"
            disabled={isLoading}
            className="flex-1 py-4 border border-primary-mint-800 bg-white text-[16px] text-primary-mint-800 rounded-lg font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => {
              navigate(-1);
            }}
          >
            취소하기
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="flex-1 py-4 border border-primary-mint-800 bg-primary-mint-800 text-[16px] text-white rounded-lg font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? '저장 중...'
              : hasExistingInfo
                ? '저장하기'
                : '저장하고 분석하기'}
          </button>
        </div>
      </div>

      <AnalysisLoadingModal open={isAnalyzing} />
    </div>
  );
};

export default InfoInputPage;
