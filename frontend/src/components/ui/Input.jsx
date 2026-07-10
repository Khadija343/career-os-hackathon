function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white rounded-xl px-4 py-3 outline-none transition duration-200 placeholder-slate-500 ${className}`}
      {...props}
    />
  );
}

export default Input;