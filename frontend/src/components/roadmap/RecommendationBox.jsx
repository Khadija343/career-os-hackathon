function RecommendationBox({ recommendation }) {
  return (
    <div className="bg-slate-800 border-l-4 border-yellow-400 p-5 rounded-xl mb-4">
      <p className="font-medium text-slate-100">
        💡 {recommendation}
      </p>
    </div>
  );
}

export default RecommendationBox;