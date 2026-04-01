import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

// Floating bubble component
function Bubble({ size, left, top, delay, duration }) {
  return (
    <div
      className="absolute rounded-full bg-white opacity-10"
      style={{
        width: size, height: size,
        left, top,
        animation: `floatBubble ${duration}s ease-in-out ${delay}s infinite alternate`,
      }}
    />
  );
}

export default function Intro() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 1400),
      setTimeout(() => setStep(4), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const fadeUp = (show, delay = '0ms') => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0px)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
  });

  const fadeDown = (show) => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0px) scale(1)' : 'translateY(-40px) scale(0.8)',
    transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2E86AB] via-[#1A5276] to-[#154360] relative overflow-hidden">

      {/* Keyframe styles */}
      <style>{`
        @keyframes floatBubble {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          100% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>

      {/* Floating bubbles */}
      <Bubble size="80px"  left="5%"  top="10%" delay={0}   duration={4} />
      <Bubble size="50px"  left="88%" top="8%"  delay={1}   duration={5} />
      <Bubble size="120px" left="75%" top="70%" delay={0.5} duration={6} />
      <Bubble size="40px"  left="15%" top="75%" delay={2}   duration={4} />
      <Bubble size="60px"  left="50%" top="85%" delay={1.5} duration={5} />
      <Bubble size="30px"  left="35%" top="5%"  delay={0.8} duration={3} />
      <Bubble size="90px"  left="2%"  top="45%" delay={1.2} duration={6} />

      {/* Center card — logo + text as one unit */}
      <div className="flex flex-col items-center text-center z-10 px-8">

        {/* Logo + glow ring as one unit */}
        <div style={fadeDown(step >= 1)} className="relative flex items-center justify-center mb-6">
          {/* Pulse ring */}
          <div
            className="absolute w-48 h-48 rounded-full border-2 border-white/20"
            style={{ animation: step >= 1 ? 'pulse-ring 2s ease-out infinite' : 'none' }}
          />
          {/* Logo */}
          <img
            src={logo}
            alt="RenalEase Logo"
            className="w-44 h-44 object-contain drop-shadow-2xl relative z-10"
            style={{ filter: 'drop-shadow(0 0 20px rgba(168,218,220,0.4))' }}
          />
        </div>

        {/* Text block — tight and cohesive */}
        <div className="flex flex-col items-center gap-1">

          {/* App name */}
          <div style={fadeUp(step >= 2)}>
            <h1 className="text-6xl font-extrabold tracking-tight leading-none">
              <span className="text-white">Renal</span>
              <span className="text-[#A8DADC]">Ease</span>
            </h1>
          </div>

          {/* Divider line */}
          <div
            className="w-16 h-0.5 bg-white/30 rounded-full my-2"
            style={fadeUp(step >= 2, '0.1s')}
          />

          {/* Subtitle */}
          <div style={fadeUp(step >= 3, '0s')}>
            <p className="text-[#A8DADC] tracking-widest uppercase text-xs font-semibold">
              Renal Health & Support
            </p>
          </div>

          {/* Tagline */}
          <div style={fadeUp(step >= 3, '0.15s')}>
            <p className="text-white/60 text-sm mt-1">
              Your kidney health, simplified.
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div
          className="flex flex-col items-center gap-3 mt-10"
          style={fadeUp(step >= 4)}
        >
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-[#2E86AB] font-bold text-base px-12 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Get Started
          </button>

          <p className="text-white/50 text-sm">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-[#A8DADC] font-semibold cursor-pointer hover:underline"
            >
              Log In
            </span>
          </p>
        </div>

      </div>

      {/* Bottom text */}
      <div
        className="absolute bottom-8 text-white/25 text-xs text-center"
        style={fadeUp(step >= 4, '0.2s')}
      >
        Built with purpose, for every kidney warrior 💙
      </div>

    </div>
  );
}