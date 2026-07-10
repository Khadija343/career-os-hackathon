function AchievementCard({ title }) {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-5 shadow-lg">

      <h2 className="text-lg font-bold">
        🏆 {title}
      </h2>

    </div>
  );
}

export default AchievementCard;