import axios from "axios";

// No default Content-Type header is set here on purpose: axios already
// picks the correct one per request based on the payload type (JSON
// object -> "application/json", FormData -> the browser/axios-generated
// "multipart/form-data; boundary=..."). Hardcoding "application/json"
// on the instance used to override that detection and break FormData
// uploads (e.g. resume upload), since it always took precedence over
// the multipart boundary axios/the browser would otherwise set.
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

// 🔐 Request Interceptor (Auto attach token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Response Interceptor (Global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip the forced redirect for the login request itself so a wrong
    // email/password (401) can be shown inline on the Login page instead
    // of hard-navigating away before the error message is rendered.
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;