import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withDraw } from '../../api/authAPI';
import useAuthStore from '../../stores/useAuthStore';
import { clearAnalysisStorage } from '../../utils/analysisStorage';

const WithdrawPage = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [password, setPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !isAgreed || isLoading) return;

    if (window.confirm('정말로 탈퇴하시겠습니까? 복구할 수 없습니다.')) {
      try {
        setIsLoading(true);
        await withDraw({ password });

        alert('회원탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
        clearAuth();
        clearAnalysisStorage();
        navigate('/login');
      } catch {
        alert('회원탈퇴에 실패하였습니다. 비밀번호를 다시 확인해주세요.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 버튼 활성화 조건: 비밀번호가 입력되고 동의 체크박스가 체크되었을 때
  const isFormValid = password.length > 0 && isAgreed;

  return (
    <div className="flex min-h-screen w-full py-12 justify-center">
      <div className="w-[530px] flex flex-col my-auto">
        <div className="text-black text-left font-semibold text-[32px] pb-7">
          <h1>회원탈퇴</h1>
        </div>

        <div className="flex flex-col">
          <form onSubmit={handleWithdraw} className="flex flex-col gap-7">
            <div className="bg-gray-100 p-6 rounded-lg flex flex-col gap-2">
              <p className="font-semibold text-[16px] text-system-red">
                탈퇴 전 반드시 확인해주세요!
              </p>
              <ul className="text-[14px] text-gray-700 list-disc list-inside">
                <li>탈퇴 시 모든 계정 정보 및 이용 내역이 삭제됩니다.</li>
                <li>삭제된 데이터는 어떠한 경우에도 복구할 수 없습니다.</li>
              </ul>
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-2">
              <p>비밀번호 확인</p>
              <input
                type="password"
                placeholder="본인 확인을 위해 비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="bg-gray-100 p-4 w-full rounded-lg"
              />
            </div>

            {/* 동의 체크박스 */}
            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                id="agree"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="w-5 h-5 cursor-pointer"
              />
              <label
                htmlFor="agree"
                className="text-[15px] cursor-pointer select-none"
              >
                안내사항을 모두 확인하였으며, 회원탈퇴에 동의합니다.
              </label>
            </div>

            {/* 탈퇴 버튼 */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`${
                isFormValid ? 'bg-red-500' : 'bg-gray-300'
              } px-20 py-4 text-[16px] font-semibold text-white rounded-lg cursor-pointer disabled:cursor-not-allowed mt-4`}
            >
              {isLoading ? '탈퇴 처리 중...' : '탈퇴하기'}
            </button>

            {/* 취소 버튼 (옵션) */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => navigate(-1)}
              className="px-20 py-4 text-[16px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer disabled:cursor-not-allowed"
            >
              취소
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
