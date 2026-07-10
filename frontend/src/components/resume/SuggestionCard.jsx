import { Lightbulb, ArrowRight } from "lucide-react";

function SuggestionCard({ suggestion }) {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-2xl p-5 shadow-md hover:shadow-lg transition duration-300 mt-4">

      <div className="flex justify-between items-start">

        <div className="flex gap-3">

          <div className="bg-yellow-400 p-3 rounded-full">
            <Lightbulb className="text-white" size={24} />
          </div>

          <div>
            <h3 className="font-bold text-lg">
              AI Suggestion
            </h3>

            <p className="text-gray-700 mt-2">
              {suggestion}
            </p>

            <span className="inline-block mt-3 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
              High Priority
            </span>
          </div>

        </div>

        <ArrowRight className="text-gray-500" />
      </div>

    </div>
  );
}

export default SuggestionCard;