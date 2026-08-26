import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/authAPI';

const SingupPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !authCode ||
      !password ||
      !passwordConfirm ||
      isLoading
    )
      return;

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
    <div className="w-[530px] h-full items-center justify-center pt-40 mx-auto">
      <div className="text-black text-left font-semibold text-[32px] pb-7">
        <h1>회원가입</h1>
      </div>
      <div className="flex flex-col">
        <form onSubmit={handleSignup} className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <p>이름</p>
            <input
              type="text"
              placeholder="2자 이상 50자 이하"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-100 p-4 w-full rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p>이메일</p>
            <div className="flex gap-7 justify-between">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 p-4 rounded-lg w-full"
              />
              <button className="w-[163px] py-4 px-4 bg-primary-mint-800 rounded-lg text-white text-[16px] font-semibold">
                인증코드 발송
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p>인증코드</p>
            <input
              type="number"
              placeholder="6자리 입력"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="bg-gray-100 p-4 w-full rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p>비밀번호</p>
            <input
              type="password"
              placeholder="8자 이상 20자 이하"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-100 p-4 w-full rounded-lg"
            />
            <span className="text-gray-200 text-[13px]">
              · 영문/숫자/특수문자를 각각 1개 이상 포함해야 해요.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <p>비밀번호 확인</p>
            <input
              type="password"
              placeholder="8자 이상 20자 이하"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="bg-gray-100 p-4 w-full rounded-lg"
            />
            <span className="text-gray-200 text-[13px]">
              · 영문/숫자/특수문자를 각각 1개 이상 포함해야 해요.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gray-300 px-20 py-4 text-[16px] font-semibold text-white rounded-lg"
          >
            {isLoading ? '가입 진행 중...' : '가입하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingupPage;
