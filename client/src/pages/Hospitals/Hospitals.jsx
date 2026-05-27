import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Menu,
  MapPin, Phone, Star, Search, ChevronDown,
  Building2, Clock, CheckCircle, ExternalLink, Navigation
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

const FEATURED_HOSPITALS = [
  {
    id: 1,
    name: 'Apollo Hospitals',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Jubilee Hills, Hyderabad - 500033',
    phone: '+91 40 2360 7777',
    type: 'Multi-specialty',
    dialysis: true,
    rating: 4.8,
    reviews: 1240,
    timing: '24/7',
    doctors: [
      { name: 'Dr. Rajesh Kumar', specialty: 'Nephrologist', experience: '18 years', rating: 4.9 },
      { name: 'Dr. Sunitha Reddy', specialty: 'Nephrologist', experience: '12 years', rating: 4.7 },
    ],
    facilities: ['HD Dialysis', 'PD Dialysis', 'Kidney Transplant', 'ICU', 'Lab'],
    mapsQuery: 'Apollo+Hospitals+Hyderabad',
  },
  {
    id: 2,
    name: 'AIIMS Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Ansari Nagar East, New Delhi - 110029',
    phone: '+91 11 2659 3308',
    type: 'Government',
    dialysis: true,
    rating: 4.8,
    reviews: 3200,
    timing: '24/7',
    doctors: [
      { name: 'Dr. Sanjeev Kumar', specialty: 'Nephrologist', experience: '25 years', rating: 4.9 },
    ],
    facilities: ['HD Dialysis', 'PD Dialysis', 'Kidney Transplant', 'Research Center', 'ICU'],
    mapsQuery: 'AIIMS+Delhi+Nephrology',
  },
  {
    id: 3,
    name: 'Christian Medical College',
    city: 'Vellore',
    state: 'Tamil Nadu',
    address: 'Ida Scudder Road, Vellore - 632004',
    phone: '+91 416 228 1000',
    type: 'Government',
    dialysis: true,
    rating: 4.9,
    reviews: 2800,
    timing: '24/7',
    doctors: [
      { name: 'Dr. Anna Thomas', specialty: 'Nephrologist', experience: '20 years', rating: 4.9 },
    ],
    facilities: ['HD Dialysis', 'PD Dialysis', 'Kidney Transplant', 'Research', 'ICU'],
    mapsQuery: 'CMC+Vellore+Nephrology',
  },
  {
    id: 4,
    name: 'Fortis Hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Mulund Goregaon Link Road, Mumbai - 400078',
    phone: '+91 22 6245 6245',
    type: 'Multi-specialty',
    dialysis: true,
    rating: 4.7,
    reviews: 1560,
    timing: '24/7',
    doctors: [
      { name: 'Dr. Rahul Mehta', specialty: 'Nephrologist', experience: '16 years', rating: 4.8 },
    ],
    facilities: ['HD Dialysis', 'PD Dialysis', 'Kidney Transplant', 'Lab', 'ICU'],
    mapsQuery: 'Fortis+Hospital+Mumbai+Nephrology',
  },
];

const QUICK_SEARCHES = [
  'Dialysis centers in Hyderabad',
  'Dialysis centers in Chennai',
  'Dialysis centers in Mumbai',
  'Dialysis centers in Delhi',
  'Dialysis centers in Bangalore',
  'Dialysis centers in Kolkata',
  'Dialysis centers in Ahmedabad',
  'Dialysis centers in Pune',
  'Dialysis centers in Jaipur',
  'Dialysis centers in Lucknow',
  'Dialysis centers in Rajula',
  'Dialysis centers in Coimbatore',
  'Dialysis centers in Visakhapatnam',
  'Dialysis centers in Bhopal',
  'Dialysis centers in Patna',
  'Kidney hospitals in rural India',
];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={12}
          className={star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
      ))}
      <span className="text-xs font-semibold text-gray-600 ml-1">{rating}</span>
    </div>
  );
}

export default function Hospitals() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activePath, setActivePath] = useState('/doctors');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [expandedId, setExpandedId] = useState(null);

  const openGoogleMaps = (query) => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const findNearMe = () => {
    const url = `https://www.google.com/maps/search/dialysis+center+near+me`;
    window.open(url, '_blank');
  };

  const searchInCity = () => {
    if (!searchCity.trim()) return;
    const query = `dialysis center nephrology hospital in ${searchCity} India`;
    openGoogleMaps(query);
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
              <h1 className="text-lg font-bold text-[#1A5276]">Hospitals & Dialysis Centers</h1>
              <p className="text-gray-400 text-xs">Find dialysis centers anywhere in India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={findNearMe}
              className="bg-[#2E86AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
              <Navigation size={16} /> Find Near Me
            </button>
            <div className="w-9 h-9 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276]">
              {getInitials(user.fullName)}
            </div>
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Hero Search Card */}
          <div className="bg-gradient-to-r from-[#2E86AB] to-[#1A5276] rounded-2xl p-6 mb-6 shadow-lg">
            <h2 className="text-white text-xl font-bold mb-1">Find Dialysis Centers Near You</h2>
            <p className="text-white/70 text-sm mb-4">
              Search across every city, town, and village in India — powered by Google Maps
            </p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchInCity()}
                  placeholder="Enter any city, town, or village in India..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                />
              </div>
              <button
                onClick={searchInCity}
                className="bg-white text-[#2E86AB] font-bold px-6 py-3 rounded-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-2">
                <Search size={16} /> Search
              </button>
            </div>

            {/* Find Near Me Button */}
            <button
              onClick={findNearMe}
              className="mt-3 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 w-fit">
              <Navigation size={16} /> Use My Current Location
            </button>
          </div>

          {/* Quick Search Tags */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <h3 className="font-bold text-[#1A5276] text-sm mb-3 flex items-center gap-2">
              <Search size={16} className="text-[#2E86AB]" /> Quick Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((q) => (
                <button
                  key={q}
                  onClick={() => openGoogleMaps(q)}
                  className="bg-[#F4F9FF] text-[#2E86AB] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#A8DADC] hover:bg-[#2E86AB] hover:text-white transition-all flex items-center gap-1">
                  <MapPin size={10} /> {q}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { key: 'search', label: 'Live Map Search', icon: Navigation },
              { key: 'featured', label: 'Featured Hospitals', icon: Building2 },
              { key: 'chains', label: 'Dialysis Chains', icon: Droplets },
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

          {/* Live Map Search Tab */}
          {activeTab === 'search' && (
            <div className="flex flex-col gap-4">

              {/* Embedded Map */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-[#1A5276] text-sm flex items-center gap-2">
                    <MapPin size={16} className="text-[#2E86AB]" /> Dialysis Centers Map — India
                  </h3>
                  <button
                    onClick={() => openGoogleMaps('dialysis center India')}
                    className="text-xs text-[#2E86AB] font-semibold flex items-center gap-1 hover:underline">
                    Open in Google Maps <ExternalLink size={12} />
                  </button>
                </div>
                <iframe
                  title="Dialysis Centers India"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed/v1/search?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=dialysis+center+india&zoom=5"
                />
              </div>

              {/* How to use */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <h3 className="font-bold text-blue-700 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-blue-500" /> How to Find Dialysis Centers Anywhere in India
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {[
                    { step: '1', title: 'Enter Your City', desc: 'Type any city, town, taluk or village name in the search box above' },
                    { step: '2', title: 'Click Search', desc: 'Google Maps will show all dialysis and nephrology centers in that area' },
                    { step: '3', title: 'Get Directions', desc: 'Click any result on the map to get directions, phone number, and reviews' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-bold text-blue-700 text-sm">{item.title}</p>
                        <p className="text-blue-600 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Featured Hospitals Tab */}
          {activeTab === 'featured' && (
            <div className="flex flex-col gap-4">
              <p className="text-gray-400 text-sm">Major nephrology & dialysis hospitals across India. For centers near you, use the Live Map Search tab.</p>
              {FEATURED_HOSPITALS.map((hospital) => (
                <div key={hospital.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#EBF5FB] flex items-center justify-center flex-shrink-0">
                          <Building2 size={24} className="text-[#2E86AB]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-[#1A5276] text-base">{hospital.name}</h3>
                            <span className="bg-[#EBF5FB] text-[#2E86AB] text-xs font-semibold px-2 py-0.5 rounded-full">
                              {hospital.type}
                            </span>
                            {hospital.dialysis && (
                              <span className="bg-green-50 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle size={10} /> Dialysis
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={11} /> {hospital.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Phone size={11} /> {hospital.phone}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock size={11} /> {hospital.timing}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <StarRating rating={hospital.rating} />
                        <p className="text-xs text-gray-400 mt-1">{hospital.reviews.toLocaleString()} reviews</p>
                      </div>
                    </div>

                    {/* Facilities */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {hospital.facilities.map((f) => (
                        <span key={f} className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-lg border border-gray-200">{f}</span>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <button
                        onClick={() => openGoogleMaps(hospital.mapsQuery)}
                        className="flex items-center gap-1.5 text-xs bg-[#EBF5FB] text-[#2E86AB] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#2E86AB] hover:text-white transition-all">
                        <MapPin size={12} /> View on Google Maps
                      </button>
                      <button
                        onClick={() => setExpandedId(expandedId === hospital.id ? null : hospital.id)}
                        className="flex items-center gap-1.5 text-xs bg-gray-50 text-gray-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all">
                        <Stethoscope size={12} />
                        {expandedId === hospital.id ? 'Hide Doctors' : `View ${hospital.doctors.length} Doctor(s)`}
                        <ChevronDown size={12} className={`transition-transform ${expandedId === hospital.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Doctors Expanded */}
                  {expandedId === hospital.id && (
                    <div className="border-t border-gray-100 bg-[#F9FBFD] p-5">
                      <h4 className="font-bold text-[#1A5276] text-sm mb-3 flex items-center gap-2">
                        <Stethoscope size={15} className="text-[#2E86AB]" /> Specialist Doctors
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {hospital.doctors.map((doc) => (
                          <div key={doc.name} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276] flex-shrink-0">
                              {getInitials(doc.name)}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-[#1A5276] text-sm">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.specialty} • {doc.experience}</p>
                              <StarRating rating={doc.rating} />
                            </div>
                            <button
                              onClick={() => navigate('/appointments')}
                              className="bg-[#2E86AB] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#1A5276] transition-all">
                              Book
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Dialysis Chains Tab */}
          {activeTab === 'chains' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                {
                  name: 'NephroPlus',
                  desc: "India's largest dialysis network with 300+ centers across 100+ cities including Tier 2 and Tier 3 towns",
                  centers: '300+ centers',
                  cities: '100+ cities',
                  phone: '1800-103-3005',
                  website: 'https://www.nephroplus.com',
                  color: 'border-blue-200 bg-blue-50',
                  textColor: 'text-blue-700',
                  query: 'NephroPlus dialysis center near me',
                },
                {
                  name: 'B. Braun Avitum',
                  desc: 'Leading dialysis chain with centers across India including rural and semi-urban areas',
                  centers: '200+ centers',
                  cities: '80+ cities',
                  phone: '+91 22 6656 5555',
                  website: 'https://www.bbraun.in',
                  color: 'border-green-200 bg-green-50',
                  textColor: 'text-green-700',
                  query: 'B Braun dialysis center near me India',
                },
                {
                  name: 'Fresenius Medical Care',
                  desc: 'Global dialysis provider with a strong network across major and minor Indian cities',
                  centers: '150+ centers',
                  cities: '60+ cities',
                  phone: '+91 44 4567 8900',
                  website: 'https://www.freseniusmedicalcare.com',
                  color: 'border-purple-200 bg-purple-50',
                  textColor: 'text-purple-700',
                  query: 'Fresenius dialysis center near me India',
                },
                {
                  name: 'DaVita India',
                  desc: 'Quality dialysis care centers spread across metros and smaller cities in India',
                  centers: '100+ centers',
                  cities: '40+ cities',
                  phone: '+91 80 4567 1234',
                  website: 'https://www.davita.com',
                  color: 'border-orange-200 bg-orange-50',
                  textColor: 'text-orange-700',
                  query: 'DaVita dialysis center near me India',
                },
                {
                  name: 'Government Dialysis Centers (PMNDP)',
                  desc: 'Pradhan Mantri National Dialysis Programme — free dialysis at government hospitals across all states',
                  centers: '1000+ centers',
                  cities: 'All states',
                  phone: '1800-11-4477',
                  website: 'https://www.nhm.gov.in',
                  color: 'border-red-200 bg-red-50',
                  textColor: 'text-red-700',
                  query: 'PMNDP government dialysis center near me',
                },
                {
                  name: 'Kidney Federation of India',
                  desc: 'Lists dialysis centers across India including rural and remote areas. Helpline for locating centers',
                  centers: 'All India',
                  cities: 'All states',
                  phone: '+91 44 2836 0020',
                  website: 'https://www.kidneyindia.org',
                  color: 'border-teal-200 bg-teal-50',
                  textColor: 'text-teal-700',
                  query: 'dialysis center near me India',
                },
              ].map((chain) => (
                <div key={chain.name} className={`bg-white rounded-2xl p-5 shadow-sm border ${chain.color} overflow-hidden`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`font-bold text-base ${chain.textColor}`}>{chain.name}</h3>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{chain.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mb-3 flex-wrap">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${chain.color} ${chain.textColor}`}>
                      {chain.centers}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${chain.color} ${chain.textColor}`}>
                      {chain.cities}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Phone size={11} /> {chain.phone}
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => openGoogleMaps(chain.query)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${chain.color} ${chain.textColor} hover:opacity-80 transition-all`}>
                      <MapPin size={12} /> Find Centers Near Me
                    </button>
                    <button
                      onClick={() => window.open(chain.website, '_blank')}
                      className="flex items-center gap-1.5 text-xs bg-gray-50 text-gray-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all">
                      <ExternalLink size={12} /> Visit Website
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}