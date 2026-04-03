import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useUser } from '../../context/UserContext';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
  { icon: '📊', label: 'Health Monitor', path: '/health' },
  { icon: '💊', label: 'Medications', path: '/medications' },
  { icon: '🩺', label: 'Dialysis', path: '/dialysis' },
  { icon: '🥗', label: 'Diet & Lifestyle', path: '/diet' },
  { icon: '📅', label: 'Appointments', path: '/appointments' },
  { icon: '🏥', label: 'Doctors', path: '/doctors' },
  { icon: '📚', label: 'CKD Education', path: '/education' },
  { icon: '👧', label: 'Kids Mode', path: '/kids' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

const HEALTH_CARDS = [
  { label: 'eGFR', value: '28', unit: 'mL/min', status: 'Low', color: 'bg-red-50 border-red-200', textColor: 'text-red-500', icon: '🫘' },
  { label: 'Blood Pressure', value: '138/88', unit: 'mmHg', status: 'High', color: 'bg-orange-50 border-orange-200', textColor: 'text-orange-500', icon: '❤️' },
  { label: 'Weight', value: '68', unit: 'kg', status: 'Normal', color: 'bg-green-50 border-green-200', textColor: 'text-green-500', icon: '⚖️' },
  { label: 'Fluid Intake', value: '1.2', unit: 'L today', status: 'On Track', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-500', icon: '💧' },
];

const MEDICATIONS = [
  { name: 'Amlodipine', dose: '5mg', time: '8:00 AM', taken: true },
  { name: 'Sodium Bicarbonate', dose: '500mg', time: '1:00 PM', taken: false },
  { name: 'Calcitriol', dose: '0.25mcg', time: '9:00 PM', taken: false },
];

const QUICK_ACTIONS = [
  { icon: '📅', label: 'Book Appointment', color: 'bg-[#EBF5FB] text-[#2E86AB]' },
  { icon: '👨‍⚕️', label: 'Contact Doctor', color: 'bg-[#EAF9F0] text-[#1A7A4A]' },
  { icon: '🥗', label: 'View Diet Plan', color: 'bg-[#FEF9E7] text-[#B7770D]' },
  { icon: '📋', label: 'Lab Results', color: 'bg-[#F9EBEA] text-[#E74C3C]' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, getAge } = useUser();
  const [activePath, setActivePath] = useState('/dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'there';
  const age = getAge();
  const ckdLabel = user.ckdStage ? user.ckdStage.replace('stage', 'Stage ').replace('undiagnosed', 'Not Diagnosed') : 'CKD Patient';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex h-screen bg-[#F4F9FF] overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#1A5276] to-[#154360] flex flex-col transition-all duration-300 shadow-2xl`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src={logo} alt="RenalEase" className="w-10 h-10 object-contain flex-shrink-0" />
          {sidebarOpen && (
            <span className="text-white font-extrabold text-lg tracking-tight">
              Renal<span className="text-[#A8DADC]">Ease</span>
            </span>
          )}
        </div>

        {/* Profile */}
        {sidebarOpen && (
          <div className="flex flex-col items-center py-6 px-4 border-b border-white/10">
            <div className="w-16 h-16 rounded-full bg-[#A8DADC] flex items-center justify-center text-xl font-bold text-[#1A5276] mb-2 shadow-lg">
              {getInitials(user.fullName)}
            </div>
            <p className="text-white font-semibold text-sm">{user.fullName || 'Your Name'}</p>
            <p className="text-white/50 text-xs">
              {age ? `${age} y.o` : ''}{age && ckdLabel ? ' • ' : ''}{ckdLabel}
            </p>
            {user.dialysis === 'yes' && (
              <span className="mt-2 bg-red-500/20 text-red-300 text-xs px-3 py-0.5 rounded-full font-medium">
                On Dialysis
              </span>
            )}
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => { setActivePath(item.path); navigate(item.path); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 text-left ${
                activePath === item.path
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="px-2 py-4 border-t border-white/10">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-[#2E86AB] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#1A5276]">
                {getGreeting()}, {firstName}! 👋
              </h1>
              <p className="text-gray-400 text-xs">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 bg-[#F4F9FF] rounded-full flex items-center justify-center hover:bg-[#EBF5FB] transition-colors">
              <span className="text-lg">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276]">
              {getInitials(user.fullName)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#2E86AB] to-[#1A5276] rounded-2xl p-6 mb-6 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[#A8DADC] text-sm font-medium mb-1">
                {ckdLabel} {user.dialysis === 'yes' ? '• On Dialysis' : ''}
              </p>
              <h2 className="text-white text-2xl font-bold mb-2">
                Welcome back, {firstName} 💙
              </h2>
              <p className="text-white/70 text-sm max-w-md">
                Track your health, manage your records, and stay on top of your treatment. You're doing great!
              </p>
              <button className="mt-3 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all">
                Learn about CKD →
              </button>
            </div>
            <div className="hidden md:block text-8xl opacity-20">🫘</div>
          </div>

          {/* Health Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {HEALTH_CARDS.map((card) => (
              <div key={card.label} className={`bg-white border ${card.color} rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{card.icon}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.color} ${card.textColor}`}>
                    {card.status}
                  </span>
                </div>
                <p className="text-gray-500 text-xs font-medium mb-1">{card.label}</p>
                <p className="text-gray-800 text-xl font-bold">{card.value}
                  <span className="text-gray-400 text-xs font-normal ml-1">{card.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Medications Today */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1A5276] text-sm">Today's Medications</h3>
                <button className="text-[#2E86AB] text-xs font-semibold hover:underline">View All</button>
              </div>
              <div className="flex flex-col gap-3">
                {MEDICATIONS.map((med) => (
                  <div key={med.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${med.taken ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {med.taken ? '✅' : '💊'}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${med.taken ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                          {med.name}
                        </p>
                        <p className="text-xs text-gray-400">{med.dose} • {med.time}</p>
                      </div>
                    </div>
                    {!med.taken && (
                      <button className="text-xs bg-[#EBF5FB] text-[#2E86AB] font-semibold px-3 py-1 rounded-full hover:bg-[#2E86AB] hover:text-white transition-all">
                        Mark
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1A5276] text-sm mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    className={`${action.color} rounded-xl p-3 flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all duration-200`}
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-xs font-semibold text-center leading-tight">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Appointment */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1A5276] text-sm">Next Appointment</h3>
                <button className="text-[#2E86AB] text-xs font-semibold hover:underline">View All</button>
              </div>
              <div className="bg-[#F4F9FF] rounded-xl p-4 mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#A8DADC] flex items-center justify-center text-lg">👨‍⚕️</div>
                  <div>
                    <p className="text-sm font-bold text-[#1A5276]">
                      {user.doctorName || 'No doctor added yet'}
                    </p>
                    <p className="text-xs text-gray-400">Nephrologist</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>🏥</span>
                  <span>{user.hospital || 'Add your hospital in profile'}</span>
                </div>
              </div>
              <button className="w-full bg-[#2E86AB] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1A5276] transition-all">
                + Book New Appointment
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}