import { useState, useEffect } from 'react';
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

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [authCodeError, setAuthCodeError] = useState('');
  const [pwLengthError, setPwLengthError] = useState('');
  const [pwFormatError, setPwFormatError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  //이름 형식
  useEffect(() => {
    if (name.length > 0 && (name.length < 2 || name.length > 50)) {
      setNameError('· 2자 이상, 50자 이하로 작성해주세요.');
    } else setNameError('');
  }, [name]);

  //이메일 형식
  useEffect(() => {
    if (email.length > 0) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) {
        setEmailError('· 올바른 이메일 형식을 입력해주세요.');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
  }, [email]);

  //인증번호 형식 -> API 연동 필요
  useEffect(() => {}, [authCode]);

  //비밀번호 형식
  useEffect(() => {
    if (password.length > 0) {
      //길이검사
      if (password.length < 8 || password.length > 20) {
        setPwLengthError('· 8자 이상 20자 이하로 작성해주세요.');
      } else {
        setPwLengthError('');
      }

      //형식 검사
      //영문포함
      const hasEng = /[a-zA-Z]/.test(password);
      //숫자 포함
      const hasNum = /[0-9]/.test(password);
      //특수문자 포함
      const hasSpec = /[!@#$%^&*?_]/.test(password);
      //부족한 문자를 담음
      const missing = [];
      if (!hasEng) missing.push('영문');
      if (!hasNum) missing.push('숫자');
      if (!hasSpec) missing.push('특수문자');

      if (missing.length > 0) {
        //마지막 글자가 영문이면 조사를 '을'로, 아니면 '를' 처리
        const josa = missing[missing.length - 1] === '영문' ? '을' : '를';
        setPwFormatError(`· ${missing.join(', ')}${josa} 입력해주세요.`);
      } else {
        setPwFormatError('');
      }
    } else {
      setPwFormatError('');
      setPwLengthError('');
    }
  }, [password]);

  //확인 비밀번호 형식
  useEffect(() => {
    if (password.length > 0 && password !== passwordConfirm) {
      //입력된 문자가 있다면 일치 여부에 맞춤
      setConfirmError('· 비밀번호가 일치하지 않아요.');
    } else {
      setConfirmError('');
    }
  }, [password, passwordConfirm]);

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
  //버튼 활성화
  const isFormValid =
    !nameError &&
    !emailError &&
    !authCodeError &&
    !pwLengthError &&
    !pwFormatError &&
    !confirmError;

  return (
    <div className="w-[530px] h-full items-center justify-center mt-40 mx-auto">
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
              autoComplete="name"
              className="bg-gray-100 p-4 w-full rounded-lg"
            />
            {nameError && (
              <span className="text-[13px] text-system-red">{nameError} </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p>이메일</p>
            <div className="flex gap-7 justify-between">
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="new-email"
                className="bg-gray-100 p-4 rounded-lg w-full"
              />
              <button className="w-[163px] py-4 px-4 bg-primary-mint-800 rounded-lg text-white text-[16px] font-semibold cursor-pointer">
                인증코드 발송
              </button>
            </div>
            {emailError && (
              <span className="text-[13px] text-system-red">{emailError}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p>인증코드</p>
            <input
              type="text"
              placeholder="6자리 입력"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              autoComplete="authCode"
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
              autoComplete="new-password"
              className="bg-gray-100 p-4 w-full rounded-lg"
            />
            <span className="text-gray-200 text-[13px]">
              · 영문/숫자/특수문자를 각각 1개 이상 포함해야 해요.
            </span>
            {pwFormatError && (
              <span className="text-[13px] text-system-red">
                {pwFormatError}
              </span>
            )}
            {pwLengthError && (
              <span className="text-[13px] text-system-red">
                {pwLengthError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p>비밀번호 확인</p>
            <input
              type="password"
              placeholder="8자 이상 20자 이하"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-confrimPassword"
              className="bg-gray-100 p-4 w-full rounded-lg"
            />
            <span className="text-gray-200 text-[13px]">
              · 영문/숫자/특수문자를 각각 1개 이상 포함해야 해요.
            </span>
            {confirmError && (
              <span className="text-[13px] text-system-red">
                {confirmError}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading && isFormValid}
            className={`${isFormValid ? 'bg-gray-300' : 'bg-primary-mint-800'} px-20 py-4 text-[16px] font-semibold text-white rounded-lg cursor-pointer`}
          >
            {isLoading ? '가입 진행 중...' : '가입하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingupPage;
