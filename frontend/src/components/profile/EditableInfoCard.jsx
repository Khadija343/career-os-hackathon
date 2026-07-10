function EditableInfoCard({ label, name, value, onChange, editing, placeholder }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 mb-4 border">
      <h3 className="text-gray-500 text-sm">{label}</h3>

      {editing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-lg font-semibold text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      ) : (
        <p className="text-lg font-semibold text-gray-800">{value || "Not provided"}</p>
      )}
    </div>
  );
}

export default EditableInfoCard;
