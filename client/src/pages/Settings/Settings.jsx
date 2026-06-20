import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Menu,
  User, Bell, Shield, Palette, Globe, MessageSquare,
  BarChart2, ChevronRight, Moon, Sun, Smartphone, Mail,
  Lock, Trash2, CheckCircle, AlertCircle
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Activity, label: 'Health Monitor', path: '/health' },
  { icon: Pill, label: 'Medications', path: '/medications' },
  { icon: Droplets, label: 'Dialysis', path: '/dialysis' },
  { icon: Salad, label: 'Diet & Lifestyle', path: '/diet' },
  { icon: CalendarDays, label: 'Appointments', path: '/appointments' },
  { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
  { icon: BookOpen, label: 'CKD Education', path: '/education' },
  { icon: Baby, label: 'Kids Mode', path: '/kids' },
  { icon: MessageSquare, label: 'AI Assistant', path: '/chatbot' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
        enabled ? 'bg-[#2E86AB]' : 'bg-gray-200'
      }`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
        enabled ? 'left-6' : 'left-1'
      }`} />
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [activePath, setActivePath] = useState('/settings');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('notifications');
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    medicationReminders: true,
    dialysisReminders: true,
    appointmentReminders: true,
    labReminders: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium',
    language: 'English',
  });

  const [privacy, setPrivacy] = useState({
    shareDataWithDoctor: true,
    anonymousAnalytics: false,
    twoFactorAuth: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SECTIONS = [
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'appearance', label: 'Appearance', icon: Palette },
    { key: 'privacy', label: 'Privacy & Security', icon: Shield },
    { key: 'account', label: 'Account', icon: User },
    { key: 'about', label: 'About RenalEase', icon: Globe },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${
  appearance.theme === 'dark' ? 'bg-gray-900' : 'bg-[#F4F9FF]'
} ${
  appearance.fontSize === 'small' ? 'text-xs' :
  appearance.fontSize === 'large' ? 'text-base' : 'text-sm'
}`}>

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#1A5276] to-[#154360] flex flex-col transition-all duration-300 shadow-2xl`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src={logo} alt="RenalEase" className="w-10 h-10 object-contain flex-shrink-0" />
          {sidebarOpen && (
            <span className="text-white font-extrabold text-lg tracking-tight">
              Renal<span className="text-[#A8DADC]">Ease</span>
            </span>
          )}
        </div>
        {sidebarOpen && (
          <div className="flex flex-col items-center py-6 px-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-all"
            onClick={() => navigate('/profile')}>
            <div className="w-16 h-16 rounded-full bg-[#A8DADC] flex items-center justify-center text-xl font-bold text-[#1A5276] mb-2 shadow-lg">
              {getInitials(user.fullName)}
            </div>
            <p className="text-white font-semibold text-sm">{user.fullName || 'Your Name'}</p>
            <p className="text-white/50 text-xs">View Profile</p>
          </div>
        )}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.path}
                onClick={() => { setActivePath(item.path); navigate(item.path); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 text-left ${
                  activePath === item.path
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}>
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="px-2 py-4 border-t border-white/10">
          <button onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200">
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={`flex-1 overflow-y-auto ${appearance.theme === 'dark' ? 'bg-gray-800' : ''}`}>

        {/* Top Bar */}
        <div className={`border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm ${
  appearance.theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'
}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-[#2E86AB] transition-colors">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#1A5276]">Settings</h1>
              <p className="text-gray-400 text-xs">Manage your app preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <CheckCircle size={16} /> Saved!
              </span>
            )}
            <button onClick={handleSave}
              className="bg-[#2E86AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all">
              Save Changes
            </button>
            <div className="w-9 h-9 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276]">
              {getInitials(user.fullName)}
            </div>
          </div>
        </div>

        <div className={`px-8 py-6 flex gap-6 ${appearance.theme === 'dark' ? 'text-white' : ''}`}>

          {/* Left — Section Menu */}
          <div className="w-56 flex-shrink-0">
            <div className={`rounded-2xl shadow-sm border overflow-hidden ${
  appearance.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'
}`}>
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b last:border-0 ${
  activeSection === section.key
    ? 'bg-[#EBF5FB] text-[#2E86AB] font-semibold'
    : appearance.theme === 'dark'
    ? 'text-gray-300 hover:bg-gray-600 border-gray-600'
    : 'text-gray-600 hover:bg-gray-50 border-gray-50'
}`}>
                    <Icon size={16} className="flex-shrink-0" />
                    <span className="text-sm">{section.label}</span>
                    {activeSection === section.key && (
                      <ChevronRight size={14} className="ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right — Settings Content */}
          <div className="flex-1">

            {/* NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <div className={`rounded-2xl shadow-sm border overflow-hidden ${
  appearance.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'
}`}>
                <div className={`px-6 py-4 border-b ${appearance.theme === 'dark' ? 'border-gray-600' : 'border-gray-100'}`}>
                  <h2 className="font-bold text-[#1A5276] flex items-center gap-2">
                    <Bell size={18} className="text-[#2E86AB]" /> Notification Preferences
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">Choose what you want to be notified about</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { key: 'medicationReminders', icon: Pill, label: 'Medication Reminders', desc: 'Get reminded when it\'s time to take your medications' },
                    { key: 'dialysisReminders', icon: Droplets, label: 'Dialysis Reminders', desc: 'Reminders for upcoming dialysis sessions' },
                    { key: 'appointmentReminders', icon: CalendarDays, label: 'Appointment Reminders', desc: 'Notifications for upcoming doctor appointments' },
                    { key: 'labReminders', icon: Activity, label: 'Lab Test Reminders', desc: 'Reminders for scheduled lab tests' },
                    { key: 'emailNotifications', icon: Mail, label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'smsNotifications', icon: Smartphone, label: 'SMS Notifications', desc: 'Receive notifications via SMS (coming soon)' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#EBF5FB] flex items-center justify-center">
                            <Icon size={16} className="text-[#2E86AB]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                        </div>
                        <ToggleSwitch
                          enabled={notifications[item.key]}
                          onChange={(val) => setNotifications({ ...notifications, [item.key]: val })}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* APPEARANCE */}
            {activeSection === 'appearance' && (
              <div className={`rounded-2xl shadow-sm border overflow-hidden ${
  appearance.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'
}`}>
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-[#1A5276] flex items-center gap-2">
                    <Palette size={18} className="text-[#2E86AB]" /> Appearance
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">Customize how RenalEase looks</p>
                </div>
                <div className="p-6 flex flex-col gap-6">

                  {/* Theme */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Theme</p>
                    <div className="flex gap-3">
                      {[
                        { key: 'light', label: 'Light', icon: Sun },
                        { key: 'dark', label: 'Dark', icon: Moon },
                      ].map((t) => {
                        const Icon = t.icon;
                        return (
                          <button key={t.key}
                            onClick={() => setAppearance({ ...appearance, theme: t.key })}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                              appearance.theme === t.key
                                ? 'border-[#2E86AB] bg-[#EBF5FB] text-[#2E86AB]'
                                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}>
                            <Icon size={16} /> {t.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Dark mode coming soon</p>
                  </div>

                  {/* Font Size */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Font Size</p>
                    <div className="flex gap-3">
                      {['small', 'medium', 'large'].map((size) => (
                        <button key={size}
                          onClick={() => setAppearance({ ...appearance, fontSize: size })}
                          className={`px-5 py-2.5 rounded-xl border-2 font-semibold text-sm capitalize transition-all ${
                            appearance.fontSize === size
                              ? 'border-[#2E86AB] bg-[#EBF5FB] text-[#2E86AB]'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Language</p>
                    <select value={appearance.language}
                      onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] bg-white">
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Telugu</option>
                      <option>Tamil</option>
                      <option>Kannada</option>
                      <option>Malayalam</option>
                      <option>Marathi</option>
                      <option>Gujarati</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-2">Multi-language support coming soon</p>
                  </div>

                </div>
              </div>
            )}

            {/* PRIVACY */}
            {activeSection === 'privacy' && (
              <div className={`rounded-2xl shadow-sm border overflow-hidden ${
  appearance.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'
}`}>
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-[#1A5276] flex items-center gap-2">
                    <Shield size={18} className="text-[#2E86AB]" /> Privacy & Security
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">Manage your data and security settings</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { key: 'shareDataWithDoctor', icon: Stethoscope, label: 'Share Data with Doctor', desc: 'Allow your doctor to view your health records' },
                    { key: 'anonymousAnalytics', icon: BarChart2, label: 'Anonymous Analytics', desc: 'Help improve RenalEase by sharing anonymous usage data' },
                    { key: 'twoFactorAuth', icon: Lock, label: 'Two-Factor Authentication', desc: 'Add extra security to your account (coming soon)' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#EBF5FB] flex items-center justify-center">
                            <Icon size={16} className="text-[#2E86AB]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                        </div>
                        <ToggleSwitch
                          enabled={privacy[item.key]}
                          onChange={(val) => setPrivacy({ ...privacy, [item.key]: val })}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACCOUNT */}
            {activeSection === 'account' && (
              <div className="flex flex-col gap-4">
                <div className={`rounded-2xl shadow-sm border overflow-hidden ${
  appearance.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'
}`}>
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-[#1A5276] flex items-center gap-2">
                      <User size={18} className="text-[#2E86AB]" /> Account Settings
                    </h2>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-4 bg-[#F4F9FF] rounded-2xl p-4">
                      <div className="w-14 h-14 rounded-full bg-[#A8DADC] flex items-center justify-center text-xl font-bold text-[#1A5276]">
                        {getInitials(user.fullName)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1A5276]">{user.fullName || 'Your Name'}</p>
                        <p className="text-gray-400 text-sm">{user.email || 'No email set'}</p>
                        <p className="text-gray-400 text-xs capitalize">{user.role || 'Patient'}</p>
                      </div>
                      <button
                        onClick={() => navigate('/profile')}
                        className="ml-auto bg-[#2E86AB] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all">
                        Edit Profile
                      </button>
                    </div>

                    {[
                      { label: 'Change Password', icon: Lock, desc: 'Update your account password', action: () => {} },
                      { label: 'Connected Devices', icon: Smartphone, desc: 'Manage devices linked to your account', action: () => {} },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button key={item.label}
                          onClick={item.action}
                          className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all text-left">
                          <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                            <Icon size={16} className="text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-red-100">
                    <h2 className="font-bold text-red-600 flex items-center gap-2">
                      <AlertCircle size={18} /> Danger Zone
                    </h2>
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    <button
                      onClick={() => navigate('/')}
                      className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all text-left">
                      <LogOut size={18} className="text-red-500" />
                      <div>
                        <p className="text-sm font-semibold text-red-600">Sign Out</p>
                        <p className="text-xs text-red-400">Sign out of your RenalEase account</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all text-left">
                      <Trash2 size={18} className="text-red-500" />
                      <div>
                        <p className="text-sm font-semibold text-red-600">Delete Account</p>
                        <p className="text-xs text-red-400">Permanently delete your account and all data</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT */}
            {activeSection === 'about' && (
              <div className={`rounded-2xl shadow-sm border overflow-hidden ${
  appearance.theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'
}`}>
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-[#1A5276] flex items-center gap-2">
                    <Globe size={18} className="text-[#2E86AB]" /> About RenalEase
                  </h2>
                </div>
                <div className="p-6 flex flex-col items-center text-center gap-4">
                  <img src={logo} alt="RenalEase" className="w-20 h-20 object-contain" />
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#1A5276]">
                      Renal<span className="text-[#2E86AB]">Ease</span>
                    </h3>
                    <p className="text-gray-400 text-sm">CKD Health Tracker</p>
                    <p className="text-gray-300 text-xs mt-1">Version 1.0.0</p>
                  </div>
                  <p className="text-gray-500 text-sm max-w-md leading-relaxed">
                    RenalEase is a personal project built with purpose - inspired by real CKD patients and their families. It aims to make kidney disease management simpler, more informed, and more human.
                  </p>
                  <div className="bg-[#F4F9FF] rounded-2xl p-4 w-full">
                    <p className="text-[#2E86AB] font-semibold text-sm italic">
                      "Built with purpose, for every kidney warrior 💙"
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full text-sm">
                    {[
                      { label: 'GitHub', value: 'github.com/Princee06/RenalEase' },
                      { label: 'Version', value: '1.0.0' },
                      { label: 'Built with', value: 'React.js + Tailwind CSS' },
                      { label: 'Backend', value: 'Node.js + Express + MongoDB' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-400 font-medium">{item.label}</span>
                        <span className="text-gray-600 font-semibold text-xs">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}