import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveFinancial } from '../api/financial';

import CategoryCard from '../components/info/CategoryCard';
import CurrencyInput from '../components/info/CurrencyInput';

const InfoInputPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormDataState] = useState({
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
        age: 20, // 나이 데이터 연동 필요 -> 어디서 가져오는가? 아마 유저인포에서 받아와야될듯!
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
      alert('저장했어요.');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div>
      <div className="w-[1080px] my-[144px] mx-auto">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-black">정보 입력</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-primary-mint-900 text-[24px] font-semibold mb-[22px]">
            자산 정보
          </h2>
          <div className="flex flex-col gap-0.5">
            <CategoryCard title="총 수입">
              <div className="grid grid-cols-3 gap-5">
                <CurrencyInput
                  label="월 수입"
                  value={formData.monthlyIncome}
                  onChange={handleChange('monthlyIncome')}
                />
                <CurrencyInput
                  label="고정 지출"
                  value={formData.fixedExpense}
                  onChange={handleChange('fixedExpense')}
                />
                <CurrencyInput
                  label="월 저축"
                  value={formData.savingsGoal}
                  onChange={handleChange('savingsGoal')}
                />
              </div>
            </CategoryCard>

            <CategoryCard title="현금">
              <div className="grid grid-cols-3 gap-5">
                <CurrencyInput
                  label="총 자산 금액"
                  value={formData.totalAssetAmount}
                  onChange={handleChange('totalAssetAmount')}
                />
                <CurrencyInput
                  label="총 부채 금액"
                  value={formData.totalDebtAmount}
                  onChange={handleChange('totalDebtAmount')}
                />
                {/*뭔가 안맞는것 같으니 일단 대충 처리 ^^ */}
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
            className="flex-1 py-4 border border-primary-mint-800 bg-white text-[16px] text-primary-mint-800 rounded-lg font-semibold cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          >
            취소하기
          </button>
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className="flex-1 py-4 border border-primary-mint-800 bg-primary-mint-800 text-[16px] text-white rounded-lg font-semibold cursor-pointer"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoInputPage;
