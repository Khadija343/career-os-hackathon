function ActivityCard({ activity, date }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4">

      <h3 className="font-semibold">
        {activity}
      </h3>

      <p className="text-gray-500 mt-1">
        {date}
      </p>

    </div>
  );
}

export default ActivityCard;