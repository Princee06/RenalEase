import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Menu,
  Play, ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle,
  Heart, FlaskConical, Apple
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

const VIDEOS = [
  {
    id: 1,
    category: 'Understanding CKD',
    title: 'What is Chronic Kidney Disease (CKD)?',
    description: 'A comprehensive overview of CKD, its causes, symptoms, and stages explained by a nephrologist.',
    youtubeId: 'ZpR6TKTKvPU',
    duration: '8:24',
    level: 'Beginner',
  },
  {
    id: 2,
    category: 'Understanding CKD',
    title: 'CKD Stages 1-5 Explained',
    description: 'Detailed explanation of all 5 stages of CKD, what each stage means, and how to manage them.',
    youtubeId: 'bDSLhN5RaKY',
    duration: '12:15',
    level: 'Beginner',
  },
  {
    id: 3,
    category: 'Dialysis',
    title: 'How Hemodialysis Works',
    description: 'Step-by-step explanation of hemodialysis — how the machine works, what happens during a session.',
    youtubeId: 'wLMjzJ-dLa4',
    duration: '6:45',
    level: 'Intermediate',
  },
  {
    id: 4,
    category: 'Dialysis',
    title: 'Peritoneal Dialysis — A Complete Guide',
    description: 'Everything you need to know about peritoneal dialysis for home-based treatment.',
    youtubeId: 'E7PxzaXGzxg',
    duration: '10:30',
    level: 'Intermediate',
  },
  {
    id: 5,
    category: 'Diet & Nutrition',
    title: 'CKD Diet — What to Eat and Avoid',
    description: 'A renal dietitian explains the best diet for CKD patients — potassium, phosphorus, sodium control.',
    youtubeId: 'L-5_5KoNkVM',
    duration: '15:20',
    level: 'Beginner',
  },
  {
    id: 6,
    category: 'Diet & Nutrition',
    title: 'Managing Fluid Intake in CKD',
    description: 'How to manage fluid restriction for dialysis patients — tips and practical advice.',
    youtubeId: 'BqCi-dxEaHQ',
    duration: '9:10',
    level: 'Intermediate',
  },
  {
    id: 7,
    category: 'Medications',
    title: 'Common Medications for CKD Patients',
    description: 'Overview of medications commonly prescribed for CKD — blood pressure, phosphorus binders, and more.',
    youtubeId: 'mEHmAQrTwxY',
    duration: '11:05',
    level: 'Intermediate',
  },
  {
    id: 8,
    category: 'Mental Health',
    title: 'Managing Mental Health with CKD',
    description: 'How to cope with the emotional and psychological challenges of living with chronic kidney disease.',
    youtubeId: 'xqHPbCqFxoU',
    duration: '13:40',
    level: 'Beginner',
  },
  {
    id: 9,
    category: 'Kidney Transplant',
    title: 'Kidney Transplant — What to Expect',
    description: 'A nephrologist explains the kidney transplant process, eligibility, and life after transplant.',
    youtubeId: '4fEsk9HqBPk',
    duration: '18:55',
    level: 'Advanced',
  },
];

const FAQS = [
  {
    q: 'What is eGFR and why is it important?',
    a: 'eGFR (estimated Glomerular Filtration Rate) measures how well your kidneys filter waste from the blood. A normal eGFR is 60 or above. Below 60 for 3+ months indicates CKD. Below 15 is kidney failure (Stage 5).',
  },
  {
    q: 'Can CKD be reversed?',
    a: 'CKD cannot be fully reversed, but its progression can be significantly slowed with proper treatment, diet changes, blood pressure control, and blood sugar management. Early stages (1-3) can sometimes be stabilized.',
  },
  {
    q: 'How often should CKD patients get lab tests?',
    a: 'Typically every 3-6 months depending on your stage. Stage 3-4: every 3-6 months. Stage 5 / Dialysis: monthly. Your nephrologist will advise the right frequency for your condition.',
  },
  {
    q: 'Is dialysis permanent?',
    a: 'Dialysis is a long-term treatment for Stage 5 CKD (kidney failure). It can be temporary if your kidneys recover (rare) or a bridge to kidney transplant. Most patients on dialysis require it for life unless they receive a transplant.',
  },
  {
    q: 'What foods should CKD patients avoid?',
    a: 'High-potassium foods (bananas, oranges, potatoes, spinach), high-phosphorus foods (dairy, dark colas, nuts), high-sodium foods (pickles, processed foods, papad), and excess protein. Your dietitian will create a personalized plan.',
  },
  {
    q: 'Can CKD patients exercise?',
    a: 'Yes! Light to moderate exercise is beneficial — walking, yoga, gentle stretching. Avoid strenuous exercise. Always consult your nephrologist before starting an exercise program.',
  },
  {
    q: 'What is the difference between HD and PD dialysis?',
    a: 'Hemodialysis (HD) is done at a dialysis center 3 times per week using a machine. Peritoneal Dialysis (PD) is done at home daily using the abdomen lining to filter waste. Your doctor will recommend the best option based on your condition.',
  },
  {
    q: 'Is kidney transplant better than dialysis?',
    a: 'For eligible patients, kidney transplant generally offers a better quality of life and longer survival than dialysis. However, not all patients are eligible, and transplant requires lifelong immunosuppressant medication.',
  },
];

const CKD_STAGES = [
  { stage: 'Stage 1', egfr: '≥ 90', desc: 'Kidney damage with normal or high function. Usually no symptoms.', color: 'bg-green-50 border-green-200 text-green-700', dot: 'bg-green-500' },
  { stage: 'Stage 2', egfr: '60–89', desc: 'Mildly reduced kidney function. May have no symptoms.', color: 'bg-teal-50 border-teal-200 text-teal-700', dot: 'bg-teal-500' },
  { stage: 'Stage 3', egfr: '30–59', desc: 'Moderately reduced function. Fatigue, swelling may begin.', color: 'bg-yellow-50 border-yellow-200 text-yellow-700', dot: 'bg-yellow-500' },
  { stage: 'Stage 4', egfr: '15–29', desc: 'Severely reduced function. Prepare for dialysis or transplant.', color: 'bg-orange-50 border-orange-200 text-orange-700', dot: 'bg-orange-500' },
  { stage: 'Stage 5', egfr: '< 15', desc: 'Kidney failure. Dialysis or transplant required.', color: 'bg-red-50 border-red-200 text-red-700', dot: 'bg-red-500' },
];

const VIDEO_CATEGORIES = ['All', 'Understanding CKD', 'Dialysis', 'Diet & Nutrition', 'Medications', 'Mental Health', 'Kidney Transplant'];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Education() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activePath, setActivePath] = useState('/education');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const filteredVideos = selectedCategory === 'All'
    ? VIDEOS
    : VIDEOS.filter((v) => v.category === selectedCategory);

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
              <h1 className="text-lg font-bold text-[#1A5276]">CKD Education</h1>
              <p className="text-gray-400 text-xs">Learn about CKD, dialysis, diet, and more</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276]">
            {getInitials(user.fullName)}
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-[#2E86AB] to-[#1A5276] rounded-2xl p-6 mb-6 shadow-lg flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-bold mb-1">Knowledge is Power 💙</h2>
              <p className="text-white/70 text-sm max-w-lg">
                Understanding your condition helps you manage it better. Watch expert videos, read about CKD stages, and get answers to common questions.
              </p>
            </div>
            <div className="hidden md:block opacity-10">
              <BookOpen size={100} className="text-white" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { key: 'videos', label: 'Video Library', icon: Play },
              { key: 'stages', label: 'CKD Stages', icon: FlaskConical },
              { key: 'faq', label: 'FAQs', icon: Info },
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

          {/* VIDEO LIBRARY TAB */}
          {activeTab === 'videos' && (
            <div>
              {/* Category Filter */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {VIDEO_CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#1A5276] text-white'
                        : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">

                    {/* Video Embed or Thumbnail */}
                    {playingVideo === video.id ? (
                      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div
                        className="relative cursor-pointer group"
                        style={{ paddingTop: '56.25%' }}
                        onClick={() => setPlayingVideo(video.id)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt={video.title}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play size={24} className="text-[#2E86AB] ml-1" fill="#2E86AB" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>
                    )}

                    {/* Video Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#EBF5FB] text-[#2E86AB] text-xs font-semibold px-2 py-0.5 rounded-full">
                          {video.category}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          video.level === 'Beginner' ? 'bg-green-50 text-green-600' :
                          video.level === 'Intermediate' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {video.level}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1A5276] text-sm leading-tight mb-1">{video.title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">{video.description}</p>
                      {playingVideo === video.id && (
                        <button
                          onClick={() => setPlayingVideo(null)}
                          className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors">
                          Close video
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CKD STAGES TAB */}
          {activeTab === 'stages' && (
            <div className="flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 mb-2">
                <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  CKD is classified into 5 stages based on eGFR (estimated Glomerular Filtration Rate). The lower the eGFR, the less kidney function remains. Regular monitoring helps track progression.
                </p>
              </div>

              {CKD_STAGES.map((stage) => (
                <div key={stage.stage} className={`bg-white rounded-2xl p-5 shadow-sm border ${stage.color.split(' ')[1]} flex items-start gap-4`}>
                  <div className={`w-4 h-4 rounded-full ${stage.dot} flex-shrink-0 mt-1`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-bold text-base ${stage.color.split(' ')[2]}`}>{stage.stage}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${stage.color}`}>
                        eGFR: {stage.egfr} mL/min
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{stage.desc}</p>
                  </div>
                </div>
              ))}

              {/* Symptoms */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-2">
                <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-orange-500" /> Common CKD Symptoms
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    'Fatigue and weakness', 'Swelling in legs/ankles', 'Shortness of breath',
                    'Decreased urine output', 'Blood in urine', 'Foamy/frothy urine',
                    'High blood pressure', 'Loss of appetite', 'Nausea and vomiting',
                    'Difficulty sleeping', 'Muscle cramps', 'Itchy skin',
                    'Brain fog / confusion', 'Chest pain', 'Frequent urination at night',
                  ].map((symptom) => (
                    <div key={symptom} className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                      <p className="text-xs text-orange-700 font-medium">{symptom}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Causes */}
<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
  <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
    <svg width="22" height="22" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="35" cy="50" rx="22" ry="35" fill="#E74C3C" opacity="0.85" transform="rotate(-15 35 50)"/>
      <ellipse cx="65" cy="50" rx="22" ry="35" fill="#E74C3C" opacity="0.85" transform="rotate(15 65 50)"/>
      <ellipse cx="35" cy="50" rx="10" ry="20" fill="#F4F9FF" opacity="0.6" transform="rotate(-15 35 50)"/>
      <ellipse cx="65" cy="50" rx="10" ry="20" fill="#F4F9FF" opacity="0.6" transform="rotate(15 65 50)"/>
    </svg>
    Common Causes of CKD
  </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    'Diabetes (Type 1 & 2)', 'High Blood Pressure', 'Glomerulonephritis',
                    'Polycystic Kidney Disease', 'Recurrent kidney infections', 'Kidney stones',
                    'Lupus', 'Certain medications', 'Obstruction of urinary tract',
                  ].map((cause) => (
                    <div key={cause} className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-700 font-medium">{cause}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FAQ TAB */}
          {activeTab === 'faq' && (
            <div className="flex flex-col gap-3">
              <p className="text-gray-400 text-sm mb-2">Common questions answered by nephrologists and CKD specialists.</p>
              {FAQS.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                    <p className="font-semibold text-[#1A5276] text-sm pr-4">{faq.q}</p>
                    {expandedFaq === idx
                      ? <ChevronUp size={18} className="text-[#2E86AB] flex-shrink-0" />
                      : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                    }
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-5 pb-4 border-t border-gray-100">
                      <p className="text-gray-600 text-sm leading-relaxed mt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}