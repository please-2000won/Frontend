import { useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import {
  requestEmailCode,
  adminSignup,
  adminLogin,
  type EmailCodeResponse,
  type SignupResponse,
} from '../api/adminAuthAPI';
import { callAdminApi, type AdminApiResult, type AdminHttpMethod } from '../api/adminClient';
import useAuthStore from '../stores/useAuthStore';

const REQUEST_PRESETS: {
  label: string;
  method: AdminHttpMethod;
  path: string;
  body: string;
}[] = [
  { label: '내 정보 조회', method: 'GET', path: '/api/v1/users/me', body: '' },
  { label: '금융 정보 조회', method: 'GET', path: '/api/v1/financial-info', body: '' },
  {
    label: '금융 정보 저장',
    method: 'PUT',
    path: '/api/v1/financial-info',
    body: JSON.stringify(
      {
        financialProfile: {
          age: 24,
          monthlyIncome: 3000000,
          fixedExpense: 1000000,
          savingsGoal: 500000,
          totalAssetAmount: 5000000,
          totalDebtAmount: 1000000,
        },
        financialAsset: {
          depositBondAmount: 1000000,
          domesticStockAmount: 1000000,
          foreignStockAmount: 1000000,
          alternativeAmount: 1000000,
        },
      },
      null,
      2
    ),
  },
];

const HTTP_METHODS: AdminHttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const inputClassName = 'bg-gray-100 p-3 rounded-lg w-full';
const sectionClassName = 'flex flex-col gap-4 rounded-lg border border-gray-100 p-6';
const primaryButtonClassName =
  'bg-primary-mint-800 px-6 py-3 text-white font-semibold rounded-lg disabled:opacity-50';

const AdminPage = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // 0. 이메일 인증
  const [codeEmail, setCodeEmail] = useState('');
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeResult, setCodeResult] = useState<EmailCodeResponse | null>(null);

  // 1. 회원가입
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupResult, setSignupResult] = useState<SignupResponse | null>(null);

  // 2. 로그인
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // 3. API 호출
  const [method, setMethod] = useState<AdminHttpMethod>('GET');
  const [path, setPath] = useState('/api/v1/users/me');
  const [body, setBody] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [result, setResult] = useState<AdminApiResult | null>(null);

  const handleRequestCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!codeEmail || isRequestingCode) return;

    try {
      setIsRequestingCode(true);
      setCodeError('');
      setCodeResult(null);

      const data = await requestEmailCode({ email: codeEmail });
      setCodeResult(data);

      // 다음 단계 입력값 자동 채우기 (로컬 개발 환경이면 인증번호까지)
      setSignupEmail(codeEmail);
      setLoginEmail(codeEmail);
      if (data.verificationCode) {
        setSignupCode(data.verificationCode);
      }
    } catch {
      setCodeError('인증번호 발급에 실패했습니다.');
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupCode || !signupPassword || isSigningUp) return;

    try {
      setIsSigningUp(true);
      setSignupError('');
      setSignupResult(null);

      const data = await adminSignup({
        name: signupName,
        email: signupEmail,
        verificationCode: signupCode,
        password: signupPassword,
      });
      setSignupResult(data);

      // 다음 단계(로그인) 입력값 자동 채우기
      setLoginEmail(signupEmail);
      setLoginPassword(signupPassword);
    } catch (error) {
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string } | undefined)?.message ??
          '회원가입에 실패했습니다.')
        : '회원가입에 실패했습니다.';
      setSignupError(message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword || isLoggingIn) return;

    try {
      setIsLoggingIn(true);
      setLoginError('');
      const data = await adminLogin({ email: loginEmail, password: loginPassword });
      setAuth(data.accessToken, '', '');
    } catch {
      setLoginError('로그인에 실패했습니다. 이메일/비밀번호를 확인해주세요.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const applyPreset = (preset: (typeof REQUEST_PRESETS)[number]) => {
    setMethod(preset.method);
    setPath(preset.path);
    setBody(preset.body);
    setResult(null);
    setRequestError('');
  };

  const handleRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (isRequesting) return;

    try {
      setIsRequesting(true);
      setRequestError('');
      setResult(null);

      const parsedBody = body.trim() ? JSON.parse(body) : undefined;
      const response = await callAdminApi(method, path, parsedBody);
      setResult(response);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setRequestError('요청 본문이 올바른 JSON 형식이 아닙니다.');
      } else if (isAxiosError(error)) {
        setResult({ status: error.response?.status ?? 0, data: error.response?.data });
      } else {
        setRequestError('요청 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 px-5 py-10">
      <div>
        <h1 className="text-[24px] font-bold">Admin API 테스트 페이지</h1>
        <p className="text-gray-700 text-[14px]">
          회원가입부터 로그인, API 호출까지 이어서 테스트할 수 있는 임시 페이지입니다.
        </p>
      </div>

      <section className={sectionClassName}>
        <h2 className="text-[18px] font-semibold">1. 이메일 인증번호 발급</h2>
        <form onSubmit={handleRequestCode} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="이메일"
            value={codeEmail}
            onChange={(e) => setCodeEmail(e.target.value)}
            className={inputClassName}
          />
          <button type="submit" disabled={isRequestingCode} className={primaryButtonClassName}>
            {isRequestingCode ? '발급 중...' : '인증번호 발급'}
          </button>
          {codeError && <p className="text-system-red text-[13px]">{codeError}</p>}
        </form>

        {codeResult && (
          <div className="flex flex-col gap-1 rounded-lg bg-gray-100 p-3 text-[13px]">
            <p>대상 이메일: {codeResult.email}</p>
            <p>만료 시각: {codeResult.expiresAt}</p>
            <p>
              인증번호:{' '}
              {codeResult.verificationCode ?? '(운영 환경이라 응답에 포함되지 않음, 메일함 확인)'}
            </p>
          </div>
        )}
      </section>

      <section className={sectionClassName}>
        <h2 className="text-[18px] font-semibold">2. 회원가입</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="이름 (2~50자)"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            className={inputClassName}
          />
          <input
            type="email"
            placeholder="이메일"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className={inputClassName}
          />
          <input
            type="text"
            placeholder="인증번호 6자리"
            value={signupCode}
            onChange={(e) => setSignupCode(e.target.value)}
            className={inputClassName}
          />
          <input
            type="password"
            placeholder="비밀번호 (영문/숫자/특수문자 포함 8~20자)"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className={inputClassName}
          />
          <button type="submit" disabled={isSigningUp} className={primaryButtonClassName}>
            {isSigningUp ? '가입 중...' : '회원가입'}
          </button>
          {signupError && <p className="text-system-red text-[13px]">{signupError}</p>}
        </form>

        {signupResult && (
          <div className="flex flex-col gap-1 rounded-lg bg-gray-100 p-3 text-[13px]">
            <p>userId: {signupResult.userId}</p>
            <p>name: {signupResult.name}</p>
            <p>email: {signupResult.email}</p>
            <p>nickname (자동 생성): {signupResult.nickname}</p>
          </div>
        )}
      </section>

      <section className={sectionClassName}>
        <h2 className="text-[18px] font-semibold">3. 로그인</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="이메일"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className={inputClassName}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className={inputClassName}
          />
          <button type="submit" disabled={isLoggingIn} className={primaryButtonClassName}>
            {isLoggingIn ? '로그인 중...' : '로그인'}
          </button>
          {loginError && <p className="text-system-red text-[13px]">{loginError}</p>}
        </form>

        <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-3 text-[13px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-700">accessToken</span>
            {accessToken && (
              <button
                type="button"
                onClick={() => clearAuth()}
                className="text-system-red underline shrink-0"
              >
                로그아웃
              </button>
            )}
          </div>
          <p className="break-all font-mono">{accessToken || '(로그인 필요)'}</p>
        </div>
      </section>

      <section className={sectionClassName}>
        <h2 className="text-[18px] font-semibold">4. API 호출</h2>

        <div className="flex flex-wrap gap-2">
          {REQUEST_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-full border border-primary-mint-900 px-4 py-1.5 text-[13px] text-primary-mint-900"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleRequest} className="flex flex-col gap-3">
          <div className="flex gap-3">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as AdminHttpMethod)}
              className="bg-gray-100 p-3 rounded-lg font-semibold"
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="/api/v1/..."
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="bg-gray-100 p-3 rounded-lg w-full font-mono"
            />
          </div>
          <textarea
            placeholder="요청 본문 (JSON, GET일 경우 비워두세요)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="bg-gray-100 p-3 rounded-lg w-full font-mono text-[13px]"
          />
          <button type="submit" disabled={isRequesting} className={primaryButtonClassName}>
            {isRequesting ? '요청 중...' : '요청 보내기'}
          </button>
          {requestError && <p className="text-system-red text-[13px]">{requestError}</p>}
        </form>

        {result && (
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold">
              응답 상태:{' '}
              <span className={result.status < 400 ? 'text-primary-mint-800' : 'text-system-red'}>
                {result.status}
              </span>
            </p>
            <pre className="max-h-[400px] overflow-auto rounded-lg bg-gray-800 p-4 text-[12px] text-white">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
