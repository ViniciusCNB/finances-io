import Link from "next/link"


const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-21">
      <div className="mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">Finances.io</h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
