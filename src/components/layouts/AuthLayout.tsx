import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="bg-system-background min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
