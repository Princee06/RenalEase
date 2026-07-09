import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useUser } from '../../context/UserContext';
import { api } from '../../api';

const STEPS = ['Personal Info', 'Medical Info', 'Doctor & Emergency'];

// Frontend CKD stage values -> backend enum values
const CKD_STAGE_MAP = {
  stage1: 'Stage 1',
  stage2: 'Stage 2',
  stage3: 'Stage 3a',
  stage4: 'Stage 4',
  stage5: 'Stage 5',
  undiagnosed: 'Unknown',
};

// Frontend dialysis type -> backend enum values
const DIALYSIS_TYPE_MAP = {
  hemodialysis: 'Hemodialysis',
  peritoneal: 'Peritoneal Dialysis',
};

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { updateUser, isKid } = useUser();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState({
    dob: '',
    gender: '',
    phone: '',
    address: '',
    ckdStage: '',
    dialysis: '',
    dialysisType: '',
    allergies: '',
    doctorName: '',
    hospital: '',
    doctorPhone: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Pushes the completed form to the backend, mapping field names/values
  // to match the User model's shape.
  const syncToBackend = async () => {
    const payload = {
      dateOfBirth: form.dob || undefined,
      gender: form.gender || undefined,
      phone: form.phone || undefined,
      address: form.address || undefined,
      ckdStage: CKD_STAGE_MAP[form.ckdStage] || 'Unknown',
      dialysisType:
        form.dialysis === 'yes'
          ? DIALYSIS_TYPE_MAP[form.dialysisType] || 'None'
          : 'None',
      allergies: form.allergies || undefined,
      doctorName: form.doctorName || undefined,
      hospital: form.hospital || undefined,
      doctorPhone: form.doctorPhone || undefined,
      emergencyContact: {
        name: form.emergencyName || undefined,
        relationship: form.emergencyRelation || undefined,
        phone: form.emergencyPhone || undefined,
      },
    };

    await api.put('/users/me', payload);
  };

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    // Final step: save locally (as before) AND sync to backend
    updateUser(form);
    setSaving(true);
    setSaveError('');
    try {
      await syncToBackend();
      if (isKid()) {
        navigate('/kids-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Don't block the user from reaching the dashboard just because the
      // sync failed (e.g. temporary network issue) — surface the error but
      // let them continue, since local state already has their info.
      setSaveError(
        'We saved your info locally but could not sync it to the server. You can try again later from your profile.'
      );
      console.error('Profile sync failed:', err);
      if (isKid()) {
        navigate('/kids-dashboard');
      } else {
        navigate('/dashboard');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition bg-white";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E86AB] via-[#1A5276] to-[#154360] flex items-center justify-center px-6 py-10 relative overflow-hidden">

      <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-white opacity-5 rounded-full" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[500px] h-[500px] bg-white opacity-5 rounded-full" />

      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex min-h-[600px]"
        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)' }}>

        {/* LEFT */}
        <div className="hidden md:flex flex-col items-center justify-center w-2/5 px-12 py-16 relative"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="absolute w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,218,220,0.15) 0%, transparent 70%)' }} />
          <img src={logo} alt="RenalEase"
            className="w-28 h-28 object-contain drop-shadow-2xl mb-4 relative z-10"
            style={{ filter: 'drop-shadow(0 0 20px rgba(168,218,220,0.4))' }} />
          <h1 className="text-3xl font-extrabold text-white tracking-tight relative z-10 mb-1">
            Renal<span className="text-[#A8DADC]">Ease</span>
          </h1>
          <p className="text-white/50 text-sm text-center mb-10 relative z-10">
            Let's set up your health profile
          </p>
          <div className="flex flex-col gap-4 w-full relative z-10">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  i < step ? 'bg-[#A8DADC] text-[#1A5276]' :
                  i === step ? 'bg-white text-[#2E86AB]' :
                  'bg-white/20 text-white/50'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium transition-all duration-300 ${
                  i === step ? 'text-white' : 'text-white/50'
                }`}>
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-10 relative z-10">
            <div className="bg-[#A8DADC] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
          <p className="text-white/40 text-xs mt-2 relative z-10">Step {step + 1} of {STEPS.length}</p>
        </div>

        {/* RIGHT */}
        <div className="flex-1 bg-white flex flex-col justify-between px-10 py-12">
          <div>
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#2E86AB] uppercase tracking-widest mb-1">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="text-2xl font-bold text-[#1A5276]">{STEPS[step]}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {step === 0 && "Tell us a little about yourself"}
                {step === 1 && "Help us understand your condition"}
                {step === 2 && "Add your doctor and emergency contact"}
              </p>
            </div>

            {/* STEP 1 — Personal Info */}
            {step === 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" className={inputClass} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>City / Location</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="e.g. Hyderabad" className={inputClass} />
                </div>
              </div>
            )}

            {/* STEP 2 — Medical Info */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>CKD Stage</label>
                  <select name="ckdStage" value={form.ckdStage} onChange={handleChange} className={inputClass}>
                    <option value="">Select your CKD stage</option>
                    <option value="stage1">Stage 1 — Kidney damage, normal function</option>
                    <option value="stage2">Stage 2 — Mild loss of function</option>
                    <option value="stage3">Stage 3 — Mild to moderate loss</option>
                    <option value="stage4">Stage 4 — Severe loss of function</option>
                    <option value="stage5">Stage 5 — Kidney failure / Dialysis</option>
                    <option value="undiagnosed">Not Diagnosed Yet</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>On Dialysis?</label>
                  <select name="dialysis" value={form.dialysis} onChange={handleChange} className={inputClass}>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {form.dialysis === 'yes' && (
                  <div className="col-span-2 md:col-span-1">
                    <label className={labelClass}>Dialysis Type</label>
                    <select name="dialysisType" value={form.dialysisType} onChange={handleChange} className={inputClass}>
                      <option value="">Select type</option>
                      <option value="hemodialysis">Hemodialysis</option>
                      <option value="peritoneal">Peritoneal Dialysis</option>
                    </select>
                  </div>
                )}
                <div className="col-span-2">
                  <label className={labelClass}>Known Allergies (optional)</label>
                  <input type="text" name="allergies" value={form.allergies} onChange={handleChange} placeholder="e.g. Penicillin, Sulfa drugs" className={inputClass} />
                </div>
              </div>
            )}

            {/* STEP 3 — Doctor & Emergency */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Doctor's Name</label>
                  <input type="text" name="doctorName" value={form.doctorName} onChange={handleChange} placeholder="Dr. John Smith" className={inputClass} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Hospital / Clinic</label>
                  <input type="text" name="hospital" value={form.hospital} onChange={handleChange} placeholder="e.g. Apollo Hospital" className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Doctor's Phone</label>
                  <input type="tel" name="doctorPhone" value={form.doctorPhone} onChange={handleChange} placeholder="+91 9876543210" className={inputClass} />
                </div>
                <div className="col-span-2 flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-gray-400 text-xs font-medium">Emergency Contact</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Contact Name</label>
                  <input type="text" name="emergencyName" value={form.emergencyName} onChange={handleChange} placeholder="e.g. Jane Doe" className={inputClass} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Relationship</label>
                  <input type="text" name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange} placeholder="e.g. Daughter" className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Emergency Phone</label>
                  <input type="tel" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} placeholder="+91 9876543210" className={inputClass} />
                </div>
              </div>
            )}

            {saveError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mt-4">
                {saveError}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                step === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-[#2E86AB] hover:bg-[#F4F9FF] border border-[#2E86AB]'
              }`}>
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={saving}
              className="bg-[#2E86AB] text-white font-bold px-10 py-3 rounded-xl hover:bg-[#1A5276] active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? 'Saving...' : step === STEPS.length - 1 ? 'Go to Dashboard 🚀' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
