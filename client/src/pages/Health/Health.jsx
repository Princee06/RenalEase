import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Bell, Menu,
  FlaskConical, HeartPulse, Weight, Plus, ChevronRight, CheckCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

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

const eGFR_DATA = [
  { month: 'Oct', value: 35 },
  { month: 'Nov', value: 32 },
  { month: 'Dec', value: 30 },
  { month: 'Jan', value: 29 },
  { month: 'Feb', value: 28 },
  { month: 'Mar', value: 28 },
  { month: 'Apr', value: 27 },
];

const BP_DATA = [
  { month: 'Oct', systolic: 130, diastolic: 82 },
  { month: 'Nov', systolic: 135, diastolic: 85 },
  { month: 'Dec', systolic: 140, diastolic: 88 },
  { month: 'Jan', systolic: 138, diastolic: 86 },
  { month: 'Feb', systolic: 136, diastolic: 85 },
  { month: 'Mar', systolic: 138, diastolic: 88 },
  { month: 'Apr', systolic: 137, diastolic: 87 },
];

const LAB_RESULTS = [
  { category: 'Kidney Function', test: 'eGFR', value: '27', unit: 'mL/min', normal: '≥60', status: 'Low' },
  { category: 'Kidney Function', test: 'Creatinine', value: '4.2', unit: 'mg/dL', normal: '0.7–1.3', status: 'High' },
  { category: 'Kidney Function', test: 'BUN (Blood Urea Nitrogen)', value: '45', unit: 'mg/dL', normal: '7–20', status: 'High' },
  { category: 'Kidney Function', test: 'Uric Acid', value: '7.8', unit: 'mg/dL', normal: '3.5–7.2', status: 'High' },
  { category: 'Kidney Function', test: 'Albumin-Creatinine Ratio (ACR)', value: '320', unit: 'mg/g', normal: '<30', status: 'High' },
  { category: 'Electrolytes', test: 'Potassium', value: '5.1', unit: 'mEq/L', normal: '3.5–5.0', status: 'High' },
  { category: 'Electrolytes', test: 'Sodium', value: '138', unit: 'mEq/L', normal: '136–145', status: 'Normal' },
  { category: 'Electrolytes', test: 'Bicarbonate', value: '18', unit: 'mEq/L', normal: '22–29', status: 'Low' },
  { category: 'Electrolytes', test: 'Calcium', value: '9.1', unit: 'mg/dL', normal: '8.5–10.5', status: 'Normal' },
  { category: 'Electrolytes', test: 'Phosphorus', value: '5.8', unit: 'mg/dL', normal: '2.5–4.5', status: 'High' },
  { category: 'Electrolytes', test: 'Magnesium', value: '2.1', unit: 'mg/dL', normal: '1.7–2.3', status: 'Normal' },
  { category: 'CBC', test: 'Hemoglobin', value: '10.2', unit: 'g/dL', normal: '12–17', status: 'Low' },
  { category: 'CBC', test: 'Hematocrit', value: '31', unit: '%', normal: '36–50', status: 'Low' },
  { category: 'CBC', test: 'RBC Count', value: '3.2', unit: 'million/µL', normal: '4.5–5.5', status: 'Low' },
  { category: 'CBC', test: 'WBC Count', value: '7.2', unit: 'K/µL', normal: '4.5–11.0', status: 'Normal' },
  { category: 'CBC', test: 'Platelets', value: '210', unit: 'K/µL', normal: '150–400', status: 'Normal' },
  { category: 'Iron Studies', test: 'Serum Iron', value: '55', unit: 'µg/dL', normal: '60–170', status: 'Low' },
  { category: 'Iron Studies', test: 'Ferritin', value: '42', unit: 'ng/mL', normal: '100–500 (CKD)', status: 'Low' },
  { category: 'Iron Studies', test: 'Transferrin Saturation', value: '18', unit: '%', normal: '20–50', status: 'Low' },
  { category: 'Bone & Hormones', test: 'Parathyroid Hormone (PTH)', value: '320', unit: 'pg/mL', normal: '10–65', status: 'High' },
  { category: 'Bone & Hormones', test: 'Vitamin D (25-OH)', value: '14', unit: 'ng/mL', normal: '30–100', status: 'Low' },
  { category: 'Lipid Panel', test: 'Total Cholesterol', value: '210', unit: 'mg/dL', normal: '<200', status: 'High' },
  { category: 'Lipid Panel', test: 'LDL Cholesterol', value: '128', unit: 'mg/dL', normal: '<100', status: 'High' },
  { category: 'Lipid Panel', test: 'HDL Cholesterol', value: '38', unit: 'mg/dL', normal: '>40', status: 'Low' },
  { category: 'Lipid Panel', test: 'Triglycerides', value: '185', unit: 'mg/dL', normal: '<150', status: 'High' },
  { category: 'Blood Sugar', test: 'Fasting Blood Sugar', value: '108', unit: 'mg/dL', normal: '70–100', status: 'High' },
  { category: 'Blood Sugar', test: 'HbA1c', value: '6.2', unit: '%', normal: '<5.7', status: 'High' },
  { category: 'Liver & Protein', test: 'Albumin', value: '3.8', unit: 'g/dL', normal: '3.5–5.0', status: 'Normal' },
  { category: 'Liver & Protein', test: 'ALT', value: '28', unit: 'U/L', normal: '7–56', status: 'Normal' },
  { category: 'Liver & Protein', test: 'AST', value: '24', unit: 'U/L', normal: '10–40', status: 'Normal' },
  { category: 'Liver & Protein', test: 'Total Protein', value: '6.8', unit: 'g/dL', normal: '6.3–8.2', status: 'Normal' },
  { category: 'Coagulation', test: 'PT (Prothrombin Time)', value: '12.5', unit: 'seconds', normal: '11–13.5', status: 'Normal' },
  { category: 'Coagulation', test: 'INR', value: '1.1', unit: '', normal: '0.8–1.2', status: 'Normal' },
  { category: 'Urine', test: 'Urine Output', value: '800', unit: 'mL/day', normal: '800–2000', status: 'Normal' },
  { category: 'Urine', test: 'Urine Protein', value: '420', unit: 'mg/day', normal: '<150', status: 'High' },
];

const VITALS = [
  { label: 'eGFR', value: '27', unit: 'mL/min', status: 'Low', icon: FlaskConical, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  { label: 'Blood Pressure', value: '137/87', unit: 'mmHg', status: 'High', icon: HeartPulse, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  { label: 'Weight', value: '68', unit: 'kg', status: 'Stable', icon: Weight, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
  { label: 'Fluid Intake', value: '1.2', unit: 'L today', status: 'On Track', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition";

export default function Health() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activePath, setActivePath] = useState('/health');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChart, setActiveChart] = useState('egfr');
  const [showAddReading, setShowAddReading] = useState(false);
  const [newReading, setNewReading] = useState({
    egfr: '', systolic: '', diastolic: '', weight: '', fluidIntake: '', date: '',
  });

  const handleSaveReading = () => {
    // Will connect to backend in Phase 3
    setNewReading({ egfr: '', systolic: '', diastolic: '', weight: '', fluidIntake: '', date: '' });
    setShowAddReading(false);
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
          <div className="flex flex-col items-center py-6 px-4 border-b border-white/10">
            <div className="w-16 h-16 rounded-full bg-[#A8DADC] flex items-center justify-center text-xl font-bold text-[#1A5276] mb-2 shadow-lg">
              {getInitials(user.fullName)}
            </div>
            <p className="text-white font-semibold text-sm">{user.fullName || 'Your Name'}</p>
            <p className="text-white/50 text-xs">Health Monitor</p>
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
              <h1 className="text-lg font-bold text-[#1A5276]">Health Monitor</h1>
              <p className="text-gray-400 text-xs">Track your vitals and lab results</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddReading(!showAddReading)}
              className="bg-[#2E86AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
              <Plus size={16} /> Add Reading
            </button>
            <div className="w-9 h-9 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276]">
              {getInitials(user.fullName)}
            </div>
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Vitals Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {VITALS.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.label} className={`bg-white border ${v.border} rounded-2xl p-4 shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={22} className={v.color} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v.bg} ${v.color}`}>{v.status}</span>
                  </div>
                  <p className="text-gray-500 text-xs font-medium mb-1">{v.label}</p>
                  <p className="text-gray-800 text-xl font-bold">{v.value}
                    <span className="text-gray-400 text-xs font-normal ml-1">{v.unit}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Add Reading Form */}
          {showAddReading && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                <Plus size={18} className="text-[#2E86AB]" /> Add New Reading
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    eGFR <span className="text-gray-400 normal-case font-normal">(mL/min)</span>
                  </label>
                  <input type="number" value={newReading.egfr}
                    onChange={(e) => setNewReading({ ...newReading, egfr: e.target.value })}
                    placeholder="e.g. 27" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Systolic BP <span className="text-gray-400 normal-case font-normal">(mmHg)</span>
                  </label>
                  <input type="number" value={newReading.systolic}
                    onChange={(e) => setNewReading({ ...newReading, systolic: e.target.value })}
                    placeholder="e.g. 138" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Diastolic BP <span className="text-gray-400 normal-case font-normal">(mmHg)</span>
                  </label>
                  <input type="number" value={newReading.diastolic}
                    onChange={(e) => setNewReading({ ...newReading, diastolic: e.target.value })}
                    placeholder="e.g. 88" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Weight <span className="text-gray-400 normal-case font-normal">(kg)</span>
                  </label>
                  <input type="number" value={newReading.weight}
                    onChange={(e) => setNewReading({ ...newReading, weight: e.target.value })}
                    placeholder="e.g. 68" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Fluid Intake <span className="text-gray-400 normal-case font-normal">(Litres)</span>
                  </label>
                  <input type="number" step="0.1" value={newReading.fluidIntake}
                    onChange={(e) => setNewReading({ ...newReading, fluidIntake: e.target.value })}
                    placeholder="e.g. 1.2" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Date of Reading
                  </label>
                  <input type="date" value={newReading.date}
                    onChange={(e) => setNewReading({ ...newReading, date: e.target.value })}
                    className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleSaveReading}
                  className="bg-[#2E86AB] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
                  <CheckCircle size={16} /> Save Reading
                </button>
                <button onClick={() => setShowAddReading(false)}
                  className="border border-gray-200 text-gray-500 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A5276] flex items-center gap-2">
                <Activity size={18} className="text-[#2E86AB]" /> Trends Over Time
              </h3>
              <div className="flex gap-2">
                {['egfr', 'bp'].map((chart) => (
                  <button key={chart} onClick={() => setActiveChart(chart)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeChart === chart ? 'bg-[#2E86AB] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    {chart === 'egfr' ? 'eGFR' : 'Blood Pressure'}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              {activeChart === 'egfr' ? (
                <LineChart data={eGFR_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 60]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <ReferenceLine y={15} stroke="#E74C3C" strokeDasharray="4 4" label={{ value: 'Stage 5', fill: '#E74C3C', fontSize: 11 }} />
                  <ReferenceLine y={30} stroke="#F39C12" strokeDasharray="4 4" label={{ value: 'Stage 4', fill: '#F39C12', fontSize: 11 }} />
                  <Line type="monotone" dataKey="value" stroke="#2E86AB" strokeWidth={3} dot={{ fill: '#2E86AB', r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              ) : (
                <LineChart data={BP_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[60, 160]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="systolic" stroke="#E74C3C" strokeWidth={3} dot={{ fill: '#E74C3C', r: 5 }} name="Systolic" />
                  <Line type="monotone" dataKey="diastolic" stroke="#2E86AB" strokeWidth={3} dot={{ fill: '#2E86AB', r: 5 }} name="Diastolic" />
                </LineChart>
              )}
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {activeChart === 'egfr' ? (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-4 h-0.5 bg-[#2E86AB]" />
                  <span>eGFR (mL/min)</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-4 h-0.5 bg-red-500" />
                    <span>Systolic</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-4 h-0.5 bg-[#2E86AB]" />
                    <span>Diastolic</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Lab Results */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A5276] flex items-center gap-2">
                <FlaskConical size={18} className="text-[#2E86AB]" /> Latest Lab Results
              </h3>
              <p className="text-gray-400 text-xs">Last updated: April 1, 2026</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Test', 'Result', 'Normal Range', 'Status'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    LAB_RESULTS.reduce((acc, lab) => {
                      if (!acc[lab.category]) acc[lab.category] = [];
                      acc[lab.category].push(lab);
                      return acc;
                    }, {})
                  ).map(([category, labs]) => (
                    <React.Fragment key={category}>
                      <tr>
                        <td colSpan={4} className="pt-4 pb-2">
                          <span className="text-xs font-bold text-[#2E86AB] uppercase tracking-widest">{category}</span>
                        </td>
                      </tr>
                      {labs.map((lab, idx) => (
                        <tr key={lab.test} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F9FBFD]'}`}>
                          <td className="py-3 text-sm font-semibold text-gray-700 pl-2">{lab.test}</td>
                          <td className="py-3 text-sm text-gray-700">{lab.value} <span className="text-gray-400 text-xs">{lab.unit}</span></td>
                          <td className="py-3 text-sm text-gray-400">{lab.normal}</td>
                          <td className="py-3">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              lab.status === 'High' ? 'bg-red-50 text-red-500' :
                              lab.status === 'Low' ? 'bg-orange-50 text-orange-500' :
                              'bg-green-50 text-green-500'
                            }`}>{lab.status}</span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}