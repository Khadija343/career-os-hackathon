import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  // Reads from the same AuthContext user object populated at login (see
  // AuthContext.jsx#login), instead of re-reading localStorage directly —
  // this keeps Navbar, Dashboard, etc. all reading from one shared source.
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.fullName || "User";

  // Extract initial safely, filtering out empty spaces
  const userInitial = displayName.trim().charAt(0).toUpperCase() || "?";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-900/50 bg-slate-950/75 px-6 py-4 backdrop-blur-md flex items-center justify-between">
      {/* Mobile Logo */}
      <div className="flex items-center gap-4 md:hidden">
        <Logo />
      </div>

      {/* Desktop Brand */}
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold text-slate-200">Career OS Console</h2>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{displayName}</p>
          <p className="text-xs text-slate-400">{displayName}</p>
        </div>

        <Link 
          to="/profile" 
          className="h-10 w-10 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold hover:bg-blue-500/20 hover:text-blue-300 transition duration-200"
          aria-label="View Profile"
        >
          {userInitial}
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="h-10 w-10 rounded-full border border-slate-700/70 flex items-center justify-center text-slate-400 hover:border-red-500/50 hover:text-red-400 transition duration-200"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
