import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';

const MainLayout = () => {
  return (
    <div className="bg-system-background min-h-screen flex flex-col">
      <TopNavbar />
      <main className="flex-1 pt-[60px]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
