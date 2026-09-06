import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, getMyInfo } from '../../api/authAPI';
import useAuthStore from '../../stores/useAuthStore';
import { clearAppStorage } from '../../utils/analysisStorage';
import logo from '../../assets/logo/logo.svg';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const clearAuth = useAuthStore((state) => state.clearAuth);
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

      // 이전 사용자의 잔여 토큰, 캐시, 스토리지 완전 초기화
      clearAuth();
      clearAppStorage();

      const data = await login({ email, password });

      //백엔드에서 준 data 내 토큰을 zustand 스토어에 저장
      //리프레쉬 토큰을 아직 구현을 안했으므로 추후
      //setAuth(data.accessToken, data.refreshToken, ''); 로 수정
      setAuth(data.accessToken, '');

      const userInfoData = await getMyInfo();
      setUserInfo(userInfoData);

      navigate('/');
    } catch {
      alert('로그인에 실패하였습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate('/', { replace: true });
    }
  }, [accessToken, navigate]);

  // 토큰이 있을 경우, 찰나의 순간이라도 로그인 폼이 화면에 깜빡이는 것을 방지
  if (accessToken) {
    return null;
  }

  //모션
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <div className="relative flex flex-col w-full lg:w-1/2 min-h-[35vh] lg:min-h-0 bg-gradient-to-br from-primary-mint-300 to-primary-mint-200  justify-center px-8 py-14 lg:pl-16 lg:py-12 gap-8">
        <img
          src={logo}
          alt="peerfolio"
          className="h-[32px] lg:h-[32px] w-auto self-start mb-12 lg:absolute lg:left-16 lg:top-12"
        />
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-col gap-3"
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-[28px] lg:text-[40px] font-semibold leading-tight tracking-[-0.04em] text-primary-mint-900 break-keep"
          >
            나와 비슷한 사람들은
            <br />
            어떻게 모으고 있을까?
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-[15px] lg:text-[16px] font-medium leading-relaxed tracking-[-0.02em] text-primary-mint-900/70 break-keep"
          >
            경제적 여건이 비슷한 Peer Group과 비교해
            <br className="hidden lg:block" />내 투자행동의 위치를 확인해요.
          </motion.p>
        </motion.div>
      </div>
      <div className="flex flex-col w-full lg:w-1/2 items-center justify-center mt-10 lg:my-auto">
        <div className="flex flex-col w-[90%] max-w-[438px] mx-auto gap-5">
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
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading || !email || !password}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => {
                  navigate('/signup');
                }}
              >
                이메일로 시작하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
