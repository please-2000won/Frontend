import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';
import ChatLayout from './components/layouts/ChatLayout';

import MainPage from '../src/pages/MainPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SingupPage';
import InfoInputPage from './pages/InfoInputPage';
import ChatbotPage from './pages/ChatbotPage';
import WithdrawPage from './pages/auth/WithDrawPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ChatLayout />}>
          <Route path="/" element={<MainPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/infoInput" element={<InfoInputPage />} />
          {/* 챗봇 경로 확정 전까지 쓰는 임시 라우트 */}
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
