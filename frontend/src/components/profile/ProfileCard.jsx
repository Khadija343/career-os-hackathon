function ProfileCard({ name, role, image,location }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
      <img
        src={image}
        alt={name}
        className="w-28 h-28 rounded-full mx-auto mb-4"
      />

      <h2 className="text-2xl font-bold">
        {name}
      </h2>

      <p className="text-gray-500">
        {role}
      </p>

      <p className="text-gray-500">
        📍 {location}
      </p>
    </div>
  );
}

export default ProfileCard;