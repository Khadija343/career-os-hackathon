import { useEffect, useState } from "react";

import ProfileCard from "../../components/profile/ProfileCard";
import InfoCard from "../../components/profile/InfoCard";
import EditableInfoCard from "../../components/profile/EditableInfoCard";
import SectionTitle from "../../components/profile/SectionTitle";
import UploadResume from "../../components/profile/UploadResume";
import Loader from "../../components/common/Loader";
import { getProfile, updateProfile } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

// Maps backend/network failures to a single user-facing message.
function getProfileErrorMessage(err) {
  if (!err?.response) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  const { status, data } = err.response;

  if (status === 400 && Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((issue) => issue.message).join(" ");
  }

  if (status === 401) {
    return data?.message || "Your session has expired. Please log in again.";
  }

  if (status >= 500) {
    return "Something went wrong on our end. Please try again later.";
  }

  return data?.message || "Something went wrong. Please try again.";
}

function Profile() {
  const { user: authUser, token, login: setAuthenticatedUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({ fullName: "", careerGoal: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getProfile();
      const data = result?.data;
      setProfile(data);
      setFormValues({
        fullName: data?.fullName || "",
        careerGoal: data?.careerGoal || "",
      });
    } catch (err) {
      setError(getProfileErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditToggle = () => {
    setSaveError("");
    setSaveSuccess("");
    setFormValues({
      fullName: profile?.fullName || "",
      careerGoal: profile?.careerGoal || "",
    });
    setIsEditing((prev) => !prev);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess("");

    const fullName = formValues.fullName.trim();

    if (!fullName) {
      setSaveError("Full name is required.");
      return;
    }

    if (fullName.length < 3) {
      setSaveError("Full name must be at least 3 characters.");
      return;
    }

    setSaving(true);

    try {
      const result = await updateProfile({
        fullName,
        careerGoal: formValues.careerGoal.trim(),
      });
      const updated = result?.data;

      setProfile(updated);
      // Keep the authenticated user in context/localStorage (e.g. navbar) in sync.
      setAuthenticatedUser({ ...authUser, ...updated }, token);
      setIsEditing(false);
      setSaveSuccess("Profile updated successfully.");
    } catch (err) {
      setSaveError(getProfileErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Loader />
        <p className="text-center text-gray-500 text-sm">Loading your profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <ProfileCard
        name={profile?.fullName}
        role={profile?.careerGoal || "Career OS Member"}
        image={profile?.avatar || "https://i.pravatar.cc/150"}
        location="Not specified"
      />

      <div className="mt-8 flex items-center justify-between">
        <SectionTitle title="Personal Information" />
        {!isEditing && (
          <button
            onClick={handleEditToggle}
            className="text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg px-4 py-2 hover:bg-blue-50 transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && profile ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      ) : null}

      {saveSuccess ? (
        <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{saveSuccess}</p>
      ) : null}

      <form onSubmit={handleSave}>
        {saveError ? (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{saveError}</p>
        ) : null}

        <EditableInfoCard
          label="Full Name"
          name="fullName"
          value={isEditing ? formValues.fullName : profile?.fullName}
          onChange={handleFieldChange}
          editing={isEditing}
          placeholder="Your full name"
        />

        <InfoCard label="Email" value={profile?.email} />

        <EditableInfoCard
          label="Career Goal"
          name="careerGoal"
          value={isEditing ? formValues.careerGoal : profile?.careerGoal}
          onChange={handleFieldChange}
          editing={isEditing}
          placeholder="e.g. Become a Full Stack AI Engineer"
        />

        <InfoCard label="Phone" value="Not provided" />
        <InfoCard label="Skills" value="Not provided" />
        <InfoCard label="Education" value="Not provided" />

        {isEditing && (
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              disabled={saving}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <div className="mt-8">
        <UploadResume />
      </div>
    </div>
  );
}

export default Profile;
