import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AdminPage from './pages/AdminPage';

// App.tsx/main.tsx(팀원 코드)를 건드리지 않기 위해 admin.html에서만 쓰는 별도 진입점.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminPage />
  </StrictMode>
);
