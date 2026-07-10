import { Star, GitFork } from "lucide-react";

function RepositoryCard({ name, stars, forks, tech }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <h2 className="text-xl font-bold">{name}</h2>

      <p className="text-gray-500 mt-2">{tech}</p>

      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <Star size={18} />
          {stars}
        </div>

        <div className="flex items-center gap-2">
          <GitFork size={18} />
          {forks}
        </div>
      </div>
    </div>
  );
}

export default RepositoryCard;