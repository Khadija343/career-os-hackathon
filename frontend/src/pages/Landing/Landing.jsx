import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import Logo from "../../components/common/Logo";
import Button from "../../components/ui/Button";

function Landing() {
  const highlights = [
    { title: "Resume Intelligence", description: "Get actionable insights tailored to your target role." },
    { title: "GitHub Visibility", description: "Turn your contributions into story-driven career proof." },
    { title: "Career Roadmaps", description: "Follow a guided path to reach the next milestone." },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_24%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] px-6 py-10 text-slate-100 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="flex items-center justify-between rounded-full border border-slate-800/80 bg-slate-900/70 px-5 py-3 shadow-lg shadow-slate-950/20 backdrop-blur">
          <Logo />
          <Link to="/login">
            <Button text="Open Dashboard" className="rounded-full px-4 py-2" />
          </Link>
        </header>

        <section className="grid items-center gap-8 rounded-[2rem] border border-slate-800/70 bg-slate-900/60 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
              <Sparkles size={16} />
              AI-powered career growth platform
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Build your next career chapter with clarity.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-400">
              CareerOS unifies your resume, GitHub profile, progress, and roadmap so you can move from ambition to momentum.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup">
                <Button text="Create Account" className="rounded-full px-6 py-3" />
              </Link>
              <Link to="/login">
                <button className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white">
                  Sign in
                </button>
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950/70 p-6 shadow-inner shadow-blue-950/20">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300">
              <ShieldCheck size={20} />
              <span className="font-medium">Your growth dashboard is ready</span>
            </div>
            <div className="mt-6 space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2 text-blue-300">
                    <TrendingUp size={16} />
                    <h2 className="font-semibold text-white">{item.title}</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Inspired by real-world career progress
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Landing;