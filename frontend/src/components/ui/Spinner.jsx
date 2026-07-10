function Spinner({ size = "h-8 w-8", color = "border-blue-500" }) {
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-4 border-slate-700 border-t-transparent ${size} ${color}`}></div>
    </div>
  );
}

export default Spinner;