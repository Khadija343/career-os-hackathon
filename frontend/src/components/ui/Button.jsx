function Button({
  text,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-98 transition duration-200 cursor-pointer disabled:cursor-not-allowed ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;