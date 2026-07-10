function InfoCard({ label, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 mb-4 border">
      <h3 className="text-gray-500 text-sm">{label}</h3>

      <p className="text-lg font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default InfoCard;