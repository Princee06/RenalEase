import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Activity, Pill, Droplets, Salad, CalendarDays,
  Stethoscope, BookOpen, Baby, Settings, LogOut, Menu, Plus,
  CheckCircle, Trash2, AlertCircle, TrendingUp, TrendingDown,
  Apple, Flame, FlaskConical, Info
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

const DAILY_LIMITS = [
  { label: 'Potassium', current: 1800, limit: 2000, unit: 'mg', color: 'bg-yellow-500', light: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' },
  { label: 'Phosphorus', current: 600, limit: 800, unit: 'mg', color: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  { label: 'Sodium', current: 1200, limit: 1500, unit: 'mg', color: 'bg-red-500', light: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
  { label: 'Fluid Intake', current: 1.2, limit: 1.5, unit: 'L', color: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  { label: 'Protein', current: 45, limit: 60, unit: 'g', color: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  { label: 'Calories', current: 1600, limit: 2000, unit: 'kcal', color: 'bg-green-500', light: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
];

const FOOD_LOG = [
  { id: 1, meal: 'Breakfast', food: 'Idli with sambar (light)', calories: 180, potassium: 200, phosphorus: 90, sodium: 160, time: '8:00 AM' },
  { id: 2, meal: 'Lunch', food: 'White rice with dal', calories: 420, potassium: 320, phosphorus: 140, sodium: 200, time: '1:00 PM' },
  { id: 3, meal: 'Snack', food: 'Apple (small)', calories: 52, potassium: 107, phosphorus: 11, sodium: 1, time: '4:00 PM' },
  { id: 4, meal: 'Dinner', food: 'Chapati with bottle gourd curry', calories: 380, potassium: 380, phosphorus: 130, sodium: 220, time: '8:00 PM' },
];

const MEALS = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

const GOOD_FOODS = [
  {
    category: 'Vegetables',
    items: ['Cabbage', 'Cauliflower', 'Bell peppers', 'Onion', 'Garlic', 'Cucumber', 'Lettuce', 'Radish', 'Eggplant', 'Green beans'],
  },
  {
    category: 'Fruits',
    items: ['Apples', 'Grapes', 'Pineapple', 'Strawberries', 'Blueberries', 'Pears', 'Peaches', 'Plums', 'Watermelon (small portions)'],
  },
  {
    category: 'Protein (moderate portions)',
    items: ['Egg whites', 'Skinless chicken', 'Fish', 'Lean turkey', 'Tofu', 'Paneer (limited)'],
  },
  {
    category: 'Grains & Carbs',
    items: ['White rice', 'Pasta', 'White bread', 'Oats', 'Rice noodles', 'Unsalted crackers'],
  },
  {
    category: 'Healthy Fats',
    items: ['Olive oil', 'Unsalted butter', 'Avocado oil (small amounts)'],
  },
  {
    category: 'Drinks',
    items: ['Water (as advised by doctor)', 'Cranberry juice (limited)', 'Clear homemade juices without added sugar'],
  },
  {
    category: 'CKD-Friendly Indian Foods',
    items: ['Idli', 'Dosa (less salt)', 'Upma', 'Poha', 'Lemon rice (light salt)', 'Bottle gourd curry', 'Ridge gourd curry', 'Plain chapati', 'Rice with simple dal (limited)'],
  },
];

const AVOID_FOODS = [
  {
    category: 'High Potassium Foods',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    items: ['Bananas', 'Oranges', 'Coconut water', 'Potatoes', 'Tomatoes', 'Spinach', 'Avocado', 'Sweet potatoes', 'Dried fruits'],
  },
  {
    category: 'High Phosphorus Foods',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    items: ['Processed cheese', 'Dark cola drinks', 'Packaged foods with phosphate additives', 'Chocolate', 'Ice cream', 'Organ meats'],
  },
  {
    category: 'High Sodium Foods',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    items: ['Chips', 'Instant noodles', 'Pickles', 'Fast food', 'Processed meats', 'Canned soups', 'Frozen meals'],
  },
  {
    category: 'Excess Protein Foods',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    items: ['Red meat (large portions)', 'Protein powders without medical advice', 'Processed meat products'],
  },
  {
    category: 'Drinks to Limit / Avoid',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    items: ['Alcohol', 'Soft drinks', 'Energy drinks', 'Excess milkshakes', 'Packaged sugary juices'],
  },
  {
    category: 'Other Foods to Limit',
    color: 'text-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    items: ['Salt-heavy snacks', 'Bakery items with sodium/phosphates', 'Packaged sauces and ketchup', 'Deep-fried foods'],
  },
  {
    category: 'Indian Foods to Avoid Frequently',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    items: ['Pickles', 'Papad', 'Salted chutney powders', 'Heavy gravies', 'Restaurant curries', 'Processed snacks'],
  },
];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] transition bg-white";

export default function Diet() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activePath, setActivePath] = useState('/diet');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('tracker');
  const [foodLog, setFoodLog] = useState(FOOD_LOG);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFood, setNewFood] = useState({
    meal: 'Breakfast', food: '', calories: '',
    potassium: '', phosphorus: '', sodium: '', time: '',
  });

  const addFood = () => {
    if (!newFood.food || !newFood.meal) return;
    const now = new Date();
    const time = newFood.time || `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setFoodLog([...foodLog, {
      id: Date.now(),
      ...newFood,
      calories: parseInt(newFood.calories) || 0,
      potassium: parseInt(newFood.potassium) || 0,
      phosphorus: parseInt(newFood.phosphorus) || 0,
      sodium: parseInt(newFood.sodium) || 0,
      time,
    }]);
    setNewFood({ meal: 'Breakfast', food: '', calories: '', potassium: '', phosphorus: '', sodium: '', time: '' });
    setShowAddForm(false);
  };

  const deleteFood = (id) => setFoodLog(foodLog.filter((f) => f.id !== id));

  const totalCalories = foodLog.reduce((acc, f) => acc + f.calories, 0);
  const totalPotassium = foodLog.reduce((acc, f) => acc + f.potassium, 0);
  const totalPhosphorus = foodLog.reduce((acc, f) => acc + f.phosphorus, 0);
  const totalSodium = foodLog.reduce((acc, f) => acc + f.sodium, 0);

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
              <h1 className="text-lg font-bold text-[#1A5276]">Diet & Lifestyle</h1>
              <p className="text-gray-400 text-xs">Track your daily nutrition and fluid intake</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#2E86AB] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
              <Plus size={16} /> Log Food
            </button>
            <div className="w-9 h-9 rounded-full bg-[#A8DADC] flex items-center justify-center text-sm font-bold text-[#1A5276]">
              {getInitials(user.fullName)}
            </div>
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Daily Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Calories Today', value: totalCalories, limit: 2000, unit: 'kcal', icon: Flame, color: 'text-orange-500', textColor: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
              { label: 'Potassium', value: totalPotassium, limit: 2000, unit: 'mg', icon: TrendingUp, color: 'text-yellow-600', textColor: 'bg-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
              { label: 'Phosphorus', value: totalPhosphorus, limit: 800, unit: 'mg', icon: FlaskConical, color: 'text-purple-500', textColor: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
              { label: 'Sodium', value: totalSodium, limit: 1500, unit: 'mg', icon: AlertCircle, color: 'text-red-500', textColor: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-200' },
            ].map((card) => {
              const Icon = card.icon;
              const pct = Math.min((card.value / card.limit) * 100, 100);
              const over = card.value > card.limit;
              return (
                <div key={card.label} className={`bg-white border ${card.border} rounded-2xl p-4 shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={20} className={card.color} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${over ? 'bg-red-50 text-red-500' : card.bg + ' ' + card.color}`}>
                      {over ? 'Over!' : 'OK'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-medium mb-1">{card.label}</p>
                  <p className="text-gray-800 text-lg font-bold">{card.value}
                    <span className="text-gray-400 text-xs font-normal ml-1">/ {card.limit} {card.unit}</span>
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full transition-all ${over ? 'bg-red-500' : card.textColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Food Form */}
          {showAddForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="font-bold text-[#1A5276] mb-4 flex items-center gap-2">
                <Plus size={18} className="text-[#2E86AB]" /> Log Food Item
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Meal</label>
                  <select value={newFood.meal}
                    onChange={(e) => setNewFood({ ...newFood, meal: e.target.value })}
                    className={inputClass}>
                    {MEALS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Food Item</label>
                  <input type="text" value={newFood.food}
                    onChange={(e) => setNewFood({ ...newFood, food: e.target.value })}
                    placeholder="e.g. White rice with dal" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Calories (kcal)</label>
                  <input type="number" value={newFood.calories}
                    onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                    placeholder="e.g. 320" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Potassium (mg)</label>
                  <input type="number" value={newFood.potassium}
                    onChange={(e) => setNewFood({ ...newFood, potassium: e.target.value })}
                    placeholder="e.g. 280" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Phosphorus (mg)</label>
                  <input type="number" value={newFood.phosphorus}
                    onChange={(e) => setNewFood({ ...newFood, phosphorus: e.target.value })}
                    placeholder="e.g. 120" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Sodium (mg)</label>
                  <input type="number" value={newFood.sodium}
                    onChange={(e) => setNewFood({ ...newFood, sodium: e.target.value })}
                    placeholder="e.g. 180" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Time (optional)</label>
                  <input type="time" value={newFood.time}
                    onChange={(e) => setNewFood({ ...newFood, time: e.target.value })}
                    className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={addFood}
                  className="bg-[#2E86AB] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1A5276] transition-all flex items-center gap-2">
                  <CheckCircle size={16} /> Save Food
                </button>
                <button onClick={() => setShowAddForm(false)}
                  className="border border-gray-200 text-gray-500 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              { key: 'tracker', label: 'Food Tracker', icon: Apple },
              { key: 'limits', label: 'Daily Limits', icon: TrendingDown },
              { key: 'guide', label: 'CKD Food Guide', icon: BookOpen },
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

          {/* Food Tracker Tab */}
          {activeTab === 'tracker' && (
            <div className="flex flex-col gap-4">
              {MEALS.map((meal) => {
                const mealFoods = foodLog.filter((f) => f.meal === meal);
                if (mealFoods.length === 0) return null;
                return (
                  <div key={meal} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#1A5276] text-sm mb-3 flex items-center gap-2">
                      <Apple size={16} className="text-[#2E86AB]" /> {meal}
                      <span className="ml-auto text-xs text-gray-400">
                        {mealFoods.reduce((a, f) => a + f.calories, 0)} kcal
                      </span>
                    </h3>
                    <div className="flex flex-col gap-2">
                      {mealFoods.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{item.food}</p>
                            <div className="flex gap-3 mt-0.5 flex-wrap">
                              <span className="text-xs text-gray-400">{item.calories} kcal</span>
                              <span className="text-xs text-yellow-600">K: {item.potassium}mg</span>
                              <span className="text-xs text-purple-600">P: {item.phosphorus}mg</span>
                              <span className="text-xs text-red-500">Na: {item.sodium}mg</span>
                              {item.time && <span className="text-xs text-gray-400">{item.time}</span>}
                            </div>
                          </div>
                          <button onClick={() => deleteFood(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors ml-3">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {foodLog.length === 0 && (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                  <Apple size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No food logged today</p>
                  <p className="text-gray-300 text-sm mt-1">Click "Log Food" to add your meals</p>
                </div>
              )}
            </div>
          )}

          {/* Daily Limits Tab */}
          {activeTab === 'limits' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {DAILY_LIMITS.map((item) => {
                const pct = Math.min((item.current / item.limit) * 100, 100);
                const over = item.current > item.limit;
                return (
                  <div key={item.label} className={`bg-white rounded-2xl p-5 shadow-sm border ${item.border}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-[#1A5276] text-sm">{item.label}</p>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        over ? 'bg-red-50 text-red-500' : item.light + ' ' + item.text
                      }`}>
                        {over ? 'Over Limit!' : 'Within Limit'}
                      </span>
                    </div>
                    <div className="flex items-end justify-between mb-2">
                      <p className="text-2xl font-bold text-gray-800">{item.current}
                        <span className="text-sm text-gray-400 font-normal ml-1">{item.unit}</span>
                      </p>
                      <p className="text-xs text-gray-400">Limit: {item.limit} {item.unit}</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${over ? 'bg-red-500' : item.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{Math.round(pct)}% of daily limit used</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* CKD Food Guide Tab */}
          {activeTab === 'guide' && (
            <div className="flex flex-col gap-6">

              {/* Disclaimer */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  CKD diet varies based on your stage, dialysis status, potassium/phosphorus levels, diabetes, and fluid restrictions. Always consult your nephrologist or dietitian before making dietary changes.
                </p>
              </div>

              {/* Kidney Friendly Foods */}
              <div>
                <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-500" /> Kidney-Friendly Foods
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {GOOD_FOODS.map((group) => (
                    <div key={group.category} className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
                      <h3 className="font-bold text-[#1A5276] text-sm mb-3 flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" /> {group.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span key={item} className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foods to Avoid */}
              <div>
                <h2 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-red-500" /> Foods to Avoid
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {AVOID_FOODS.map((group) => (
                    <div key={group.category} className={`bg-white rounded-2xl p-5 shadow-sm border ${group.border}`}>
                      <h3 className={`font-bold text-sm mb-3 flex items-center gap-2 ${group.color}`}>
                        <AlertCircle size={14} /> {group.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span key={item} className={`text-xs font-medium px-3 py-1 rounded-full border ${group.bg} ${group.color} ${group.border}`}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}