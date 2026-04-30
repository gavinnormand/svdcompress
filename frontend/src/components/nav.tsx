const Nav = () => {
  return (
    <nav className="sticky top-0 z-50 bg-[#304674]">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div
          className="flex flex-row items-center gap-4 hover:cursor-pointer"
          onClick={() => window.location.reload()}
        >
          <img src="/logo.svg" className="h-12" />
          <p className="text-4xl font-semibold text-white">SVD Compress</p>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
