import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useUser } from '../../context/UserContext';

import {
  LayoutDashboard,
  Activity,
  Pill,
  Droplets,
  Salad,
  CalendarDays,
  Stethoscope,
  BookOpen,
  Baby,
  Settings,
  LogOut,
  Bell,
  Menu,
  FlaskConical,
  HeartPulse,
  Weight,
  Gauge,
  ChevronRight,
  Plus,
  MessageSquare,
  BarChart2
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
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: MessageSquare, label: 'AI Assistant', path: '/chatbot' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
];

const HEALTH_CARDS = [
  { label: 'eGFR', value: '28', unit: 'mL/min', status: 'Low', colorClass: 'text-red-500', bgClass: 'bg-red-50', borderClass: 'border-red-200', icon: FlaskConical },
  { label: 'Blood Pressure', value: '138/88', unit: 'mmHg', status: 'High', colorClass: 'text-orange-500', bgClass: 'bg-orange-50', borderClass: 'border-orange-200', icon: HeartPulse },
  { label: 'Weight', value: '68', unit: 'kg', status: 'Normal', colorClass: 'text-green-500', bgClass: 'bg-green-50', borderClass: 'border-green-200', icon: Weight },
  { label: 'Fluid Intake', value: '1.2', unit: 'L today', status: 'On Track', colorClass: 'text-blue-500', bgClass: 'bg-blue-50', borderClass: 'border-blue-200', icon: Droplets },
];

const MEDICATIONS = [
  { name: 'Nicardia XL 30', dose: '30mg', time: '8:00 AM', taken: true },
  { name: 'Sodium Bicarbonate', dose: '500mg', time: '1:00 PM', taken: false },
  { name: 'Ferium XT', dose: '325mg', time: '9:00 PM', taken: false },
];

const QUICK_ACTIONS = [
  { icon: CalendarDays, label: 'Book Appointment', bg: 'bg-[#EBF5FB]', color: 'text-[#2E86AB]', path: '/appointments' },
  { icon: Stethoscope, label: 'Contact Doctor', bg: 'bg-[#EAF9F0]', color: 'text-[#1A7A4A]', path: '/doctors' },
  { icon: Salad, label: 'View Diet Plan', bg: 'bg-[#FEF9E7]', color: 'text-[#B7770D]', path: '/diet' },
  { icon: FlaskConical, label: 'Lab Results', bg: 'bg-[#F9EBEA]', color: 'text-[#E74C3C]', path: '/health' },
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
  const ckdLabel = user.ckdStage
    ? user.ckdStage.replace('stage', 'Stage ').replace('undiagnosed', 'Not Diagnosed')
    : 'CKD Patient';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="flex h-screen bg-[#F4F9FF] overflow-hidden">

      {/* SIDEBAR */}
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
  <div
    className="flex flex-col items-center py-6 px-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-all"
    onClick={() => navigate('/profile')}
  >
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
    <p className="text-white/30 text-xs mt-1">View Profile</p>
  </div>
)}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => { setActivePath(item.path); navigate(item.path); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 text-left ${
                  activePath === item.path
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="px-2 py-4 border-t border-white/10">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-[#2E86AB] transition-colors">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#1A5276]">{getGreeting()}, {firstName}! 👋</h1>
              <p className="text-gray-400 text-xs">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 bg-[#F4F9FF] rounded-full flex items-center justify-center hover:bg-[#EBF5FB] transition-colors">
              <Bell size={18} className="text-gray-500" />
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
              <h2 className="text-white text-2xl font-bold mb-2">Welcome back, {firstName} 💙</h2>
              <p className="text-white/70 text-sm max-w-md">
                Track your health, manage your records, and stay on top of your treatment. You're doing great!
              </p>
              <button className="mt-3 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all flex items-center gap-2">
                Learn about CKD <ChevronRight size={14} />
              </button>
            </div>
            <div className="hidden md:block opacity-10">
              <Activity size={120} className="text-white" />
            </div>
          </div>

          {/* Health Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {HEALTH_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={`bg-white border ${card.borderClass} rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={22} className={card.colorClass} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.bgClass} ${card.colorClass}`}>
                      {card.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-medium mb-1">{card.label}</p>
                  <p className="text-gray-800 text-xl font-bold">{card.value}
                    <span className="text-gray-400 text-xs font-normal ml-1">{card.unit}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Medications Today */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1A5276] text-sm flex items-center gap-2">
                  <Pill size={16} className="text-[#2E86AB]" /> Today's Medications
                </h3>
                <button className="text-[#2E86AB] text-xs font-semibold hover:underline flex items-center gap-1">
                  View All <ChevronRight size={12} />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {MEDICATIONS.map((med) => (
                  <div key={med.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${med.taken ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Pill size={14} className={med.taken ? 'text-green-500' : 'text-gray-400'} />
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
              <h3 className="font-bold text-[#1A5276] text-sm mb-4 flex items-center gap-2">
                <Gauge size={16} className="text-[#2E86AB]" /> Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className={`${action.bg} ${action.color} rounded-xl p-3 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200`}
                    >
                      <Icon size={22} />
                      <span className="text-xs font-semibold text-center leading-tight">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Appointment */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1A5276] text-sm flex items-center gap-2">
                  <CalendarDays size={16} className="text-[#2E86AB]" /> Next Appointment
                </h3>
                <button className="text-[#2E86AB] text-xs font-semibold hover:underline flex items-center gap-1">
                  View All <ChevronRight size={12} />
                </button>
              </div>
              <div className="bg-[#F4F9FF] rounded-xl p-4 mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#A8DADC] flex items-center justify-center">
                    <Stethoscope size={18} className="text-[#1A5276]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A5276]">
                      {user.doctorName || 'No doctor added yet'}
                    </p>
                    <p className="text-xs text-gray-400">Nephrologist</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={12} />
                  <span>April 5, 2026 • 10:30 AM</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Stethoscope size={12} />
                  <span>{user.hospital || 'Add your hospital in profile'}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/appointments')}
                className="w-full bg-[#2E86AB] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1A5276] transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Book New Appointment
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}