import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useAuthStore from './stores/useAuthStore';
import { useEffect } from 'react';

import LoginPage from '../src/pages/LoginPage';
import SignupPage from '../src/pages/SingupPage';

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
