import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Quiz from './components/Quiz';
import GiftCard from './components/GiftCard';
import MockupGenerator from './components/MockupGenerator';
import BackgroundCanvas from './components/BackgroundCanvas';
import CustomCursor from './components/CustomCursor';
import { Brain, Sparkles, Gift, Heart, ArrowRight, CheckCircle2, Github, Mail, Eye, EyeOff } from 'lucide-react';
import PersonalityLibrary from './components/PersonalityLibrary';
import FilterBar from './components/FilterBar';
import AdminDashboard from './components/AdminDashboard';
import ProcessSection from './components/ProcessSection';
import QuizCTA from './components/QuizCTA';

const ALL_GIFTS = [
  { id: 'GT-X01', name: 'Premium Mechanical Keyboard', category: 'Personality', price: 4200, mbti_types: ['INTJ'], description: 'Precision engineered for the strategic mind.' },
  { id: 'GT-X02', name: 'Vibrant DIY Art Kit', category: 'Anniversary', price: 1200, mbti_types: ['ENFP'], description: 'A canvas of endless creative potential.' },
  { id: 'GT-X03', name: 'Personal Glow Night Light', category: 'Anniversary', price: 899, mbti_types: ['ISFP'], description: 'Soften your space with a personalized glow.' },
  { id: 'GT-X04', name: 'Whiskey Decanter Presentation Set', category: 'Promotional', price: 4500, mbti_types: ['ENTJ'], description: 'A trophy of achievement for the ambitious leader.' },
  { id: 'GT-X05', name: 'Multi-Device Power Station', category: 'Promotional', price: 2800, mbti_types: ['INTP'], description: 'Uninterrupted power for the infinite researcher.' },
  { id: 'GT-X06', name: 'Leather Desk Mat', category: 'Promotional', price: 1500, mbti_types: ['ISTJ'], description: 'Luxury organization for the orderly perfectionist.' },
  { id: 'GT-X07', name: 'Ceramic Marble Mugs', category: 'Anniversary', price: 729, mbti_types: ['ISFJ'], description: 'Timeless warmth for the dedicated protector.' },
  { id: 'GT-X08', name: 'Fridge Magnets (Custom)', category: 'Anniversary', price: 249, mbti_types: ['ENFP'], description: 'Small moments, big memories.' },
  { id: 'GT-X09', name: '5-in-1 Leather Clutch', category: 'Anniversary', price: 1995, mbti_types: ['ESTJ'], description: 'Classic elegance for the decisive executive.' },
  { id: 'GT-X10', name: 'Photo Glow Lamp', category: 'Anniversary', price: 1199, mbti_types: ['ESFP'], description: 'Illuminate your most vibrant memories.' },
  { id: 'GT-X11', name: 'Wooden Bottle Box', category: 'Anniversary', price: 3899, mbti_types: ['ENFJ'], description: 'A sophisticated tribute to shared success.' },
  { id: 'GT-X12', name: 'Personalized Beer Stein', category: 'Promotional', price: 1200, mbti_types: ['ESTP'], description: 'A bold vessel for the spontaneous entrepreneur.' },
  { id: 'GT-X13', name: 'Precision Watch Tool Kit', category: 'Promotional', price: 3200, mbti_types: ['ISTP'], description: 'The ultimate tool for the technical virtuoso.' },
  { id: 'GT-X14', name: 'Engraved Wooden Watch', category: 'Promotional', price: 2500, mbti_types: ['INFP'], description: 'Timeless style for the poetic mediator.' },
];

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); // home, quiz, recommendations, customize
  const [userMbti, setUserMbti] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [filters, setFilters] = useState({ budget: 'all', category: 'all' });
  const [authMode, setAuthMode] = useState('login'); // login, signup
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch both user profile and orders
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        setUser(res.data.user);
        setIsLoggedIn(true);
        if (res.data.user.mbti_type) setUserMbti(res.data.user.mbti_type);
        fetchOrders(); // Get recent orders too
      }).catch(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      });
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload = { ...formData };
      if (userMbti) {
        payload.mbti_type = userMbti;
      }
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);

      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setView('home');
    } catch (error) {
      console.error('Auth error:', error);
      if (error.response?.status === 409) {
        alert('This email is already registered. Switching you to Sign In.');
        setAuthMode('login');
      } else {
        const msg = error.response?.data?.error || error.message || 'Authentication failed';
        alert(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    alert(`${provider} login is currently simulating OAuth. Please use your standard email and password to create a real account.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
    setView('home');
  };

  const handleQuizComplete = async (answers) => {
    setIsLoading(true);
    try {
      console.log('Quiz completed with answers:', answers);

      // 1. Set filters from Q1 (Occasion) and Q2 (Budget)
      const occasion = answers[0];
      const budget = answers[1];
      setFilters({ category: occasion, budget: budget });

      // 2. Analyze personality (Q3-Q10)
      const quizResponse = await axios.post('http://localhost:5000/api/quiz/predict', { answers }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const mbti = quizResponse.data.mbti_type;
      console.log('Predicted MBTI:', mbti);
      setUserMbti(mbti);

      // 3. Get recommendations based on the predicted MBTI
      const giftsResponse = await axios.get(`http://localhost:5000/api/gifts?mbti=${mbti}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Recommendations found:', giftsResponse.data.gifts);
      setRecommendations(giftsResponse.data.gifts);

      setView('recommendations');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to get personality analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const filteredRecommendations = ALL_GIFTS.filter(gift => {
    // Behavior Filter (Personality Match)
    const matchesMbti = filters.category === 'Personality' ? gift.mbti_types?.includes(userMbti) : true;

    // Category Filter
    const matchesCategory = filters.category === 'all' || filters.category === 'Personality' ? true : gift.category === filters.category;

    // Budget Filter
    let matchesBudget = true;
    const price = gift.price || gift.basePrice;
    if (filters.budget === '500') matchesBudget = price <= 600;
    else if (filters.budget === '1500') matchesBudget = price <= 1500;
    else if (filters.budget === '3000') matchesBudget = price <= 3000;
    else if (filters.budget === '5000') matchesBudget = price > 3000;
    else if (filters.budget === 'under-600') matchesBudget = price < 600;
    else if (filters.budget === '600-1500') matchesBudget = price >= 600 && price <= 1500;
    else if (filters.budget === '1500-4000') matchesBudget = price > 1500 && price <= 4000;
    else if (filters.budget === 'over-4000') matchesBudget = price > 4000;

    return matchesMbti && matchesCategory && matchesBudget;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#06060f] text-[#f5f3ee] selection:bg-[#f0d060]/30 transition-all duration-700">
        <BackgroundCanvas />
        <CustomCursor />

        <main className="relative z-10">
          {/* HERO SECTION */}
          <Hero onStartQuiz={() => {
            document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
            setAuthMode('signup');
          }} />

          {/* PROCESS SECTION */}
          <ProcessSection />

          {/* PERSONALITY GALLERY OVERVIEW */}
          <section className="py-32 bg-[#06060f] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-20 text-center">
                <div className="text-[#f0d060] font-caveat text-2xl mb-4 italic">// The Library</div>
                <h2 className="text-6xl font-playfair font-black text-white">All 16 <em className="grad-text hero-gradient italic">Types</em>, One Platform</h2>
                <p className="text-[#9090b0] mt-6 text-xl font-medium max-w-2xl mx-auto">Explore the core blueprints of human behavior and find gifts that truly resonate with their inner essence.</p>
              </div>
              <PersonalityLibrary />
              <div className="mt-12 text-center">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-primary"
                >
                  Unlock Your Blueprint →
                </button>
              </div>
            </div>
          </section>

          {/* AUTH SECTION */}
          <section id="auth-section" className="py-32 px-6 bg-[#06060f] border-t border-white/5 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="auth-tabs flex bg-white/5 p-1 rounded-2xl mb-12">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-[#f0d060] text-[#0a0a0f]' : 'text-[#9090b0] hover:text-white'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${authMode === 'signup' ? 'bg-[#f0d060] text-[#0a0a0f]' : 'text-[#9090b0] hover:text-white'}`}
                >
                  Create Account
                </button>
              </div>

              <div className="text-center mb-10">
                <h3 className="text-4xl font-playfair font-black mb-3">
                  {authMode === 'login' ? 'Welcome Back' : 'Access GiftGenie'}
                </h3>
                <p className="text-[#9090b0] text-sm">
                  {authMode === 'login' ? 'Your personality results are waiting.' : 'Join the elite gifting circle today.'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#9090b0] uppercase tracking-widest ml-1">Identity</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-sm font-medium text-white focus:border-[#f0d060]/40 transition-all outline-none"
                      placeholder="Your Full Name"
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#9090b0] uppercase tracking-widest ml-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-sm font-medium text-white focus:border-[#f0d060]/40 transition-all outline-none"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-[#9090b0] uppercase tracking-widest ml-1">Access Pin</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 pr-14 text-sm font-medium text-white focus:border-[#f0d060]/40 transition-all outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9090b0] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-auth btn-primary w-full py-5 rounded-2xl"
                >
                  {isLoading ? 'Connecting to Vault...' : (authMode === 'login' ? 'Sign In →' : 'Create My Account →')}
                </button>
              </form>
            </div>
          </section>
        </main>

        <footer className="py-20 border-t border-white/5 text-center bg-[#06060f]">
          <div className="logo text-3xl mb-4 flex items-center justify-center gap-3">
            <img src="/favicon.png" alt="GiftGenie" className="w-8 h-8 object-contain rounded-lg opacity-80" />
            <span>Gift<span className="italic text-[#f0d060]">Genie</span></span>
          </div>
          <p className="text-[#9090b0]/40 text-[10px] tracking-[0.3em] uppercase font-black">© 2026 GiftGenie Platform. Engineered for Excellence.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060f] text-[#f5f3ee] selection:bg-[#f0d060]/30 transition-all duration-500">
      <BackgroundCanvas />
      <CustomCursor />

      <Navbar
        onNavigate={setView}
        activeView={view}
        user={user}
        onLogout={handleLogout}
        cartCount={orders.length}
      />

      <main className="relative z-10">
        {view === 'home' && (
          <div className="animate-fadeUp">
            <Hero onStartQuiz={() => setView('quiz')} />
            <ProcessSection />
            <section className="py-32 bg-[#06060f] border-t border-white/5">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 text-center">
                  <div className="text-[#f0d060] font-caveat text-2xl mb-4 italic">// The Blueprint</div>
                  <h2 className="text-6xl font-playfair font-black text-white">Your Personality <em className="grad-text hero-gradient italic">Matrix</em></h2>
                </div>
                <PersonalityLibrary />
              </div>
            </section>
          </div>
        )}

        {view === 'library' && (
          <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-24 text-center">
                <div className="hero-badge">Knowledge Base</div>
                <h1 className="text-7xl font-playfair font-black mb-6">Explore the <span className="hero-gradient">16 Blueprints</span></h1>
                <p className="text-[#9090b0] text-xl max-w-2xl mx-auto">Deep dive into the psychological frameworks that drive decisions, preferences, and gifting souls.</p>
              </div>
              <PersonalityLibrary />
            </div>
          </section>
        )}

        {view === 'quiz' && <Quiz onFinish={handleQuizComplete} />}

        {view === 'recommendations' && (
          <section className="py-32 px-6 min-h-screen animate-fadeUp">
            <div className="max-w-7xl mx-auto">
              <FilterBar onFilterChange={handleFilterChange} activeFilters={{ ...filters, mbti: userMbti }} />
              {filteredRecommendations.length > 0 ? (
                <>
                  <div className="text-center mb-24 space-y-6">
                    <div className="inline-block px-6 py-2 rounded-full bg-[#f0d060]/10 border border-[#f0d060]/30 text-[#f0d060] text-xs font-black uppercase tracking-widest">
                      Matched to Profile: {userMbti}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredRecommendations.map((gift) => (
                      <GiftCard key={gift.id} gift={gift} onCustomize={() => {
                        setSelectedGift(gift);
                        setView('customize');
                      }} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-20">
                  <div className="text-center py-20 bg-white/5 border border-white/5 rounded-[48px]">
                    <h3 className="text-2xl font-playfair font-black text-[#9090b0] mb-4">No gifts match your specific filters yet.</h3>
                    <p className="text-[#9090b0]/60 uppercase tracking-widest text-[10px] font-black">Explore the Full Matrix Below</p>
                  </div>
                  <PersonalityLibrary />
                </div>
              )}
            </div>
          </section>
        )}

        {view === 'customize' && (
          <MockupGenerator
            gift={selectedGift || recommendations[0]}
            user={user}
            onBack={() => setView('recommendations')}
            onOrderSuccess={fetchOrders}
          />
        )}
        {view === 'cart' && (
          <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-24 text-center">
                <div className="hero-badge">Order History</div>
                <h1 className="text-7xl font-playfair font-black mb-6">Your <span className="hero-gradient">Acquisitions</span></h1>
                <p className="text-[#9090b0] text-xl max-w-2xl mx-auto">Track the journey of your personalized gifts from blueprint to doorstep.</p>
              </div>

              {orders.length > 0 ? (
                <div className="grid grid-cols-1 gap-12">
                  {orders.map((order) => (
                    <div key={order.order_id} className="bg-white/5 border border-white/5 rounded-[48px] p-12 flex flex-col lg:flex-row gap-12 items-center">
                      <div className="text-8xl p-12 bg-white/5 rounded-[40px] border border-white/5 shadow-2xl">
                        {order.emoji || '🎁'}
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="flex flex-wrap items-center gap-4">
                          <h3 className="text-4xl font-playfair font-black text-white">{order.gift_name}</h3>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'confirmed' ? 'bg-[#f0d060]/10 text-[#f0d060] border border-[#f0d060]/30' : 'bg-[#9090b0]/10 text-[#9090b0] border border-white/10'}`}>
                            {order.status}
                          </div>
                        </div>
                        <p className="text-[#9090b0] font-medium text-lg leading-relaxed">
                          Personalized for <span className="text-white font-bold">{order.custom_name}</span> with message: <span className="text-white italic">"{order.custom_message}"</span>
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                          <div>
                            <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-1">Order Protocol</span>
                            <span className="font-mono text-xs">{order.order_id}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-1">Value</span>
                            <span className="text-white font-bold">₹{order.amount}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-1">Theme</span>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: order.custom_color }} />
                              <span className="font-mono text-[10px]">{order.custom_color}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#9090b0] uppercase font-black block mb-1">Estimated Arrival</span>
                            <span className="text-white font-bold">{order.estimated_delivery}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-40 bg-white/5 border border-white/5 rounded-[64px] border-dashed">
                  <h3 className="text-3xl font-playfair font-black text-[#9090b0] mb-6">Your collection is currently empty.</h3>
                  <button onClick={() => setView('home')} className="btn-primary">Initialize First Acquisition →</button>
                </div>
              )}
            </div>
          </section>
        )}
        {view === 'admin' && <AdminDashboard />}
      </main>

      <footer className="py-20 border-t border-white/5 text-center bg-[#06060f]">
        <div className="logo text-3xl mb-4 flex items-center justify-center gap-3">
          <img src="/favicon.png" alt="GiftGenie" className="w-8 h-8 object-contain rounded-lg opacity-80" />
          <span>Gift<span className="italic text-[#f0d060]">Genie</span></span>
        </div>
        <p className="text-[#9090b0]/40 text-[10px] tracking-[0.3em] uppercase font-black">© 2026 GiftGenie Platform. Engineered for Excellence.</p>
      </footer>
    </div>
  );
};

export default App;
