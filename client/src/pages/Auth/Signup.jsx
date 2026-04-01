import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = () => {
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    navigate('/walkthrough');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E86AB] via-[#1A5276] to-[#154360] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background bubbles */}
      <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-white opacity-5 rounded-full" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[500px] h-[500px] bg-white opacity-5 rounded-full" />
      <div className="absolute top-1/2 left-[-120px] w-64 h-64 bg-white opacity-5 rounded-full" />

      {/* Wide card — two columns */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex min-h-[600px]"
        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)' }}
      >

        {/* LEFT — Branding panel */}
        <div className="hidden md:flex flex-col items-center justify-center w-2/5 px-12 py-16 relative"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {/* Glow */}
          <div className="absolute w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,218,220,0.15) 0%, transparent 70%)' }}
          />

          <img src={logo} alt="RenalEase" className="w-36 h-36 object-contain drop-shadow-2xl mb-6 relative z-10"
            style={{ filter: 'drop-shadow(0 0 20px rgba(168,218,220,0.4))' }}
          />

          <h1 className="text-4xl font-extrabold text-white tracking-tight relative z-10">
            Renal<span className="text-[#A8DADC]">Ease</span>
          </h1>

          <div className="w-12 h-0.5 bg-white/30 rounded-full my-3 relative z-10" />

          <p className="text-[#A8DADC] text-xs tracking-widest uppercase font-semibold relative z-10">
            Renal Health & Support
          </p>

          <p className="text-white/50 text-sm text-center mt-4 max-w-xs relative z-10">
            Your kidney health, simplified.
          </p>

          {/* Feature bullets */}
          <div className="mt-10 flex flex-col gap-3 w-full relative z-10">
            {[
              { icon: '📊', text: 'Track labs & vitals' },
              { icon: '💊', text: 'Manage medications' },
              { icon: '🏥', text: 'Book appointments' },
              { icon: '👧', text: 'Kids Mode included' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-white/70 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Form panel */}
        <div className="flex-1 bg-white flex flex-col justify-center px-10 py-12 md:rounded-l-none rounded-3xl">

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1A5276]">Create your account</h2>
            <p className="text-gray-400 text-sm mt-1">Join thousands of kidney warriors today</p>
          </div>

          {/* Role Selector */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
            {['patient', 'caregiver'].map((r) => (
              <button
                key={r}
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  form.role === r
                    ? 'bg-[#2E86AB] text-white'
                    : 'bg-white text-gray-400 hover:bg-gray-50'
                }`}
              >
                {r === 'patient' ? '🏥 Patient' : '👨‍👩‍👧 Caregiver'}
              </button>
            ))}
          </div>

          {/* Two column fields */}
          <div className="grid grid-cols-2 gap-4">

            {/* Full Name */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition"
              />
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition pr-14"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#2E86AB] font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition"
              />
            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mt-4">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#2E86AB] text-white font-bold text-base py-4 rounded-xl hover:bg-[#1A5276] active:scale-95 transition-all duration-300 shadow-lg mt-5"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <button className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mt-4">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Login link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-[#2E86AB] font-bold cursor-pointer hover:underline"
            >
              Log In
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}