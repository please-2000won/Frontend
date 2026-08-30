import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getMyInfo } from '../api/authAPI';
import useAuthStore from '../stores/useAuthStore';

const LoginPage = () => {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //로딩 여부
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    //전송중이거나 이메일/패스워드가 없다면 리턴
    if (!email || !password || isLoading) return;

    try {
      setIsLoading(true);

      const data = await login({ email, password });

      //백엔드에서 준 data 내 토큰을 zustand 스토어에 저장
      //리프레쉬 토큰을 아직 구현을 안했으므로 추후
      //setAuth(data.accessToken, data.refreshToken, ''); 로 수정
      setAuth(data.accessToken, '');

      const userInfoData = await getMyInfo();
      setUserInfo(userInfoData);

      navigate('/');
    } catch (error) {
      alert('로그인에 실패하였습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col w-1/2 bg-primary-mint-300 justify-end pl-20 pb-10 ">
        <h1 className="text-[48px] text-primary-mint-900 font-semibold mx-3 ">
          나와 비슷한 사람들은
          <br />
          어떻게 모으고 있을까?
        </h1>
      </div>
      <div className="flex flex-col w-1/2 items-center justify-center">
        <div className="flex flex-col w-[438px] mx-auto gap-5">
          <div className="flex flex-col gap-3">
            <h1 className="text-black text-[32px] font-semibold">로그인</h1>
            <p className="text-[16px]">
              이메일로 로그인하고, 본인의 투자 행동을 점검해요.
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="pt-5 flex flex-col gap-3">
              <input
                type="text"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="bg-gray-100 p-4 w-full rounded-lg"
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="bg-gray-100 p-4 w-full rounded-lg"
              />
            </div>
            <div className="pt-5 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`py-4 w-full rounded-lg text-white text-[16px] cursor-pointer ${email && password ? 'bg-primary-mint-800' : 'bg-gray-300'}`}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
              <div
                className="py-4 w-full bg-white text-primary-mint-800 border border-primiary-800 rounded-lg text-center text-[16px] cursor-pointer"
                onClick={() => {
                  navigate('/Signup');
                }}
              >
                이메일로 시작하기
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
