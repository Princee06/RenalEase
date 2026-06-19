import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Menu,
  BarChart2, TrendingUp, TrendingDown, Download, MessageSquare,
  FlaskConical, HeartPulse, Weight, Calendar
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend
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
  { icon: MessageSquare, label: 'AI Assistant', path: '/chatbot' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const EGFR_DATA = [
  { month: 'Jul', value: 38 },
  { month: 'Aug', value: 36 },
  { month: 'Sep', value: 35 },
  { month: 'Oct', value: 35 },
  { month: 'Nov', value: 32 },
  { month: 'Dec', value: 30 },
  { month: 'Jan', value: 29 },
  { month: 'Feb', value: 28 },
  { month: 'Mar', value: 28 },
  { month: 'Apr', value: 27 },
  { month: 'May', value: 27 },
  { month: 'Jun', value: 26 },
];

const BP_DATA = [
  { month: 'Jul', systolic: 128, diastolic: 80 },
  { month: 'Aug', systolic: 130, diastolic: 82 },
  { month: 'Sep', systolic: 132, diastolic: 83 },
  { month: 'Oct', systolic: 135, diastolic: 85 },
  { month: 'Nov', systolic: 138, diastolic: 86 },
  { month: 'Dec', systolic: 140, diastolic: 88 },
  { month: 'Jan', systolic: 138, diastolic: 86 },
  { month: 'Feb', systolic: 136, diastolic: 85 },
  { month: 'Mar', systolic: 138, diastolic: 88 },
  { month: 'Apr', systolic: 137, diastolic: 87 },
  { month: 'May', systolic: 136, diastolic: 86 },
  { month: 'Jun', systolic: 135, diastolic: 85 },
];

const WEIGHT_DATA = [
  { month: 'Jul', value: 70.2 },
  { month: 'Aug', value: 70.5 },
  { month: 'Sep', value: 69.8 },
  { month: 'Oct', value: 69.5 },
  { month: 'Nov', value: 69.2 },
  { month: 'Dec', value: 68.8 },
  { month: 'Jan', value: 68.5 },
  { month: 'Feb', value: 68.2 },
  { month: 'Mar', value: 68.5 },
  { month: 'Apr', value: 68.0 },
  { month: 'May', value: 67.8 },
  { month: 'Jun', value: 68.0 },
];

const DIALYSIS_DATA = [
  { month: 'Jan', sessions: 13, avgDuration: 240 },
  { month: 'Feb', sessions: 12, avgDuration: 235 },
  { month: 'Mar', sessions: 13, avgDuration: 240 },
  { month: 'Apr', sessions: 12, avgDuration: 238 },
  { month: 'May', sessions: 13, avgDuration: 240 },
  { month: 'Jun', sessions: 12, avgDuration: 236 },
];

const LAB_TRENDS = [
  { month: 'Jan', creatinine: 4.5, potassium: 5.3, phosphorus: 6.1 },
  { month: 'Feb', creatinine: 4.3, potassium: 5.2, phosphorus: 5.9 },
  { month: 'Mar', creatinine: 4.4, potassium: 5.1, phosphorus: 5.8 },
  { month: 'Apr', creatinine: 4.2, potassium: 5.1, phosphorus: 5.8 },
  { month: 'May', creatinine: 4.1, potassium: 5.0, phosphorus: 5.6 },
  { month: 'Jun', creatinine: 4.2, potassium: 5.1, phosphorus: 5.7 },
];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function TrendBadge({ current, previous, unit, reverse }) {
  const diff = current - previous;
  const isGood = reverse ? diff < 0 : diff > 0;
  const isNeutral = diff === 0;
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
      isNeutral ? 'bg-gray-100 text-gray-500' :
      isGood ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
    }`}>
      {diff > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {Math.abs(diff).toFixed(1)} {unit}
    </span>
  );
}

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activePath, setActivePath] = useState('/analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('12months');

  const handleDownload = () => {
    const report = `
RenalEase Health Report
========================
Patient: ${user.fullName || 'N/A'}
CKD Stage: ${user.ckdStage || 'N/A'}
Dialysis: ${user.dialysis === 'yes' ? user.dialysisType || 'Yes' : 'No'}
Generated: ${new Date().toLocaleDateString('en-IN')}

eGFR TREND (Last 12 Months)
----------------------------
${EGFR_DATA.map((d) => `${d.month}: ${d.value} mL/min`).join('\n')}

BLOOD PRESSURE TREND
----------------------------
${BP_DATA.map((d) => `${d.month}: ${d.systolic}/${d.diastolic} mmHg`).join('\n')}

WEIGHT TREND
----------------------------
${WEIGHT_DATA.map((d) => `${d.month}: ${d.value} kg`).join('\n')}

DIALYSIS SESSIONS
----------------------------
${DIALYSIS_DATA.map((d) => `${d.month}: ${d.sessions} sessions, avg ${d.avgDuration} min`).join('\n')}

LAB TRENDS
----------------------------
${LAB_TRENDS.map((d) => `${d.month}: Creatinine ${d.creatinine}, Potassium ${d.potassium}, Phosphorus ${d.phosphorus}`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RenalEase_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
      <main className="flex-1 overflow-y-auto">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-[#2E86AB] transition-colors">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#1A5276]">Analytics & Reports</h1>
              <p className="text-gray-400 text-xs">Track your health trends over time</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownload}
              className="bg-[#2E86AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
              <Download size={16} /> Download Report
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
              {
                label: 'Current eGFR', value: '26', unit: 'mL/min',
                icon: FlaskConical, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200',
                trend: <TrendBadge current={26} previous={38} unit="mL/min" reverse={false} />,
              },
              {
                label: 'Blood Pressure', value: '135/85', unit: 'mmHg',
                icon: HeartPulse, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200',
                trend: <TrendBadge current={135} previous={128} unit="mmHg" reverse={true} />,
              },
              {
                label: 'Current Weight', value: '68.0', unit: 'kg',
                icon: Weight, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200',
                trend: <TrendBadge current={68.0} previous={70.2} unit="kg" reverse={true} />,
              },
              {
                label: 'Dialysis Sessions', value: '75', unit: 'total',
                icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200',
                trend: <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500">6 months</span>,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={`bg-white border ${card.border} rounded-2xl p-4 shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={22} className={card.color} />
                    {card.trend}
                  </div>
                  <p className="text-gray-500 text-xs font-medium mb-1">{card.label}</p>
                  <p className="text-gray-800 text-xl font-bold">{card.value}
                    <span className="text-gray-400 text-xs font-normal ml-1">{card.unit}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart2 },
              { key: 'labs', label: 'Lab Trends', icon: FlaskConical },
              { key: 'dialysis', label: 'Dialysis Stats', icon: Droplets },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === tab.key ? 'bg-[#2E86AB] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                  }`}>
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">

              {/* eGFR Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1A5276] flex items-center gap-2">
                    <FlaskConical size={18} className="text-[#2E86AB]" /> eGFR Progression
                  </h3>
                  <span className="text-xs text-gray-400">Last 12 months</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={EGFR_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 60]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <ReferenceLine y={15} stroke="#E74C3C" strokeDasharray="4 4" label={{ value: 'Stage 5', fill: '#E74C3C', fontSize: 11 }} />
                    <ReferenceLine y={30} stroke="#F39C12" strokeDasharray="4 4" label={{ value: 'Stage 4', fill: '#F39C12', fontSize: 11 }} />
                    <Line type="monotone" dataKey="value" stroke="#2E86AB" strokeWidth={3} dot={{ fill: '#2E86AB', r: 4 }} activeDot={{ r: 6 }} name="eGFR" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* BP Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1A5276] flex items-center gap-2">
                    <HeartPulse size={18} className="text-[#2E86AB]" /> Blood Pressure Trend
                  </h3>
                  <span className="text-xs text-gray-400">Last 12 months</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={BP_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis domain={[60, 160]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" stroke="#E74C3C" strokeWidth={3} dot={{ fill: '#E74C3C', r: 4 }} name="Systolic" />
                    <Line type="monotone" dataKey="diastolic" stroke="#2E86AB" strokeWidth={3} dot={{ fill: '#2E86AB', r: 4 }} name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Weight Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#1A5276] flex items-center gap-2">
                    <Weight size={18} className="text-[#2E86AB]" /> Weight Trend
                  </h3>
                  <span className="text-xs text-gray-400">Last 12 months</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={WEIGHT_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis domain={[65, 75]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#1A7A4A" strokeWidth={3} dot={{ fill: '#1A7A4A', r: 4 }} name="Weight (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}

          {/* LAB TRENDS TAB */}
          {activeTab === 'labs' && (
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                  <FlaskConical size={18} className="text-[#2E86AB]" /> Lab Values Over Time
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={LAB_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="creatinine" stroke="#E74C3C" strokeWidth={2} dot={{ r: 4 }} name="Creatinine (mg/dL)" />
                    <Line type="monotone" dataKey="potassium" stroke="#F39C12" strokeWidth={2} dot={{ r: 4 }} name="Potassium (mEq/L)" />
                    <Line type="monotone" dataKey="phosphorus" stroke="#9B59B6" strokeWidth={2} dot={{ r: 4 }} name="Phosphorus (mg/dL)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Lab Summary Table */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#1A5276] mb-4">Latest vs Previous Lab Values</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Test', 'Previous', 'Current', 'Change', 'Status'].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { test: 'Creatinine', prev: '4.3', curr: '4.2', unit: 'mg/dL', good: true },
                      { test: 'Potassium', prev: '5.0', curr: '5.1', unit: 'mEq/L', good: false },
                      { test: 'Phosphorus', prev: '5.9', curr: '5.7', unit: 'mg/dL', good: true },
                      { test: 'Hemoglobin', prev: '10.0', curr: '10.2', unit: 'g/dL', good: true },
                      { test: 'PTH', prev: '340', curr: '320', unit: 'pg/mL', good: true },
                    ].map((row, idx) => (
                      <tr key={row.test} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F9FBFD]'}`}>
                        <td className="py-3 text-sm font-semibold text-gray-700">{row.test}</td>
                        <td className="py-3 text-sm text-gray-500">{row.prev} {row.unit}</td>
                        <td className="py-3 text-sm font-semibold text-gray-700">{row.curr} {row.unit}</td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                            row.good ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                          }`}>
                            {row.good ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                            {row.good ? 'Improved' : 'Worsened'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            row.good ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                          }`}>
                            {row.good ? 'Good' : 'Monitor'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DIALYSIS STATS TAB */}
          {activeTab === 'dialysis' && (
            <div className="flex flex-col gap-6">

              {/* Sessions per month */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                  <Droplets size={18} className="text-[#2E86AB]" /> Dialysis Sessions per Month
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={DIALYSIS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#2E86AB" radius={[6, 6, 0, 0]} name="Sessions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Dialysis Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Sessions', value: '75', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
                  { label: 'Avg Sessions/Month', value: '12.5', icon: BarChart2, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
                  { label: 'Avg Duration', value: '238 min', icon: Activity, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
                  { label: 'Total Hours', value: '297 hrs', icon: Droplets, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className={`bg-white border ${card.border} rounded-2xl p-4 shadow-sm`}>
                      <Icon size={22} className={`${card.color} mb-2`} />
                      <p className="text-gray-500 text-xs font-medium">{card.label}</p>
                      <p className="text-gray-800 text-xl font-bold mt-1">{card.value}</p>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}