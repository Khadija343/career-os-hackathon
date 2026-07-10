import { Briefcase } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3 font-extrabold text-xl text-blue-500 tracking-wider">
      <div className="flex items-center justify-center h-10 w-10 bg-blue-500/10 border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/5">
        <Briefcase className="h-5 w-5 text-blue-500" />
      </div>
      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        CareerOS
      </span>
    </div>
  );
}

export default Logo;
