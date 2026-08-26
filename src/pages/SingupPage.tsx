import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/authAPI';

const SingupPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !password || !email || isLoading) return;

    try {
      setIsLoading(true);
      await signup({ name, email, password });

      alert('회원가입이 완료되었습니다! 로그인 후 이용해주세요.');
      navigate('/login');
    } catch (error) {
      alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '가입 진행 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default SingupPage;
