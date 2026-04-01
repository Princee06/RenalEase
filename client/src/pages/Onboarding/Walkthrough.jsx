import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    emoji: '🫘',
    title: 'Understand Your CKD',
    description:
      'Learn about your CKD stage, what it means, and how to manage it effectively — all in one place.',
    color: 'from-[#2E86AB] to-[#1A5276]',
  },
  {
    emoji: '📊',
    title: 'Track Your Health',
    description:
      'Monitor your eGFR, creatinine, blood pressure, weight, and fluid intake with easy-to-read charts.',
    color: 'from-[#1A5276] to-[#154360]',
  },
  {
    emoji: '💊',
    title: 'Never Miss a Dose',
    description:
      'Manage your medications, get reminders, and track your dialysis sessions and appointments effortlessly.',
    color: 'from-[#154360] to-[#0E2F4A]',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'For the Whole Family',
    description:
      'Includes a Kids Mode with animated explanations, and a Caregiver Mode so your family can support you.',
    color: 'from-[#0E2F4A] to-[#1A5276]',
  },
];

export default function Walkthrough() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  };

  const handleNext = () => {
    if (current < slides.length - 1) {
      goTo(current + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const slide = slides[current];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between bg-gradient-to-br ${slide.color} transition-all duration-700 relative overflow-hidden`}
    >
      {/* Background bubbles */}
      <div className="absolute top-[-60px] left-[-60px] w-64 h-64 bg-white opacity-5 rounded-full" />
      <div className="absolute bottom-[-80px] right-[-40px] w-80 h-80 bg-white opacity-5 rounded-full" />

      {/* Skip button */}
      <div className="w-full flex justify-end px-8 pt-8 z-10">
        <button
          onClick={() => navigate('/login')}
          className="text-white/50 text-sm font-medium hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div
        className="flex flex-col items-center text-center px-10 z-10 flex-1 justify-center"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(20px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {/* Emoji icon */}
        <div className="w-36 h-36 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
          <span className="text-7xl">{slide.emoji}</span>
        </div>

        {/* Slide number */}
        <p className="text-white/40 text-xs tracking-widest uppercase mb-3">
          {current + 1} of {slides.length}
        </p>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
          {slide.title}
        </h2>

        {/* Description */}
        <p className="text-white/70 text-base leading-relaxed max-w-sm">
          {slide.description}
        </p>
      </div>

      {/* Bottom section */}
      <div className="w-full flex flex-col items-center pb-12 px-8 z-10 gap-6">

        {/* Dot indicators */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>

        {/* Next / Get Started button */}
        <button
          onClick={handleNext}
          className="w-full max-w-sm bg-white text-[#1A5276] font-bold text-base py-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {current === slides.length - 1 ? "Let's Get Started 🚀" : 'Next'}
        </button>

      </div>
    </div>
  );
}