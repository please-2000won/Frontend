import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from '../src/pages/MainPage';
import LoginPage from '../src/pages/LoginPage';
import SignupPage from '../src/pages/SingupPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
