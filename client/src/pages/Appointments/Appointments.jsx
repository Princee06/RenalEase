import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Menu, Plus,
  Clock, CheckCircle, Trash2, MapPin, Phone,
  AlertCircle, Calendar
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

const INITIAL_APPOINTMENTS = [
  { id: 1, doctor: 'Dr. Rajesh Kumar', specialty: 'Nephrologist', hospital: 'Apollo Hospital', date: '2026-05-28', time: '10:30 AM', type: 'Regular Checkup', status: 'Upcoming', phone: '+91 9876543210', notes: 'Bring latest lab reports' },
  { id: 2, doctor: 'Dr. Priya Sharma', specialty: 'Dietitian', hospital: 'KIMS Hospital', date: '2026-06-02', time: '2:00 PM', type: 'Diet Consultation', status: 'Upcoming', phone: '+91 9123456789', notes: '' },
  { id: 3, doctor: 'Dr. Rajesh Kumar', specialty: 'Nephrologist', hospital: 'Apollo Hospital', date: '2026-05-01', time: '10:30 AM', type: 'Regular Checkup', status: 'Completed', phone: '+91 9876543210', notes: 'Reviewed eGFR trends' },
  { id: 4, doctor: 'Dr. Suresh Reddy', specialty: 'Cardiologist', hospital: 'Yashoda Hospital', date: '2026-04-15', time: '11:00 AM', type: 'BP Monitoring', status: 'Completed', phone: '+91 9988776655', notes: 'BP medication adjusted' },
  { id: 5, doctor: 'Dr. Rajesh Kumar', specialty: 'Nephrologist', hospital: 'Apollo Hospital', date: '2026-04-01', time: '10:30 AM', type: 'Regular Checkup', status: 'Completed', phone: '+91 9876543210', notes: '' },
];

const APPOINTMENT_TYPES = [
  'Regular Checkup', 'Diet Consultation', 'BP Monitoring',
  'Lab Review', 'Dialysis Review', 'Emergency Visit', 'Follow-up', 'Other'
];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const apptDate = new Date(dateStr);
  apptDate.setHours(0, 0, 0, 0);
  const diff = Math.round((apptDate - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff > 0) return `In ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}

function formatTimeTo12Hr(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition bg-white";

export default function Appointments() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activePath, setActivePath] = useState('/appointments');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppt, setNewAppt] = useState({
    doctor: '', specialty: '', hospital: '',
    date: '', time: '', type: 'Regular Checkup',
    phone: '', notes: '',
  });

  const upcoming = appointments
    .filter((a) => a.status === 'Upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const completed = appointments
    .filter((a) => a.status === 'Completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const addAppointment = () => {
    if (!newAppt.doctor || !newAppt.date || !newAppt.time) return;

    const apptDate = new Date(newAppt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    apptDate.setHours(0, 0, 0, 0);
    const status = apptDate >= today ? 'Upcoming' : 'Completed';

    const formattedTime = formatTimeTo12Hr(newAppt.time);

    setAppointments([...appointments, {
      id: Date.now(),
      ...newAppt,
      time: formattedTime,
      status,
    }]);

    setNewAppt({
      doctor: '', specialty: '', hospital: '',
      date: '', time: '', type: 'Regular Checkup',
      phone: '', notes: '',
    });
    setShowAddForm(false);
  };

  const deleteAppointment = (id) => setAppointments(appointments.filter((a) => a.id !== id));

  const markCompleted = (id) => {
    setAppointments(appointments.map((a) =>
      a.id === id ? { ...a, status: 'Completed' } : a
    ));
  };

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
          <div
            className="flex flex-col items-center py-6 px-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-all"
            onClick={() => navigate('/profile')}
          >
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
      <main className="flex-1 overflow-y-auto">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-[#2E86AB] transition-colors">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#1A5276]">Appointments</h1>
              <p className="text-gray-400 text-xs">{upcoming.length} upcoming appointment{upcoming.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#2E86AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
              <Plus size={16} /> Book Appointment
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
              { label: 'Total Appointments', value: appointments.length, icon: CalendarDays, bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-500' },
              { label: 'Upcoming', value: upcoming.length, icon: Clock, bg: 'bg-orange-50', border: 'border-orange-200', color: 'text-orange-500' },
              { label: 'Completed', value: completed.length, icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', color: 'text-green-500' },
              { label: 'Next Appointment', value: upcoming.length > 0 ? getDaysUntil(upcoming[0].date) : 'None', icon: Calendar, bg: 'bg-purple-50', border: 'border-purple-200', color: 'text-purple-500' },
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

          {/* Next Appointment Banner */}
          {upcoming.length > 0 && (
            <div className="bg-gradient-to-r from-[#2E86AB] to-[#1A5276] rounded-2xl p-5 mb-6 shadow-lg">
              <p className="text-[#A8DADC] text-xs font-semibold uppercase tracking-widest mb-2">Next Appointment</p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Stethoscope size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{upcoming[0].doctor}</p>
                    <p className="text-white/70 text-sm">{upcoming[0].specialty} • {upcoming[0].hospital}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-white/60 text-xs">
                        <CalendarDays size={12} />
                        {new Date(upcoming[0].date).toLocaleDateString('en-IN', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-white/60 text-xs">
                        <Clock size={12} /> {upcoming[0].time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full">
                    {getDaysUntil(upcoming[0].date)}
                  </span>
                  {upcoming[0].notes && (
                    <p className="text-white/50 text-xs mt-2">{upcoming[0].notes}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add Appointment Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                <Plus size={18} className="text-[#2E86AB]" /> Book New Appointment
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Doctor's Name</label>
                  <input type="text" value={newAppt.doctor}
                    onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Kumar" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Specialty</label>
                  <input type="text" value={newAppt.specialty}
                    onChange={(e) => setNewAppt({ ...newAppt, specialty: e.target.value })}
                    placeholder="e.g. Nephrologist" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Hospital / Clinic</label>
                  <input type="text" value={newAppt.hospital}
                    onChange={(e) => setNewAppt({ ...newAppt, hospital: e.target.value })}
                    placeholder="e.g. Apollo Hospital" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Appointment Type</label>
                  <select value={newAppt.type}
                    onChange={(e) => setNewAppt({ ...newAppt, type: e.target.value })}
                    className={inputClass}>
                    {APPOINTMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Date</label>
                  <input type="date" value={newAppt.date}
                    onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Time</label>
                  <input type="time" value={newAppt.time}
                    onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Doctor's Phone (optional)</label>
                  <input type="tel" value={newAppt.phone}
                    onChange={(e) => setNewAppt({ ...newAppt, phone: e.target.value })}
                    placeholder="+91 9876543210" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Notes (optional)</label>
                  <input type="text" value={newAppt.notes}
                    onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })}
                    placeholder="e.g. Bring latest lab reports" className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={addAppointment}
                  className="bg-[#2E86AB] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
                  <CheckCircle size={16} /> Save Appointment
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
            {['upcoming', 'completed'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab ? 'bg-[#2E86AB] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}>
                {tab === 'upcoming'
                  ? <><Clock size={14} /> Upcoming</>
                  : <><CheckCircle size={14} /> Completed</>
                }
              </button>
            ))}
          </div>

          {/* Appointments List */}
          <div className="flex flex-col gap-4">
            {(activeTab === 'upcoming' ? upcoming : completed).length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                <CalendarDays size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No {activeTab} appointments</p>
                <p className="text-gray-300 text-sm mt-1">Click "Book Appointment" to add one</p>
              </div>
            ) : (
              (activeTab === 'upcoming' ? upcoming : completed).map((appt) => (
                <div key={appt.id} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md ${
                  activeTab === 'upcoming' ? 'border-blue-100' : 'border-gray-100'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        activeTab === 'upcoming' ? 'bg-blue-50' : 'bg-green-50'
                      }`}>
                        <Stethoscope size={22} className={activeTab === 'upcoming' ? 'text-[#2E86AB]' : 'text-green-500'} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-[#1A5276] text-sm">{appt.doctor}</p>
                          <span className="bg-[#EBF5FB] text-[#2E86AB] text-xs font-semibold px-2 py-0.5 rounded-full">
                            {appt.specialty}
                          </span>
                          <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {appt.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={11} /> {appt.hospital}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <CalendarDays size={11} />
                            {new Date(appt.date).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={11} /> {appt.time}
                          </span>
                          {appt.phone && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Phone size={11} /> {appt.phone}
                            </span>
                          )}
                        </div>
                        {appt.notes && (
                          <div className="mt-2 bg-yellow-50 rounded-lg px-3 py-1.5 flex items-center gap-2">
                            <AlertCircle size={11} className="text-yellow-500 flex-shrink-0" />
                            <p className="text-xs text-yellow-700">{appt.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {activeTab === 'upcoming' && (
                        <>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            getDaysUntil(appt.date) === 'Today'
                              ? 'bg-red-50 text-red-500'
                              : getDaysUntil(appt.date) === 'Tomorrow'
                              ? 'bg-orange-50 text-orange-500'
                              : 'bg-blue-50 text-blue-500'
                          }`}>
                            {getDaysUntil(appt.date)}
                          </span>
                          <button
                            onClick={() => markCompleted(appt.id)}
                            className="text-xs bg-green-50 text-green-600 font-semibold px-3 py-1 rounded-full hover:bg-green-100 transition-all flex items-center gap-1">
                            <CheckCircle size={12} /> Done
                          </button>
                        </>
                      )}
                      {activeTab === 'completed' && (
                        <span className="bg-green-50 text-green-500 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle size={10} /> Completed
                        </span>
                      )}
                      <button onClick={() => deleteAppointment(appt.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}