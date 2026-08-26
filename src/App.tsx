import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';

import MainPage from '../src/pages/MainPage';
import LoginPage from '../src/pages/LoginPage';
import SignupPage from '../src/pages/SingupPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
