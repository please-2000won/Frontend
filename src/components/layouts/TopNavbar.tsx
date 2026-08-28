import useAuthStore from '../../stores/useAuthStore';

const TopNavbar = () => {
  const name = useAuthStore((state) => state.name);

  return (
    <nav className="fixed top-0 left-0 z-10 h-[80px] w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-full max-w-[1080px] items-center justify-end px-5">
        {name && (
          <p className="text-[24px] tracking-[-1.2px] text-black">
            <span className="font-semibold">{name}</span>
            <span className="font-medium"> 님</span>
          </p>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
