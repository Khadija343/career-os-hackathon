import { useNavigate, Link } from "react-router-dom";
import { Compass, ArrowLeft, LayoutDashboard } from "lucide-react";

import Logo from "../../components/common/Logo";
import Button from "../../components/ui/Button";

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] px-6 py-10 text-slate-100 lg:px-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex items-center justify-center rounded-full border border-slate-800/80 bg-slate-900/70 px-5 py-3 shadow-lg shadow-slate-950/20 backdrop-blur">
          <Logo />
        </header>

        <section className="flex flex-col items-center gap-6 rounded-[2rem] border border-slate-800/70 bg-slate-900/60 p-10 text-center shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:p-14">
          {/* Simple Illustration Placeholder */}
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 shadow-inner shadow-blue-950/20">
            <Compass size={52} className="text-blue-400" />
          </div>

          <div>
            <p className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent sm:text-7xl">
              404
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Page not found
            </h1>
            <p className="mt-3 max-w-md text-slate-400">
              The page you're looking for doesn't exist or may have been moved. Let's get you
              back on track.
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleGoBack}
              className="flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>

            <Link to="/dashboard">
              <Button
                className="flex items-center gap-2 rounded-full px-6 py-3"
                text={
                  <span className="flex items-center gap-2">
                    <LayoutDashboard size={18} />
                    Go to Dashboard
                  </span>
                }
              />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NotFound;
