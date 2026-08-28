import useAuthStore from '../../stores/useAuthStore';

const TopNavbar = () => {
  const name = useAuthStore((state) => state.name);

  return (
    <nav className="fixed top-0 left-0 z-10 flex h-[80px] w-full items-center justify-end border-b border-gray-100 bg-white px-10">
      {name && (
        <p className="text-[24px] tracking-[-1.2px] text-black">
          <span className="font-semibold">{name}</span>
          <span className="font-medium"> 님</span>
        </p>
      )}
    </nav>
  );
};

export default TopNavbar;
