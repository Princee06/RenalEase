import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Menu, Plus,
  AlertTriangle, Clock, Trash2, CheckCircle, Sunrise, Sun, Sunset, Moon
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

const INITIAL_MEDS = [
  { id: 1, name: 'Nicardia XL 30', dose: '30mg', times: ['Morning'], specificTime: '08:00', mealInstruction: 'After food', frequency: 'Daily', taken: false, refillDays: 5, purpose: 'Blood Pressure' },
  { id: 2, name: 'Sodium Bicarbonate', dose: '500mg', times: ['Afternoon'], specificTime: '13:00', mealInstruction: 'After food', frequency: 'Daily', taken: false, refillDays: 12, purpose: 'Acidosis Control' },
  { id: 3, name: 'Rocaltrol', dose: '0.25mcg', times: ['Morning', 'Evening'], specificTime: '', mealInstruction: 'With food', frequency: 'Daily', taken: false, refillDays: 20, purpose: 'Vitamin D' },
  { id: 4, name: 'Eprex 4000', dose: '4000 IU', times: ['Morning'], specificTime: '09:00', mealInstruction: 'Before food', frequency: '3x/week', taken: true, refillDays: 8, purpose: 'Anemia' },
  { id: 5, name: 'Ferium XT', dose: '325mg', times: ['Night'], specificTime: '21:00', mealInstruction: 'After food', frequency: 'Daily', taken: false, refillDays: 3, purpose: 'Iron Deficiency' },
  { id: 6, name: 'Renvela 800', dose: '800mg', times: ['Morning', 'Afternoon', 'Evening'], specificTime: '', mealInstruction: 'With meals', frequency: 'With meals', taken: false, refillDays: 15, purpose: 'Phosphorus Control' },
];

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];
const TIME_ICONS_LUCIDE = { Morning: Sunrise, Afternoon: Sun, Evening: Sunset, Night: Moon };function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatTime(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

export default function Medications() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activePath, setActivePath] = useState('/medications');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [meds, setMeds] = useState(INITIAL_MEDS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const [newMed, setNewMed] = useState({
    name: '', dose: '', times: [], specificTime: '',
    mealInstruction: 'After food', frequency: 'Daily', purpose: '',
  });

  const toggleTaken = (id) => setMeds(meds.map((m) => m.id === id ? { ...m, taken: !m.taken } : m));

  const toggleTime = (slot) => {
    setNewMed((prev) => ({
      ...prev,
      times: prev.times.includes(slot)
        ? prev.times.filter((t) => t !== slot)
        : [...prev.times, slot],
    }));
  };

  const addMedication = () => {
    if (!newMed.name || !newMed.dose || newMed.times.length === 0) return;
    setMeds([...meds, { id: Date.now(), ...newMed, taken: false, refillDays: 30 }]);
    setNewMed({ name: '', dose: '', times: [], specificTime: '', mealInstruction: 'After food', frequency: 'Daily', purpose: '' });
    setShowAddForm(false);
  };

  const deleteMed = (id) => setMeds(meds.filter((m) => m.id !== id));

  const takenCount = meds.filter((m) => m.taken).length;
  const lowRefill = meds.filter((m) => m.refillDays <= 7);

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition bg-white";

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
            <p className="text-white/50 text-xs">Medication Tracker</p>
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
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-[#2E86AB] transition-colors">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#1A5276]">Medication Tracker</h1>
              <p className="text-gray-400 text-xs">{takenCount} of {meds.length} taken today</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#2E86AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
              <Plus size={16} /> Add Medication
            </button>
            <div className="w-9 h-9 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276]">
              {getInitials(user.fullName)}
            </div>
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Medications', value: meds.length, icon: Pill, bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-500' },
              { label: 'Taken Today', value: takenCount, icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', color: 'text-green-500' },
              { label: 'Remaining', value: meds.length - takenCount, icon: Clock, bg: 'bg-orange-50', border: 'border-orange-200', color: 'text-orange-500' },
              { label: 'Low Refill', value: lowRefill.length, icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-200', color: 'text-red-500' },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={`bg-white border ${card.border} rounded-2xl p-4 shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={22} className={card.color} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.bg} ${card.color}`}>{card.value}</span>
                  </div>
                  <p className="text-gray-500 text-xs font-medium">{card.label}</p>
                </div>
              );
            })}
          </div>

          {/* Refill Alert */}
          {lowRefill.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <AlertTriangle size={22} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-600 font-semibold text-sm">Refill Alert!</p>
                <p className="text-red-400 text-xs">
                  {lowRefill.map((m) => `${m.name} (${m.refillDays} days left)`).join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Add Medication Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                <Plus size={18} className="text-[#2E86AB]" /> Add New Medication
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Medication Name</label>
                  <input type="text" value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    placeholder="e.g. Nicardia XL 30" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Dosage</label>
                  <input type="text" value={newMed.dose}
                    onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
                    placeholder="e.g. 30mg" className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Time of Day <span className="text-gray-400 normal-case font-normal">(select all that apply)</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {TIME_SLOTS.map((slot) => (
                      <button key={slot} onClick={() => toggleTime(slot)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          newMed.times.includes(slot)
                            ? 'bg-[#2E86AB] text-white border-[#2E86AB]'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-[#2E86AB]'
                        }`}>
                        {(() => { const I = TIME_ICONS_LUCIDE[slot]; return <I size={14} />; })()} {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Specific Time <span className="text-gray-400 normal-case font-normal">(optional)</span>
                  </label>
                  <input type="time" value={newMed.specificTime}
                    onChange={(e) => setNewMed({ ...newMed, specificTime: e.target.value })}
                    className={inputClass} />
                  <p className="text-gray-400 text-xs mt-1">e.g. set 14:00 if prescribed at 2:00 PM</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Meal Instruction</label>
                  <select value={newMed.mealInstruction}
                    onChange={(e) => setNewMed({ ...newMed, mealInstruction: e.target.value })}
                    className={inputClass}>
                    <option>Before food</option>
                    <option>After food</option>
                    <option>With food</option>
                    <option>Empty stomach</option>
                    <option>No restriction</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Frequency</label>
                  <select value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                    className={inputClass}>
                    {['Daily', 'Twice daily', '3x/week', 'Weekly', 'With meals', 'As needed'].map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Purpose (optional)</label>
                  <input type="text" value={newMed.purpose}
                    onChange={(e) => setNewMed({ ...newMed, purpose: e.target.value })}
                    placeholder="e.g. Blood Pressure Control" className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={addMedication}
                  className="bg-[#2E86AB] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
                  <CheckCircle size={16} /> Save Medication
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
            {['schedule', 'all'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab ? 'bg-[#2E86AB] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}>
                {tab === 'schedule' ? <><Clock size={14} /> By Schedule</> : <><Pill size={14} /> All Medications</>}
              </button>
            ))}
          </div>

          {/* Schedule View */}
          {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {TIME_SLOTS.map((slot) => {
                const slotMeds = meds.filter((m) => m.times.includes(slot));
                return (
                  <div key={slot} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
  <div className="flex items-center gap-2 mb-4">
    {(() => { const SlotIcon = TIME_ICONS_LUCIDE[slot]; return <SlotIcon size={18} className="text-[#2E86AB]" />; })()}
    <h3 className="font-bold text-[#1A5276] text-sm">{slot}</h3>
    <span className="ml-auto text-xs text-gray-400">{slotMeds.length} med{slotMeds.length !== 1 ? 's' : ''}</span>
  </div>
                    {slotMeds.length === 0 ? (
                      <p className="text-gray-300 text-sm text-center py-4">No medications</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {slotMeds.map((med) => (
                          <div key={med.id} className={`flex items-center justify-between p-3 rounded-xl transition-all ${med.taken ? 'bg-green-50' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                              <button onClick={() => toggleTaken(med.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 ${
                                  med.taken
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'bg-white border-gray-300 hover:border-[#2E86AB]'
                                }`}>
                                {med.taken && <CheckCircle size={14} />}
                              </button>
                              <div>
                                <p className={`text-sm font-semibold ${med.taken ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                  {med.name}
                                </p>
                                <p className="text-xs text-gray-400">{med.dose} • {med.frequency} • {med.mealInstruction}</p>
                                {med.specificTime && (
                                  <p className="text-xs text-[#2E86AB] font-medium flex items-center gap-1">
                                    <Clock size={10} /> {formatTime(med.specificTime)}
                                  </p>
                                )}
                              </div>
                            </div>
                            {med.refillDays <= 7 && (
                              <span className="text-xs bg-red-50 text-red-500 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertTriangle size={10} /> {med.refillDays}d
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* All Medications View */}
          {activeTab === 'all' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F4F9FF]">
                    {['Medication', 'Dosage', 'Time', 'Specific Time', 'Meal', 'Frequency', 'Purpose', 'Refill', 'Status', ''].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {meds.map((med, idx) => (
                    <tr key={med.id} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F9FBFD]'}`}>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-700">{med.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{med.dose}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {med.times.map((t) => (
                            <span key={t} className="bg-[#EBF5FB] text-[#2E86AB] text-xs font-semibold px-2 py-0.5 rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {med.specificTime ? formatTime(med.specificTime) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{med.mealInstruction}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{med.frequency}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{med.purpose || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          med.refillDays <= 7 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                        }`}>{med.refillDays}d</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleTaken(med.id)}
                          className={`text-xs font-semibold px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                            med.taken
                              ? 'bg-green-100 text-green-600'
                              : 'bg-[#EBF5FB] text-[#2E86AB] hover:bg-[#2E86AB] hover:text-white'
                          }`}>
                          <CheckCircle size={12} />
                          {med.taken ? 'Taken' : 'Mark Taken'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteMed(med.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}