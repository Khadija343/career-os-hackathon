import api from "./axios";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const register = async ({ fullName, email, password, careerGoal }) => {
  try {
    const response = await api.post("/auth/register", {
      fullName,
      email,
      password,
      ...(careerGoal ? { careerGoal } : {}),
    });
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

// Fetches the logged-in user's profile. The Authorization header (JWT from
// localStorage) is attached automatically by the Axios request interceptor.
export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    console.error("Get Profile Error:", error);
    throw error;
  }
};

// Updates the logged-in user's profile. Only fullName, careerGoal, and
// avatar are accepted by the backend (see auth.service.js#updateProfile).
export const updateProfile = async (payload) => {
  try {
    const response = await api.put("/auth/profile", payload);
    return response.data;
  } catch (error) {
    console.error("Update Profile Error:", error);
    throw error;
  }
};
