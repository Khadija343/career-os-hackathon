import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";

import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import ResumeAnalysis from "../pages/ResumeAnalysis/ResumeAnalysis";
import GitHubAnalysis from "../pages/GitHubAnalysis/GitHubAnalysis";
import Roadmap from "../pages/Roadmap/Roadmap";
import ProgressTracker from "../pages/ProgressTracker/ProgressTracker";
import Interview from "../pages/Interview/Interview";
import Chat from "../pages/Chat/Chat";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";

import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

function ProtectedRoute() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestRoute() {
  const location = useLocation();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token && location.pathname !== "/signup" ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />

        {/* Guest-only Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume" element={<ResumeAnalysis />} />
            <Route path="/github" element={<GitHubAnalysis />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/progress" element={<ProgressTracker />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 Not Found (final catch-all route) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;