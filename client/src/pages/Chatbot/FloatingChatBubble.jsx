import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import botLogo from '../../assets/bot-logo.png';
import { Send, X, Maximize2 } from 'lucide-react';

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

export default function FloatingChatBubble() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi${user?.fullName ? ' ' + user.fullName.split(' ')[0] : ''}! 👋 Ask me anything about CKD, dialysis, diet, or medications.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Hide the bubble entirely on the full AI Assistant page
  if (location.pathname === '/chatbot') {
    return null;
  }

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage) return;

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const firstUserIdx = newMessages.findIndex((m) => m.role === 'user');
      const apiMessages = newMessages
        .slice(firstUserIdx)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <>
      {/* Popup chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#2E86AB] to-[#1A5276] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <img src={botLogo} alt="RenalEase AI" className="w-8 h-8 rounded-full object-cover bg-white/20" />
              <div>
                <p className="text-white font-semibold text-sm leading-tight">RenalEase AI</p>
                <p className="text-white/70 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setIsOpen(false); navigate('/chatbot'); }}
                title="Open full assistant"
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <Maximize2 size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F4F9FF]">
            <div className="flex flex-col gap-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-[#A8DADC] text-[#1A5276] font-bold text-[10px]'
                      : 'bg-gradient-to-r from-[#2E86AB] to-[#1A5276]'
                  }`}>
                    {msg.role === 'user'
                      ? getInitials(user?.fullName)
                      : <img src={botLogo} alt="" className="w-full h-full rounded-full object-cover" />
                    }
                  </div>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
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

              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#2E86AB] to-[#1A5276] flex items-center justify-center flex-shrink-0">
                    <img src={botLogo} alt="" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-[#2E86AB] rounded-full animate-bounce"
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
          <div className="border-t border-gray-100 px-3 py-3 flex-shrink-0 bg-white">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about CKD, diet, dialysis..."
                rows={1}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition resize-none"
                style={{ maxHeight: '80px' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  input.trim() && !loading
                    ? 'bg-[#2E86AB] hover:bg-[#1A5276] text-white'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating bubble button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl bg-white border-2 border-[#A8DADC] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
        title="Chat with RenalEase AI"
      >
        <img src={botLogo} alt="RenalEase AI Assistant" className="w-full h-full rounded-full object-cover" />
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
        )}
      </button>
    </>
  );
}
