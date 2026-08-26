import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authAPI';
import useAuthStore from '../stores/useAuthStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

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
      setAuth(data.accessToken, data.refreshToken, '');

      navigate('/');
    } catch (error) {
      alert('로그인에 실패하였습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
