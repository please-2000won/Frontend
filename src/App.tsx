import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from '../src/pages/LoginPage';
import SignupPage from '../src/pages/SingupPage';

function App() {
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
