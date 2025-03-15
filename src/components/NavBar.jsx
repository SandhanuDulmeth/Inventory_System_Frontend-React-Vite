import Profile from "./Profile";
import ThemeController from "./ThemeController";

export default function NavBar() {
  return (
    <nav className="w-full bg-base-100 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-12 items-center h-16 gap-4">
          {/* Left Side - Logo */}
          <div className="col-span-2 flex-shrink-0">
            <img 
              src="/R.png" 
              alt="Apple Logo" 
              className="h-8 w-auto"
            />
          </div>

          {/* Menu Selection Space */}
          <div className="col-span-2">
            {/* Add your menu selection component here */}
          </div>

          {/* Middle - Search Bar */}
          <div className="col-span-5">
            <div className="relative flex items-center">
              <div className="hidden sm:flex w-full items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 dark:ring-gray-600 px-2">
                <img 
                  src="/search.png" 
                  alt="search" 
                  className="w-[14px] h-[14px] dark:invert"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full p-2 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Theme & Profile */}
          <div className="col-span-3 flex items-center justify-end space-x-4">
            <ThemeController />
            <Profile />
          </div>
        </div>
      </div>
    </nav>
  );
}

