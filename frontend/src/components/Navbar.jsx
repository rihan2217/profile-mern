import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.get("/api/logout", { withCredentials: true });
    navigate("/login");
  };

  const links = [
    { to: "/posts",   label: "All Posts" },
    { to: "/read",   label: "All Users" },
    { to: "/CreatePost", label: "Create Post" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-xl font-bold text-green-400">MyApp</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-green-400 transition font-medium"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded-md hover:bg-red-600 transition font-medium"
          >
            Logout
          </button>
        </div>

        {/* Hamburger Button — mobile only */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col px-6 pb-4 gap-4 border-t border-gray-700">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-green-400 transition font-medium py-1"
              onClick={() => setIsOpen(false)} // ✅ close on click
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition font-medium text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;