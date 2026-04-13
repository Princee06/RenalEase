import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Menu, Plus,
  Clock, CheckCircle, Trash2, ChevronRight,
  Timer, ClipboardList, TrendingUp, Home, Building2
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
];

const INITIAL_SESSIONS = [
  { id: 1, date: '2026-04-03', type: 'Hemodialysis', duration: 240, center: 'Apollo Hospital', doctor: 'Dr. Rajesh Kumar', bloodFlow: 300, weight_pre: 68.5, weight_post: 66.2, notes: 'Routine session, no complications.', status: 'Completed', dialysisMode: 'HD' },
  { id: 2, date: '2026-04-01', type: 'Hemodialysis', duration: 240, center: 'Apollo Hospital', doctor: 'Dr. Rajesh Kumar', bloodFlow: 300, weight_pre: 69.0, weight_post: 66.8, notes: 'Slight cramping during session.', status: 'Completed', dialysisMode: 'HD' },
  { id: 3, date: '2026-03-29', type: 'Peritoneal Dialysis', exchanges: 4, dwellTime: 4, fluidIn: 2000, fluidOut: 2150, weight_pre: 68.0, weight_post: 67.8, notes: 'Home PD, all exchanges completed.', status: 'Completed', dialysisMode: 'PD' },
  { id: 4, date: '2026-03-27', type: 'Hemodialysis', duration: 240, center: 'Apollo Hospital', doctor: 'Dr. Rajesh Kumar', bloodFlow: 300, weight_pre: 69.2, weight_post: 67.0, notes: 'BP slightly high at start.', status: 'Completed', dialysisMode: 'HD' },
  { id: 5, date: '2026-04-05', type: 'Hemodialysis', duration: 240, center: 'Apollo Hospital', doctor: 'Dr. Rajesh Kumar', bloodFlow: 300, weight_pre: null, weight_post: null, notes: '', status: 'Upcoming', dialysisMode: 'HD' },
];

const HD_DEFAULT = {
  date: '', type: 'Hemodialysis', dialysisMode: 'HD',
  duration: '', center: '', doctor: '', bloodFlow: '',
  weight_pre: '', weight_post: '', notes: '',
};

const PD_DEFAULT = {
  date: '', type: 'Peritoneal Dialysis', dialysisMode: 'PD',
  exchanges: '', dwellTime: '', fluidIn: '', fluidOut: '',
  weight_pre: '', weight_post: '', notes: '',
};

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m > 0 ? m + 'm' : ''}`;
}

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition bg-white";

export default function Dialysis() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activePath, setActivePath] = useState('/dialysis');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const userMode = user.dialysisType === 'peritoneal' ? 'PD' : 'HD';
const [sessions, setSessions] = useState(
  INITIAL_SESSIONS.filter((s) => s.dialysisMode === userMode)
);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formMode, setFormMode] = useState('HD');
  const [newSession, setNewSession] = useState(HD_DEFAULT);

  useEffect(() => {
    if (user.dialysisType === 'peritoneal') {
      setFormMode('PD');
      setNewSession(PD_DEFAULT);
    } else {
      setFormMode('HD');
      setNewSession(HD_DEFAULT);
    }
  }, [user.dialysisType]);

  const upcomingSessions = sessions.filter((s) => s.status === 'Upcoming');
  const completedSessions = sessions.filter((s) => s.status === 'Completed');
  const hdSessions = completedSessions.filter((s) => s.dialysisMode === 'HD');
  const pdSessions = completedSessions.filter((s) => s.dialysisMode === 'PD');
  const totalHDHours = hdSessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const avgDuration = hdSessions.length
    ? Math.round(hdSessions.reduce((acc, s) => acc + s.duration, 0) / hdSessions.length)
    : 0;

  const switchFormMode = (mode) => {
    setFormMode(mode);
    setNewSession(mode === 'HD' ? HD_DEFAULT : PD_DEFAULT);
  };

  const addSession = () => {
    if (!newSession.date) return;
    if (formMode === 'HD' && !newSession.duration) return;
    if (formMode === 'PD' && !newSession.exchanges) return;
    setSessions([...sessions, {
      id: Date.now(),
      ...newSession,
      duration: newSession.duration ? parseInt(newSession.duration) : null,
      exchanges: newSession.exchanges ? parseInt(newSession.exchanges) : null,
      status: new Date(newSession.date) > new Date() ? 'Upcoming' : 'Completed',
    }]);
    setNewSession(formMode === 'HD' ? HD_DEFAULT : PD_DEFAULT);
    setShowAddForm(false);
  };

  const deleteSession = (id) => setSessions(sessions.filter((s) => s.id !== id));

  return (
    <div className="flex h-screen bg-[#F4F9FF] overflow-hidden">

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
          <div className="flex flex-col items-center py-6 px-4 border-b border-white/10">
            <div className="w-16 h-16 rounded-full bg-[#A8DADC] flex items-center justify-center text-xl font-bold text-[#1A5276] mb-2 shadow-lg">
              {getInitials(user.fullName)}
            </div>
            <p className="text-white font-semibold text-sm">{user.fullName || 'Your Name'}</p>
            <p className="text-white/50 text-xs">Dialysis Tracker</p>
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
      <main className="flex-1 overflow-y-auto">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-[#2E86AB] transition-colors">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#1A5276]">Dialysis Tracker</h1>
              <p className="text-gray-400 text-xs">{completedSessions.length} sessions completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#2E86AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
              <Plus size={16} /> Log Session
            </button>
            <div className="w-9 h-9 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276]">
              {getInitials(user.fullName)}
            </div>
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Sessions', value: completedSessions.length, icon: ClipboardList, bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-500' },
              { label: 'HD Sessions', value: hdSessions.length, icon: Building2, bg: 'bg-purple-50', border: 'border-purple-200', color: 'text-purple-500' },
              { label: 'PD Sessions', value: pdSessions.length, icon: Home, bg: 'bg-green-50', border: 'border-green-200', color: 'text-green-500' },
              { label: 'Upcoming', value: upcomingSessions.length, icon: CalendarDays, bg: 'bg-orange-50', border: 'border-orange-200', color: 'text-orange-500' },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={`bg-white border ${card.border} rounded-2xl p-4 shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={22} className={card.color} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.bg} ${card.color}`}>
                      {card.value}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-medium">{card.label}</p>
                </div>
              );
            })}
          </div>

          {/* HD vs PD Info Banner */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-4 transition-all ${
              user.dialysisType !== 'peritoneal'
                ? 'border-purple-300 ring-2 ring-purple-100'
                : 'border-purple-100'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Building2 size={20} className="text-purple-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#1A5276] text-sm">Hemodialysis (HD)</p>
                  {user.dialysisType !== 'peritoneal' && (
                    <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Your Treatment
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">Center-based • 3x per week • 3-5 hrs/session</p>
                {hdSessions.length > 0 && (
                  <p className="text-xs text-purple-500 font-semibold mt-0.5">
                    Avg: {formatDuration(avgDuration)} per session
                  </p>
                )}
              </div>
            </div>

            <div className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-4 transition-all ${
              user.dialysisType === 'peritoneal'
                ? 'border-green-300 ring-2 ring-green-100'
                : 'border-green-100'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Home size={20} className="text-green-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#1A5276] text-sm">Peritoneal Dialysis (PD)</p>
                  {user.dialysisType === 'peritoneal' && (
                    <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Your Treatment
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">Home-based • Daily • 3-5 exchanges/day</p>
                {pdSessions.length > 0 && (
                  <p className="text-xs text-green-500 font-semibold mt-0.5">
                    {pdSessions.length} PD sessions logged
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Add Session Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                <Plus size={18} className="text-[#2E86AB]" /> Log Dialysis Session
              </h3>

              {/* HD vs PD Toggle */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-5 w-fit">
                <button
                  onClick={() => switchFormMode('HD')}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all ${
                    formMode === 'HD' ? 'bg-[#2E86AB] text-white' : 'bg-white text-gray-400 hover:bg-gray-50'
                  }`}>
                  <Building2 size={15} /> Hemodialysis (HD)
                </button>
                <button
                  onClick={() => switchFormMode('PD')}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all ${
                    formMode === 'PD' ? 'bg-[#2E86AB] text-white' : 'bg-white text-gray-400 hover:bg-gray-50'
                  }`}>
                  <Home size={15} /> Peritoneal Dialysis (PD)
                </button>
              </div>

              {/* Mode Info */}
              <div className={`rounded-xl p-3 mb-4 text-xs flex items-center gap-2 ${
                formMode === 'HD' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
              }`}>
                {formMode === 'HD'
                  ? <><Building2 size={14} /> Center-based dialysis — tracks session duration, blood flow rate, and weight changes</>
                  : <><Home size={14} /> Home-based dialysis — tracks daily exchanges, dwell time, and fluid balance</>
                }
              </div>

              <div className="grid grid-cols-2 gap-4">

                {/* Common — Date */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Date</label>
                  <input type="date" value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    className={inputClass} />
                </div>

                {/* HD Fields */}
                {formMode === 'HD' && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        Duration <span className="text-gray-400 normal-case font-normal">(minutes)</span>
                      </label>
                      <input type="number" value={newSession.duration}
                        onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                        placeholder="e.g. 240" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        Blood Flow Rate <span className="text-gray-400 normal-case font-normal">(mL/min)</span>
                      </label>
                      <input type="number" value={newSession.bloodFlow}
                        onChange={(e) => setNewSession({ ...newSession, bloodFlow: e.target.value })}
                        placeholder="e.g. 300" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Dialysis Center</label>
                      <input type="text" value={newSession.center}
                        onChange={(e) => setNewSession({ ...newSession, center: e.target.value })}
                        placeholder="e.g. Apollo Hospital" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Doctor</label>
                      <input type="text" value={newSession.doctor}
                        onChange={(e) => setNewSession({ ...newSession, doctor: e.target.value })}
                        placeholder="e.g. Dr. Rajesh Kumar" className={inputClass} />
                    </div>
                  </>
                )}

                {/* PD Fields */}
                {formMode === 'PD' && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        No. of Exchanges
                      </label>
                      <input type="number" value={newSession.exchanges}
                        onChange={(e) => setNewSession({ ...newSession, exchanges: e.target.value })}
                        placeholder="e.g. 4" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        Dwell Time <span className="text-gray-400 normal-case font-normal">(hours per exchange)</span>
                      </label>
                      <input type="number" step="0.5" value={newSession.dwellTime}
                        onChange={(e) => setNewSession({ ...newSession, dwellTime: e.target.value })}
                        placeholder="e.g. 4" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        Fluid In <span className="text-gray-400 normal-case font-normal">(mL total)</span>
                      </label>
                      <input type="number" value={newSession.fluidIn}
                        onChange={(e) => setNewSession({ ...newSession, fluidIn: e.target.value })}
                        placeholder="e.g. 2000" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        Fluid Out <span className="text-gray-400 normal-case font-normal">(mL total)</span>
                      </label>
                      <input type="number" value={newSession.fluidOut}
                        onChange={(e) => setNewSession({ ...newSession, fluidOut: e.target.value })}
                        placeholder="e.g. 2150" className={inputClass} />
                    </div>
                  </>
                )}

                {/* Common Weight Fields */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Pre Weight <span className="text-gray-400 normal-case font-normal">(kg)</span>
                  </label>
                  <input type="number" step="0.1" value={newSession.weight_pre}
                    onChange={(e) => setNewSession({ ...newSession, weight_pre: e.target.value })}
                    placeholder="e.g. 68.5" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Post Weight <span className="text-gray-400 normal-case font-normal">(kg)</span>
                  </label>
                  <input type="number" step="0.1" value={newSession.weight_post}
                    onChange={(e) => setNewSession({ ...newSession, weight_post: e.target.value })}
                    placeholder="e.g. 66.2" className={inputClass} />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Notes</label>
                  <textarea value={newSession.notes}
                    onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                    placeholder="Any observations, complications, or comments..."
                    rows={3}
                    className={inputClass + ' resize-none'} />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={addSession}
                  className="bg-[#2E86AB] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
                  <CheckCircle size={16} /> Save Session
                </button>
                <button onClick={() => setShowAddForm(false)}
                  className="border border-gray-200 text-gray-500 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {['upcoming', 'history'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-[#2E86AB] text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}>
                {tab === 'upcoming'
                  ? <><CalendarDays size={14} /> Upcoming Sessions</>
                  : <><ClipboardList size={14} /> Session History</>
                }
              </button>
            ))}
          </div>

          {/* Upcoming Sessions */}
          {activeTab === 'upcoming' && (
            <div className="flex flex-col gap-4">
              {upcomingSessions.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                  <CalendarDays size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No upcoming sessions</p>
                  <p className="text-gray-300 text-sm mt-1">Click "Log Session" to add one</p>
                </div>
              ) : (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          session.dialysisMode === 'PD' ? 'bg-green-50' : 'bg-blue-50'
                        }`}>
                          {session.dialysisMode === 'PD'
                            ? <Home size={24} className="text-green-500" />
                            : <Building2 size={24} className="text-[#2E86AB]" />
                          }
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[#1A5276] text-sm">{session.type}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              session.dialysisMode === 'PD'
                                ? 'bg-green-50 text-green-500'
                                : 'bg-purple-50 text-purple-500'
                            }`}>
                              {session.dialysisMode}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {new Date(session.date).toLocaleDateString('en-IN', {
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                          <div className="flex gap-3 mt-2 flex-wrap">
                            {session.dialysisMode === 'HD' && (
                              <>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Timer size={12} /> {formatDuration(session.duration)}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Stethoscope size={12} /> {session.doctor}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Building2 size={12} /> {session.center}
                                </span>
                              </>
                            )}
                            {session.dialysisMode === 'PD' && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Droplets size={12} /> {session.exchanges} exchanges planned
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-500 text-xs font-semibold px-3 py-1 rounded-full">
                          Upcoming
                        </span>
                        <button onClick={() => deleteSession(session.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Session History */}
          {activeTab === 'history' && (
            <div className="flex flex-col gap-4">
              {completedSessions.map((session) => {
                const fluidRemoved = session.weight_pre && session.weight_post
                  ? (session.weight_pre - session.weight_post).toFixed(1)
                  : null;
                const fluidBalance = session.fluidOut && session.fluidIn
                  ? (session.fluidOut - session.fluidIn)
                  : null;
                return (
                  <div key={session.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          session.dialysisMode === 'PD' ? 'bg-green-50' : 'bg-purple-50'
                        }`}>
                          {session.dialysisMode === 'PD'
                            ? <Home size={24} className="text-green-500" />
                            : <Building2 size={24} className="text-purple-500" />
                          }
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[#1A5276] text-sm">{session.type}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              session.dialysisMode === 'PD'
                                ? 'bg-green-50 text-green-500'
                                : 'bg-purple-50 text-purple-500'
                            }`}>
                              {session.dialysisMode}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {new Date(session.date).toLocaleDateString('en-IN', {
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-50 text-green-500 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle size={10} /> Completed
                        </span>
                        <button onClick={() => deleteSession(session.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* HD Details */}
                    {session.dialysisMode === 'HD' && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        <div className="bg-[#F4F9FF] rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <Timer size={10} /> Duration
                          </p>
                          <p className="text-sm font-bold text-[#1A5276]">{formatDuration(session.duration)}</p>
                        </div>
                        <div className="bg-[#F4F9FF] rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <Activity size={10} /> Blood Flow
                          </p>
                          <p className="text-sm font-bold text-[#1A5276]">{session.bloodFlow} mL/min</p>
                        </div>
                        {fluidRemoved && (
                          <div className="bg-[#F4F9FF] rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                              <Droplets size={10} /> Fluid Removed
                            </p>
                            <p className="text-sm font-bold text-[#1A5276]">{fluidRemoved} kg</p>
                          </div>
                        )}
                        <div className="bg-[#F4F9FF] rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <Stethoscope size={10} /> Doctor
                          </p>
                          <p className="text-sm font-bold text-[#1A5276] truncate">{session.doctor}</p>
                        </div>
                      </div>
                    )}

                    {/* PD Details */}
                    {session.dialysisMode === 'PD' && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        <div className="bg-[#F4F9FF] rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <Droplets size={10} /> Exchanges
                          </p>
                          <p className="text-sm font-bold text-[#1A5276]">{session.exchanges}x</p>
                        </div>
                        <div className="bg-[#F4F9FF] rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <Clock size={10} /> Dwell Time
                          </p>
                          <p className="text-sm font-bold text-[#1A5276]">{session.dwellTime}h each</p>
                        </div>
                        <div className="bg-[#F4F9FF] rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <TrendingUp size={10} /> Fluid In
                          </p>
                          <p className="text-sm font-bold text-[#1A5276]">{session.fluidIn} mL</p>
                        </div>
                        <div className="bg-[#F4F9FF] rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <Droplets size={10} /> Fluid Out
                          </p>
                          <p className="text-sm font-bold text-[#1A5276]">{session.fluidOut} mL</p>
                        </div>
                      </div>
                    )}

                    {/* Weight & Fluid Balance */}
                    {session.weight_pre && session.weight_post && (
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-lg">
                          Pre: {session.weight_pre} kg
                        </span>
                        <ChevronRight size={12} className="text-gray-400" />
                        <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-lg">
                          Post: {session.weight_post} kg
                        </span>
                        {fluidRemoved && (
                          <span className="bg-blue-50 text-blue-500 text-xs px-2 py-1 rounded-lg font-semibold">
                            -{fluidRemoved} kg removed
                          </span>
                        )}
                        {fluidBalance && (
                          <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                            fluidBalance > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                          }`}>
                            PD Balance: {fluidBalance > 0 ? '+' : ''}{fluidBalance} mL
                          </span>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {session.notes && (
                      <div className="bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-500 flex items-start gap-2 mt-2">
                        <ClipboardList size={12} className="flex-shrink-0 mt-0.5" />
                        {session.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}