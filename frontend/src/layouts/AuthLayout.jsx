import { Outlet } from "react-router-dom";
import Logo from "../components/common/Logo";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="mb-8 scale-110">
        <Logo />
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;