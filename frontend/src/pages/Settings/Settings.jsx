import { useState } from "react";
import {
  UserCog,
  Palette,
  Bell,
  ShieldCheck,
  KeyRound,
  Settings2,
  Copy,
  RefreshCw,
  LogOut,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Toast from "../../components/ui/Toast";
import SettingsSection from "../../components/settings/SettingsSection";
import SettingRow from "../../components/settings/SettingRow";
import ToggleSwitch from "../../components/settings/ToggleSwitch";

const COMING_SOON_BADGE = (
  <Badge text="Coming Soon" color="bg-slate-500/10 text-slate-400 border border-slate-500/20" />
);

const FieldLabel = ({ children }) => (
  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
    {children}
  </label>
);

const maskApiKey = (key) => `${key.slice(0, 8)}${"•".repeat(20)}${key.slice(-4)}`;

const generateApiKey = () =>
  `cos_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`.slice(
    0,
    40
  );

function Settings() {
  // TODO: Replace all local state below with real data fetched from the
  // backend (e.g. via a future settingsService.js) once settings endpoints
  // are available. All Save/Update actions below are placeholders and only
  // update local component state.

  const [toast, setToast] = useState(null);

  const [profile, setProfile] = useState({
    displayName: "Muntaha Mano",
    careerGoal: "Become a Full Stack AI Engineer",
    location: "Pakistan",
  });

  const [theme, setTheme] = useState("dark");

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushAlerts: false,
    weeklySummary: true,
    productUpdates: false,
  });

  const [account, setAccount] = useState({
    email: "muntaha@gmail.com",
    username: "muntaha.mano",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [apiKey, setApiKey] = useState(generateApiKey());
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  const notify = (message, type = "success") => setToast({ message, type });

  const handleProfileChange = (field) => (e) =>
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAccountChange = (field) => (e) =>
    setAccount((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePasswordChange = (field) => (e) =>
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleNotification = (key) => (value) =>
    setNotifications((prev) => ({ ...prev, [key]: value }));

  // TODO: POST /settings/profile
  const handleSaveProfile = () => notify("Profile preferences saved.");

  // TODO: PATCH /settings/notifications
  const handleSaveNotifications = () => notify("Notification preferences updated.");

  // TODO: PATCH /settings/account
  const handleSaveAccount = () => notify("Account details updated.");

  // TODO: POST /settings/security/change-password
  const handleChangePassword = () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      notify("Please fill in all password fields.", "error");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      notify("New password and confirmation do not match.", "error");
      return;
    }
    setPasswords({ current: "", next: "", confirm: "" });
    notify("Password updated successfully.");
  };

  // TODO: POST /settings/security/logout-all-devices
  const handleLogoutAllDevices = () => notify("Logged out of all other devices.");

  // TODO: POST /settings/api-key/regenerate
  const handleRegenerateApiKey = () => {
    setApiKey(generateApiKey());
    setApiKeyVisible(true);
    notify("A new API key has been generated.");
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      notify("API key copied to clipboard.");
    } catch {
      notify("Couldn't copy the API key. Please copy it manually.", "error");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
          Configuration
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Manage your profile preferences, notifications, account, security, and API access in
          one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Profile Preferences */}
        <SettingsSection
          icon={<UserCog size={20} />}
          title="Profile Preferences"
          description="Personalize how your profile appears across Career OS."
        >
          <div>
            <FieldLabel>Display Name</FieldLabel>
            <Input
              value={profile.displayName}
              onChange={handleProfileChange("displayName")}
              placeholder="Your display name"
            />
          </div>
          <div>
            <FieldLabel>Career Goal</FieldLabel>
            <Input
              value={profile.careerGoal}
              onChange={handleProfileChange("careerGoal")}
              placeholder="e.g. Become a Full Stack AI Engineer"
            />
          </div>
          <div>
            <FieldLabel>Location</FieldLabel>
            <Input
              value={profile.location}
              onChange={handleProfileChange("location")}
              placeholder="City, Country"
            />
          </div>
          <div className="flex justify-end pt-1">
            <Button text="Save Changes" onClick={handleSaveProfile} />
          </div>
        </SettingsSection>

        {/* Theme Placeholder */}
        <SettingsSection
          icon={<Palette size={20} />}
          title="Theme"
          description="Choose how Career OS looks on your devices."
          badge={COMING_SOON_BADGE}
        >
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-xl border px-4 py-3 text-left transition duration-200 cursor-pointer ${
                theme === "dark"
                  ? "border-blue-500/50 bg-blue-500/10 text-white"
                  : "border-slate-800/70 bg-slate-950/40 text-slate-300 hover:border-slate-700"
              }`}
            >
              <p className="text-sm font-semibold">Dark</p>
              <p className="mt-0.5 text-xs text-slate-500">Current default theme</p>
            </button>
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-left opacity-50"
            >
              <p className="text-sm font-semibold text-slate-300">Light</p>
              <p className="mt-0.5 text-xs text-slate-500">Not available yet</p>
            </button>
          </div>
        </SettingsSection>

        {/* Notification Preferences */}
        <SettingsSection
          icon={<Bell size={20} />}
          title="Notification Preferences"
          description="Choose what updates you want to hear about."
        >
          <SettingRow
            title="Email Alerts"
            description="Important updates about your account and analyses."
            control={
              <ToggleSwitch
                checked={notifications.emailAlerts}
                onChange={toggleNotification("emailAlerts")}
                label="Email Alerts"
              />
            }
          />
          <SettingRow
            title="Push Notifications"
            description="Real-time alerts in your browser."
            control={
              <ToggleSwitch
                checked={notifications.pushAlerts}
                onChange={toggleNotification("pushAlerts")}
                label="Push Notifications"
              />
            }
          />
          <SettingRow
            title="Weekly Progress Summary"
            description="A recap of your roadmap and activity every week."
            control={
              <ToggleSwitch
                checked={notifications.weeklySummary}
                onChange={toggleNotification("weeklySummary")}
                label="Weekly Progress Summary"
              />
            }
          />
          <SettingRow
            title="Product Updates"
            description="News about new Career OS features."
            control={
              <ToggleSwitch
                checked={notifications.productUpdates}
                onChange={toggleNotification("productUpdates")}
                label="Product Updates"
              />
            }
          />
          <div className="flex justify-end pt-1">
            <Button text="Save Preferences" onClick={handleSaveNotifications} />
          </div>
        </SettingsSection>

        {/* Account Settings */}
        <SettingsSection
          icon={<Settings2 size={20} />}
          title="Account Settings"
          description="Update your account identity and manage its lifecycle."
        >
          <div>
            <FieldLabel>Email Address</FieldLabel>
            <Input
              type="email"
              value={account.email}
              onChange={handleAccountChange("email")}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <FieldLabel>Username</FieldLabel>
            <Input
              value={account.username}
              onChange={handleAccountChange("username")}
              placeholder="username"
            />
          </div>
          <div className="flex justify-end pt-1">
            <Button text="Update Account" onClick={handleSaveAccount} />
          </div>

          <div className="mt-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-semibold text-red-400">Danger Zone</p>
            <p className="mt-1 text-xs text-slate-500">
              Deactivating or deleting your account cannot be easily undone.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => notify("Account deactivation requested.", "error")}
                className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition duration-200 hover:bg-red-500/10 cursor-pointer"
              >
                Deactivate Account
              </button>
              <button
                type="button"
                onClick={() => notify("Account deletion requested.", "error")}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-red-700 cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection
          icon={<ShieldCheck size={20} />}
          title="Security"
          description="Keep your account safe and control active sessions."
        >
          <div>
            <FieldLabel>Current Password</FieldLabel>
            <Input
              type="password"
              value={passwords.current}
              onChange={handlePasswordChange("current")}
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>New Password</FieldLabel>
              <Input
                type="password"
                value={passwords.next}
                onChange={handlePasswordChange("next")}
                placeholder="••••••••"
              />
            </div>
            <div>
              <FieldLabel>Confirm New Password</FieldLabel>
              <Input
                type="password"
                value={passwords.confirm}
                onChange={handlePasswordChange("confirm")}
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <Button text="Change Password" onClick={handleChangePassword} />
          </div>

          <SettingRow
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account."
            control={
              <div className="flex items-center gap-2">
                {COMING_SOON_BADGE}
                <ToggleSwitch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} disabled label="Two-Factor Authentication" />
              </div>
            }
          />

          <SettingRow
            title="Active Sessions"
            description="You're currently signed in on this device."
            control={
              <button
                type="button"
                onClick={handleLogoutAllDevices}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700/70 px-3 py-1.5 text-xs font-medium text-slate-400 transition duration-200 hover:border-red-500/50 hover:text-red-400 cursor-pointer"
              >
                <LogOut size={14} />
                Log Out Other Devices
              </button>
            }
          />
        </SettingsSection>

        {/* API Placeholder */}
        <SettingsSection
          icon={<KeyRound size={20} />}
          title="API Access"
          description="Manage credentials for programmatic access to Career OS."
          badge={COMING_SOON_BADGE}
        >
          <div>
            <FieldLabel>API Key</FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={apiKeyVisible ? apiKey : maskApiKey(apiKey)}
                className="font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setApiKeyVisible((prev) => !prev)}
                className="shrink-0 rounded-xl border border-slate-700/70 px-3 py-3 text-xs font-medium text-slate-400 transition duration-200 hover:border-blue-500/50 hover:text-white cursor-pointer"
              >
                {apiKeyVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopyApiKey}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700/70 px-4 py-2.5 text-sm font-medium text-slate-300 transition duration-200 hover:border-blue-500/50 hover:text-white cursor-pointer"
            >
              <Copy size={15} />
              Copy Key
            </button>
            <button
              type="button"
              onClick={handleRegenerateApiKey}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700/70 px-4 py-2.5 text-sm font-medium text-slate-300 transition duration-200 hover:border-blue-500/50 hover:text-white cursor-pointer"
            >
              <RefreshCw size={15} />
              Regenerate Key
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Public API access and webhook management are coming soon. Your key will remain
            inactive until this feature is released.
          </p>
        </SettingsSection>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default Settings;
