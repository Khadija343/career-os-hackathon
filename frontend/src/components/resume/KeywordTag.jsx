function KeywordTag({ keyword, matched }) {
  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-300 hover:scale-105 ${
        matched
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-gray-100 text-gray-500 border border-gray-300"
      }`}
    >
      {matched ? "✅ " : "❌ "}
      {keyword}
    </span>
  );
}

export default KeywordTag;