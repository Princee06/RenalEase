import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Play, Star, ArrowLeft, Heart } from 'lucide-react';

const KIDS_VIDEOS = [
  {
    id: 1,
    title: 'What are Kidneys?',
    description: 'Learn what your kidneys do in a fun way!',
    youtubeId: 'H4_9KBjnO4U',
    emoji: '🫘',
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-100',
  },
  {
    id: 2,
    title: 'How Does Dialysis Work?',
    description: 'A simple explanation of dialysis for children.',
    youtubeId: 'WFEcVNfzOms',
    emoji: '💧',
    color: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-100',
  },
  {
    id: 3,
    title: 'Staying Healthy!',
    description: 'Fun tips on staying healthy and happy.',
    youtubeId: 'ZpR6TKTKvPU',
    emoji: '🌟',
    color: 'from-yellow-400 to-orange-500',
    bg: 'bg-yellow-100',
  },
  {
    id: 4,
    title: 'Why Do We Drink Water?',
    description: 'Learn why water is so important!',
    youtubeId: 'bDSLhN5RaKY',
    emoji: '💦',
    color: 'from-cyan-400 to-cyan-600',
    bg: 'bg-cyan-100',
  },
  {
    id: 5,
    title: 'Eating Healthy for Kids',
    description: 'Fun cartoon about eating the right foods!',
    youtubeId: 'L-5_5KoNkVM',
    emoji: '🥗',
    color: 'from-green-400 to-green-600',
    bg: 'bg-green-100',
  },
  {
    id: 6,
    title: 'Going to the Doctor',
    description: 'Nothing to fear about doctor visits!',
    youtubeId: 'p9nPRJJHhFM',
    emoji: '👨‍⚕️',
    color: 'from-red-400 to-pink-500',
    bg: 'bg-red-100',
  },
];

const FUN_FACTS = [
  { emoji: '🫘', fact: 'Your kidneys are the size of your fist!', color: 'bg-blue-200' },
  { emoji: '💧', fact: 'Kidneys filter 200 liters of blood every day!', color: 'bg-cyan-200' },
  { emoji: '🔬', fact: 'Each kidney has 1 million tiny filters!', color: 'bg-purple-200' },
  { emoji: '⚡', fact: 'Kidneys work 24 hours a day — never sleeping!', color: 'bg-yellow-200' },
  { emoji: '🌈', fact: 'Drinking water keeps kidneys healthy and happy!', color: 'bg-green-200' },
  { emoji: '🏆', fact: 'One kidney can do the work of two if needed!', color: 'bg-orange-200' },
];

const TIPS = [
  { emoji: '💧', tip: 'Drink water as your doctor says!', color: 'bg-blue-200' },
  { emoji: '🥦', tip: 'Eat your vegetables every day!', color: 'bg-green-200' },
  { emoji: '💊', tip: 'Take medicines on time!', color: 'bg-purple-200' },
  { emoji: '😴', tip: 'Get enough sleep every night!', color: 'bg-indigo-200' },
  { emoji: '🚶', tip: 'Go for walks and play outside!', color: 'bg-yellow-200' },
  { emoji: '😊', tip: 'Stay happy — talk if you feel sad!', color: 'bg-pink-200' },
];

function FloatingBubble({ size, left, top, delay, color }) {
  return (
    <div
      className={`absolute rounded-full ${color} opacity-30`}
      style={{
        width: size, height: size, left, top,
        animation: `floatUp ${delay}s ease-in-out infinite alternate`,
      }}
    />
  );
}

export default function KidsMode() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [phase, setPhase] = useState('entering'); // entering → kids
  const [enteringStep, setEnteringStep] = useState(0);
  const [activeTab, setActiveTab] = useState('videos');
  const [playingVideo, setPlayingVideo] = useState(null);

  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Friend';

  useEffect(() => {
    // Step 0: show "Entering Kids Mode..."
    // Step 1: show stars/animation
    // Step 2: show kids interface
    const t1 = setTimeout(() => setEnteringStep(1), 1500);
    const t2 = setTimeout(() => setEnteringStep(2), 2800);
    const t3 = setTimeout(() => setPhase('kids'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // ── ENTERING TRANSITION SCREEN ──
  if (phase === 'entering') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>

        <style>{`
          @keyframes floatUp {
            0% { transform: translateY(0px) scale(1); }
            100% { transform: translateY(-30px) scale(1.1); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pop-in {
            0% { transform: scale(0); opacity: 0; }
            70% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Floating bubbles */}
        <FloatingBubble size="80px" left="5%" top="10%" delay={3} color="bg-white" />
        <FloatingBubble size="50px" left="85%" top="15%" delay={4} color="bg-yellow-300" />
        <FloatingBubble size="100px" left="70%" top="65%" delay={2} color="bg-pink-300" />
        <FloatingBubble size="60px" left="10%" top="70%" delay={5} color="bg-cyan-300" />
        <FloatingBubble size="40px" left="45%" top="5%" delay={3.5} color="bg-green-300" />
        <FloatingBubble size="70px" left="20%" top="40%" delay={2.5} color="bg-orange-300" />

        <div className="flex flex-col items-center text-center z-10 px-8">

          {/* Big emoji that pops in */}
          <div style={{ animation: 'pop-in 0.8s ease forwards' }} className="text-8xl mb-6">
            🌟
          </div>

          {/* Main message */}
          <h1 className="text-4xl font-extrabold text-white mb-3"
            style={{ animation: 'fadeUp 0.8s ease 0.3s both' }}>
            Entering Kids Mode!
          </h1>

          <p className="text-white/80 text-xl font-semibold mb-8"
            style={{ animation: 'fadeUp 0.8s ease 0.6s both' }}>
            Get ready for some fun, {firstName}! 🎉
          </p>

          {/* Animated emoji row */}
          {enteringStep >= 1 && (
            <div className="flex gap-4 text-4xl mb-8"
              style={{ animation: 'fadeUp 0.6s ease forwards' }}>
              {['🫘', '💧', '🌈', '⭐', '💙', '🏆'].map((e, i) => (
                <span key={i} className="animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}>
                  {e}
                </span>
              ))}
            </div>
          )}

          {/* Loading dots */}
          {enteringStep >= 2 && (
            <div className="flex gap-2" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              {[0, 1, 2].map((i) => (
                <div key={i}
                  className="w-4 h-4 rounded-full bg-white animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── KIDS INTERFACE ──
  return (
    <div className="min-h-screen overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #e0f7ff 0%, #fff9f0 50%, #f3e5ff 100%)' }}>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>

      {/* Floating background bubbles */}
      <FloatingBubble size="120px" left="2%" top="5%" delay={4} color="bg-blue-200" />
      <FloatingBubble size="80px" left="88%" top="10%" delay={3} color="bg-pink-200" />
      <FloatingBubble size="60px" left="75%" top="50%" delay={5} color="bg-yellow-200" />
      <FloatingBubble size="90px" left="5%" top="55%" delay={2} color="bg-purple-200" />
      <FloatingBubble size="50px" left="50%" top="80%" delay={3.5} color="bg-green-200" />

      {/* TOP NAV */}
      <div className="sticky top-0 z-20 px-6 py-4"
        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">

          {/* Back button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-md hover:shadow-lg transition-all border-2 border-purple-200 text-purple-600 font-bold text-sm">
            <ArrowLeft size={18} /> Back to Dashboard
          </button>

          {/* Title */}
          <div className="flex items-center gap-3">
            <span className="text-3xl" style={{ animation: 'wiggle 2s ease infinite' }}>🌟</span>
            <h1 className="text-2xl font-extrabold"
              style={{ background: 'linear-gradient(90deg, #667eea, #f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Kids Mode
            </h1>
            <span className="text-3xl" style={{ animation: 'wiggle 2s ease infinite', animationDelay: '0.5s' }}>🎉</span>
          </div>

          {/* User */}
          <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-md border-2 border-pink-200">
            <span className="text-xl">👋</span>
            <span className="font-bold text-pink-600 text-sm">Hi, {firstName}!</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Hero */}
        <div className="rounded-3xl p-8 mb-8 text-center relative overflow-hidden shadow-xl"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <FloatingBubble size="60px" left="5%" top="10%" delay={3} color="bg-white" />
          <FloatingBubble size="40px" left="88%" top="15%" delay={4} color="bg-yellow-300" />
          <div className="relative z-10">
            <div className="text-6xl mb-3 flex justify-center gap-3">
              {['🫘', '💧', '🌈'].map((e, i) => (
                <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>{e}</span>
              ))}
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">
              Welcome to Your Health World, {firstName}! 🎊
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Learn about kidneys, watch fun videos, and discover cool facts — all in one place just for you!
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-6 justify-center flex-wrap">
          {[
            { key: 'videos', label: 'Fun Videos', emoji: '🎬', color: 'from-blue-400 to-purple-500' },
            { key: 'facts', label: 'Cool Facts', emoji: '🌟', color: 'from-yellow-400 to-orange-500' },
            { key: 'tips', label: 'Health Tips', emoji: '💪', color: 'from-green-400 to-teal-500' },
            { key: 'learn', label: 'Learn!', emoji: '📚', color: 'from-pink-400 to-red-500' },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-2xl text-base font-extrabold transition-all shadow-md flex items-center gap-2 ${
                activeTab === tab.key
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:scale-105'
              }`}>
              <span className="text-xl">{tab.emoji}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* VIDEOS TAB */}
        {activeTab === 'videos' && (
          <div>
            <h2 className="text-2xl font-extrabold text-purple-700 mb-4 text-center">
              🎬 Watch & Learn!
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {KIDS_VIDEOS.map((video) => (
                <div key={video.id}
                  className={`${video.bg} rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-[1.03] border-4 border-white`}>
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
                    <div className="relative cursor-pointer group"
                      style={{ paddingTop: '56.25%' }}
                      onClick={() => setPlayingVideo(video.id)}>
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${video.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                          <Play size={28} className="text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{video.emoji}</span>
                      <h3 className="font-extrabold text-gray-700 text-sm">{video.title}</h3>
                    </div>
                    <p className="text-gray-500 text-xs">{video.description}</p>
                    {playingVideo === video.id && (
                      <button onClick={() => setPlayingVideo(null)}
                        className="mt-2 text-xs text-gray-400 hover:text-red-500">
                        Close ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FACTS TAB */}
        {activeTab === 'facts' && (
          <div>
            <h2 className="text-2xl font-extrabold text-yellow-600 mb-4 text-center">
              🌟 Amazing Kidney Facts!
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {FUN_FACTS.map((fact, idx) => (
                <div key={idx}
                  className={`${fact.color} rounded-3xl p-5 flex items-center gap-4 shadow-md hover:scale-[1.02] transition-all border-4 border-white`}>
                  <span className="text-5xl flex-shrink-0">{fact.emoji}</span>
                  <div>
                    <p className="font-extrabold text-gray-700 text-base leading-relaxed">{fact.fact}</p>
                    <div className="flex gap-1 mt-2">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={14} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIPS TAB */}
        {activeTab === 'tips' && (
          <div>
            <h2 className="text-2xl font-extrabold text-green-700 mb-4 text-center">
              💪 Stay Healthy Tips!
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {TIPS.map((item, idx) => (
                <div key={idx}
                  className={`${item.color} rounded-3xl p-5 flex items-center gap-4 shadow-md hover:scale-[1.02] transition-all border-4 border-white`}>
                  <span className="text-5xl">{item.emoji}</span>
                  <p className="font-extrabold text-gray-700 text-lg">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEARN TAB */}
        {activeTab === 'learn' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold text-pink-700 mb-2 text-center">
              📚 Learn About Kidneys!
            </h2>

            <div className="bg-white rounded-3xl p-6 border-4 border-blue-300 shadow-md">
              <h3 className="text-xl font-extrabold text-blue-700 mb-3">🫘 What are Kidneys?</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Your kidneys are two bean-shaped organs, each about the size of your fist. They sit just below your ribs. Their main job is to <strong>clean your blood</strong> — removing waste and extra water to make urine. They also help control your blood pressure and make sure your body has the right amount of important minerals!
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border-4 border-purple-300 shadow-md">
              <h3 className="text-xl font-extrabold text-purple-700 mb-3">💜 What is CKD?</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                CKD stands for <strong>Chronic Kidney Disease</strong>. It means the kidneys are not working as well as they should. The word "chronic" means it happens over a long time. Doctors and medicines help people with CKD feel better and stay healthy. Having CKD doesn't mean you can't live a happy life!
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border-4 border-cyan-300 shadow-md">
              <h3 className="text-xl font-extrabold text-cyan-700 mb-3">💧 What is Dialysis?</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                When kidneys can't clean blood on their own, a special machine called a <strong>dialysis machine</strong> helps! It's like a big filter that cleans the blood outside the body and puts it back in — clean and healthy! Some people go to a hospital for this, and some can even do it at home!
              </p>
            </div>

            {/* Warrior Card */}
            <div className="rounded-3xl p-8 shadow-xl text-center"
              style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <p className="text-6xl mb-4">🏆</p>
              <h3 className="text-3xl font-extrabold text-white mb-3">You Are a Kidney Warrior!</h3>
              <p className="text-white/90 text-lg max-w-lg mx-auto">
                Living with kidney disease is hard, but you are SO brave and strong. Keep taking your medicines, eating right, and smiling every day. You've got this, {firstName}!
              </p>
              <div className="flex justify-center gap-3 mt-5 flex-wrap">
                {['💙', '⭐', '🌈', '💪', '🎉', '🌟', '❤️'].map((e, i) => (
                  <span key={i} className="text-3xl animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}>
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}