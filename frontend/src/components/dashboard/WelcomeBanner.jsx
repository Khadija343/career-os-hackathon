import React from 'react';

export default function WelcomeBanner({ name = "User", streakCount = 5 }) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
            <span role="img" aria-label="waving hand" className="animate-bounce origin-bottom [animation-duration:3s]">👋</span> 
            Welcome Back, {name}!
          </h1>
          <p className="mt-3 text-base sm:text-lg text-blue-100 max-w-xl leading-relaxed">
            Track your career progress and achieve your goals with AI.
          </p>
        </div>

        {streakCount > 0 && (
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 w-max self-start md:self-auto transition-transform hover:scale-105 duration-200">
            <span className="text-2xl" role="img" aria-label="fire">🔥</span>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-blue-200">Daily Streak</p>
              <p className="text-lg font-bold">{streakCount} Days Active</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
}