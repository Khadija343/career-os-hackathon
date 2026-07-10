function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 transition duration-300 hover:border-slate-600/50 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;