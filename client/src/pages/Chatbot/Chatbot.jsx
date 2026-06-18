import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Menu, Send,
  Bot, Trash2, MessageSquare, AlertCircle
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
  { icon: MessageSquare, label: 'AI Assistant', path: '/chatbot' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const QUICK_QUESTIONS = [
  'What foods should I avoid with CKD?',
  'How does dialysis work?',
  'What is eGFR and what does my level mean?',
  'How can I manage fluid intake?',
  'What are the symptoms of CKD Stage 5?',
  'How often should I get lab tests?',
];

const SYSTEM_PROMPT = `You are RenalEase AI, a compassionate and knowledgeable health assistant specialized in Chronic Kidney Disease (CKD). You help patients and caregivers understand CKD, dialysis, diet, medications, and lifestyle management.

Guidelines:
- Always be warm, empathetic, and encouraging
- Provide accurate, helpful information about CKD, dialysis (HD and PD), diet restrictions, medications, and symptoms
- Always remind users to consult their nephrologist for medical decisions
- Keep responses clear and easy to understand — avoid overly technical language
- If asked about emergency symptoms, always advise seeking immediate medical care
- Never diagnose conditions or prescribe medications
- You can discuss: CKD stages, eGFR, dialysis types, kidney-friendly foods, fluid management, lab tests, symptoms, lifestyle tips
- Be supportive — many users are patients or family members dealing with a difficult condition`;

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Chatbot() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activePath, setActivePath] = useState('/chatbot');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user.fullName ? user.fullName.split(' ')[0] : 'there'}! 👋 I'm your RenalEase AI Assistant. I'm here to help you understand CKD, dialysis, diet, medications, and more.\n\nFeel free to ask me anything about kidney health. Remember, I'm here to provide information and support — always consult your nephrologist for medical decisions. How can I help you today?`,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage) return;

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // ✅ FIX: Anthropic API requires the first message to have role: 'user'.
      // Strip any leading assistant messages (e.g. the welcome greeting) before sending.
      const firstUserIdx = newMessages.findIndex((m) => m.role === 'user');
      const apiMessages = newMessages
        .slice(firstUserIdx)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data.content?.[0]?.text ||
        'Sorry, I could not process your request. Please try again.';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting right now. Please check your internet connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Hello again! How can I help you today?`,
      },
    ]);
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
              <button
                key={item.path}
                onClick={() => { setActivePath(item.path); navigate(item.path); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 text-left ${
                  activePath === item.path
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="px-2 py-4 border-t border-white/10">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-[#2E86AB] transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#2E86AB] to-[#1A5276] flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1A5276]">RenalEase AI Assistant</h1>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                  Online
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearChat}
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} /> Clear Chat
            </button>
            <div className="w-9 h-9 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276]">
              {getInitials(user.fullName)}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border-b border-amber-200 px-8 py-2 flex items-center gap-2">
          <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
          <p className="text-amber-700 text-xs">
            RenalEase AI provides general health information only. Always consult your nephrologist for medical advice.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* Quick Questions — show only at start */}
          {messages.length <= 1 && (
            <div className="mb-6">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Quick Questions</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="bg-white border border-[#A8DADC] text-[#2E86AB] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#2E86AB] hover:text-white transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message List */}
          <div className="flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-[#A8DADC] text-[#1A5276] font-bold text-sm'
                    : 'bg-gradient-to-r from-[#2E86AB] to-[#1A5276]'
                }`}>
                  {msg.role === 'user'
                    ? getInitials(user.fullName)
                    : <Bot size={18} className="text-white" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#2E86AB] text-white rounded-tr-sm'
                    : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-sm'
                }`}>
                  {msg.content.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#2E86AB] to-[#1A5276] flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                  <div className="flex gap-1 items-center h-5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-[#2E86AB] rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 px-8 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask me anything about CKD, dialysis, diet, medications..."
                rows={1}
                className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition resize-none"
                style={{ maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                input.trim() && !loading
                  ? 'bg-[#2E86AB] hover:bg-[#1A5276] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-gray-300 text-xs mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>

      </main>
    </div>
  );
}
