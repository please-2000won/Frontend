import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';

import MainPage from '../src/pages/MainPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SingupPage';
import InfoInputPage from './pages/auth/InfoInputPage';
import WithdrawPage from './pages/auth/WithDrawPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/infoInput" element={<InfoInputPage />} />
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
