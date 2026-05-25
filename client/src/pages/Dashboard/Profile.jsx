import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Menu,
  User, Phone, MapPin, Calendar, Heart, FlaskConical,
  AlertCircle, Edit3, CheckCircle, X
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

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function calculateAge(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition bg-white";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [activePath, setActivePath] = useState('/profile');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const age = calculateAge(user.dob);

  const ckdLabel = user.ckdStage
    ? user.ckdStage.replace('stage', 'Stage ').replace('undiagnosed', 'Not Diagnosed')
    : 'Not Set';

  const dialysisLabel = user.dialysis === 'yes'
    ? user.dialysisType === 'peritoneal' ? 'Peritoneal Dialysis' : 'Hemodialysis'
    : 'Not on Dialysis';

  const handleSave = () => {
    updateUser(editForm);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...user });
    setEditing(false);
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
              <h1 className="text-lg font-bold text-[#1A5276]">Patient Profile</h1>
              <p className="text-gray-400 text-xs">View and manage your health profile</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-[#2E86AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
                <Edit3 size={16} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave}
                  className="bg-[#2E86AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
                  <CheckCircle size={16} /> Save
                </button>
                <button onClick={handleCancel}
                  className="border border-gray-200 text-gray-500 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                  <X size={16} /> Cancel
                </button>
              </div>
            )}
            <div className="w-9 h-9 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276]">
              {getInitials(user.fullName)}
            </div>
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Profile Header Card */}
          <div className="bg-gradient-to-r from-[#2E86AB] to-[#1A5276] rounded-2xl p-6 mb-6 shadow-lg flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white shadow-lg flex-shrink-0">
              {getInitials(user.fullName)}
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold">{user.fullName || 'Your Name'}</h2>
              <p className="text-[#A8DADC] text-sm mt-1">
                {age ? `${age} years old` : ''} {age && user.gender ? '•' : ''} {user.gender || ''}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {ckdLabel}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  user.dialysis === 'yes'
                    ? 'bg-red-400/30 text-red-100'
                    : 'bg-white/20 text-white'
                }`}>
                  {dialysisLabel}
                </span>
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                  {user.role || 'Patient'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                <User size={18} className="text-[#2E86AB]" /> Personal Information
              </h3>
              <div className="flex flex-col gap-4">
                {editing ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Full Name</label>
                      <input type="text" value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Date of Birth</label>
                      <input type="date" value={editForm.dob}
                        onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Gender</label>
                      <select value={editForm.gender}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        className={inputClass}>
                        <option value="">Select gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Phone Number</label>
                      <input type="tel" value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">City / Location</label>
                      <input type="text" value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email</label>
                      <input type="email" value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className={inputClass} />
                    </div>
                  </>
                ) : (
                  <>
                    {[
                      { icon: User, label: 'Full Name', value: user.fullName },
                      { icon: Calendar, label: 'Date of Birth', value: user.dob ? `${new Date(user.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} (${age} years)` : null },
                      { icon: User, label: 'Gender', value: user.gender },
                      { icon: Phone, label: 'Phone', value: user.phone },
                      { icon: MapPin, label: 'Location', value: user.address },
                      { icon: User, label: 'Email', value: user.email },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EBF5FB] flex items-center justify-center flex-shrink-0">
                            <Icon size={14} className="text-[#2E86AB]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-700">{item.value || '—'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                <Heart size={18} className="text-[#2E86AB]" /> Medical Information
              </h3>
              <div className="flex flex-col gap-4">
                {editing ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">CKD Stage</label>
                      <select value={editForm.ckdStage}
                        onChange={(e) => setEditForm({ ...editForm, ckdStage: e.target.value })}
                        className={inputClass}>
                        <option value="">Select CKD Stage</option>
                        <option value="stage1">Stage 1 — Kidney damage, normal function</option>
                        <option value="stage2">Stage 2 — Mild loss of function</option>
                        <option value="stage3">Stage 3 — Mild to moderate loss</option>
                        <option value="stage4">Stage 4 — Severe loss of function</option>
                        <option value="stage5">Stage 5 — Kidney failure / Dialysis</option>
                        <option value="undiagnosed">Not Diagnosed Yet</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">On Dialysis?</label>
                      <select value={editForm.dialysis}
                        onChange={(e) => setEditForm({ ...editForm, dialysis: e.target.value })}
                        className={inputClass}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    {editForm.dialysis === 'yes' && (
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Dialysis Type</label>
                        <select value={editForm.dialysisType}
                          onChange={(e) => setEditForm({ ...editForm, dialysisType: e.target.value })}
                          className={inputClass}>
                          <option value="hemodialysis">Hemodialysis</option>
                          <option value="peritoneal">Peritoneal Dialysis</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Known Allergies</label>
                      <input type="text" value={editForm.allergies}
                        onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                        placeholder="e.g. Penicillin" className={inputClass} />
                    </div>
                  </>
                ) : (
                  <>
                    {[
                      { icon: FlaskConical, label: 'CKD Stage', value: ckdLabel },
                      { icon: Droplets, label: 'Dialysis Status', value: dialysisLabel },
                      { icon: AlertCircle, label: 'Known Allergies', value: user.allergies || 'None reported' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EBF5FB] flex items-center justify-center flex-shrink-0">
                            <Icon size={14} className="text-[#2E86AB]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-700">{item.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                <Stethoscope size={18} className="text-[#2E86AB]" /> Doctor Information
              </h3>
              <div className="flex flex-col gap-4">
                {editing ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Doctor's Name</label>
                      <input type="text" value={editForm.doctorName}
                        onChange={(e) => setEditForm({ ...editForm, doctorName: e.target.value })}
                        placeholder="Dr. John Smith" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Hospital / Clinic</label>
                      <input type="text" value={editForm.hospital}
                        onChange={(e) => setEditForm({ ...editForm, hospital: e.target.value })}
                        placeholder="e.g. Apollo Hospital" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Doctor's Phone</label>
                      <input type="tel" value={editForm.doctorPhone}
                        onChange={(e) => setEditForm({ ...editForm, doctorPhone: e.target.value })}
                        placeholder="+91 9876543210" className={inputClass} />
                    </div>
                  </>
                ) : (
                  <>
                    {[
                      { icon: Stethoscope, label: "Doctor's Name", value: user.doctorName },
                      { icon: MapPin, label: 'Hospital / Clinic', value: user.hospital },
                      { icon: Phone, label: "Doctor's Phone", value: user.doctorPhone },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EBF5FB] flex items-center justify-center flex-shrink-0">
                            <Icon size={14} className="text-[#2E86AB]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-700">{item.value || '—'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" /> Emergency Contact
              </h3>
              <div className="flex flex-col gap-4">
                {editing ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Contact Name</label>
                      <input type="text" value={editForm.emergencyName}
                        onChange={(e) => setEditForm({ ...editForm, emergencyName: e.target.value })}
                        placeholder="e.g. Jane Doe" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Relationship</label>
                      <input type="text" value={editForm.emergencyRelation}
                        onChange={(e) => setEditForm({ ...editForm, emergencyRelation: e.target.value })}
                        placeholder="e.g. Daughter" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Emergency Phone</label>
                      <input type="tel" value={editForm.emergencyPhone}
                        onChange={(e) => setEditForm({ ...editForm, emergencyPhone: e.target.value })}
                        placeholder="+91 9876543210" className={inputClass} />
                    </div>
                  </>
                ) : (
                  <>
                    {[
                      { icon: User, label: 'Contact Name', value: user.emergencyName },
                      { icon: Heart, label: 'Relationship', value: user.emergencyRelation },
                      { icon: Phone, label: 'Emergency Phone', value: user.emergencyPhone },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                            <Icon size={14} className="text-red-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-700">{item.value || '—'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}