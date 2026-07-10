import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  GitBranch,
  Map,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  Settings as SettingsIcon,
} from "lucide-react";
import Logo from "../components/common/Logo";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Profile", path: "/profile", icon: <User size={20} /> },
  { name: "Resume Analysis", path: "/resume", icon: <FileText size={20} /> },
  { name: "GitHub Analysis", path: "/github", icon: <GitBranch size={20} /> },
  { name: "Roadmap", path: "/roadmap", icon: <Map size={20} /> },
  { name: "Progress Tracker", path: "/progress", icon: <TrendingUp size={20} /> },
  { name: "Interview Prep", path: "/interview", icon: <BrainCircuit size={20} /> },
  { name: "AI Assistant", path: "/chat", icon: <MessageSquare size={20} /> },
  { name: "Settings", path: "/settings", icon: <SettingsIcon size={20} /> },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full hidden md:flex shrink-0">
      <div className="p-6 border-b border-slate-800">
        <Logo />
      </div>
      <nav className="flex-grow p-4 space-y-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;