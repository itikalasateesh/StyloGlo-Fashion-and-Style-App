import React, { useState, useRef, useEffect } from 'react';
import { AppTab, AnalysisState, StyleAnalysis, Recommendation } from './types';
import { HomeIcon, CameraIcon, GridIcon, UserIcon, SparklesIcon, ChevronRightIcon } from './components/Icons';
import { analyzeStyle, transformStyle } from './geminiService';
import { ScannerOverlay } from './components/ScannerOverlay';

// --- SHARED ICONS ---
const InfoIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
  </svg>
);

const ShopIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const TryOnIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ShareIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const LocationIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ExitIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const BoltIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const RefreshIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const FullViewIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.675 1.439 5.662 1.439h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
);

const FacebookIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

// --- HELPER COMPONENTS ---

const MetricProgressBar = ({ label, value, color, icon }: { label: string, value: number, color: string, icon: React.ReactNode }) => (
  <div className="w-[140px] bg-black/40 backdrop-blur-xl border border-white/5 p-3 rounded-2xl shadow-xl">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5">
        <div style={{ color }} className="opacity-80">{icon}</div>
        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-[10px] font-black text-white">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  </div>
);

const ColorBadge = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="bg-black/40 backdrop-blur-xl border border-white/5 px-4 py-2.5 rounded-2xl flex items-center gap-3">
    <div className="w-4 h-4 rounded-full border border-white/20 shadow-lg" style={{ backgroundColor: color }} />
    <div className="flex flex-col">
      <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</span>
      <span className="text-[10px] font-black text-white uppercase tracking-wider">{value}</span>
    </div>
  </div>
);

const CameraInterface = ({ onCapture, onCancel }: { onCapture: (img: string) => void, onCancel: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { onCancel(); }
    }
    start();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);
  const snap = () => {
    if (videoRef.current && canvasRef.current) {
      const c = canvasRef.current;
      c.width = videoRef.current.videoWidth;
      c.height = videoRef.current.videoHeight;
      c.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      onCapture(c.toDataURL('image/jpeg'));
    }
  };
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-10 flex flex-col items-center gap-6">
        <button onClick={snap} className="w-20 h-20 bg-white rounded-full p-1.5 shadow-2xl border-4 border-white/20"><div className="w-full h-full rounded-full border-4 border-black" /></button>
        <button onClick={onCancel} className="text-white font-bold uppercase text-xs tracking-widest">Cancel</button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [analysis, setAnalysis] = useState<AnalysisState>({ status: 'idle', image: null, result: null });
  const [scanStage, setScanStage] = useState<'mapping' | 'face' | 'pigmentation' | 'analyzing'>('mapping');
  const [activeCategory, setActiveCategory] = useState<'hair' | 'outfit' | 'access' | 'diet' | 'tattoo'>('hair');
  const [subCategory, setSubCategory] = useState<string>('hair');
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [tryOnState, setTryOnState] = useState<'idle' | 'scanning' | 'applied'>('idle');
  const [activeTryOnStyle, setActiveTryOnStyle] = useState<Recommendation | null>(null);
  const [displayedImage, setDisplayedImage] = useState<string | null>(null);
  const [isFullView, setIsFullView] = useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  const demographicBackgrounds = [
    { id: 'ref-female', label: 'STYLE', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000' },
    { id: 'male-model', label: 'MALE', url: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=1000' },
    { id: 'boys', label: 'BOYS', url: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1000' },
    { id: 'girls', label: 'GIRLS', url: 'https://images.unsplash.com/photo-1529139513055-07f9127e6db2?auto=format&fit=crop&q=80&w=1000' },
    { id: 'men-mid', label: 'MEN', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000' },
    { id: 'women-mid', label: 'WOMEN', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1000' }
  ];

  const categorySubOptions: Record<string, string[]> = {
    hair: ['hair', 'beard'],
    outfit: ['Party', 'Wedding', 'Office', 'Fashion', 'Travel', 'Beach', 'Trekking', 'Summer', 'Winter', 'Rainy'],
    access: ['Shoes', 'Watches', 'Sunglasses', 'Caps', 'Bands', 'Studs', 'Belts', 'Ties'],
    tattoo: ['Face', 'Neck', 'Fingers', 'Hands', 'Shoulder', 'Front', 'Back', 'Belly', 'Waist', 'Legs'],
    diet: ['Protein', 'Powders', 'Salads', 'DryFruits', 'Fruits', 'Seeds', 'Keto', 'NonVeg', 'Veg', 'GreenLeaves']
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeTab === AppTab.HOME && !isCapturing && isAuthenticated) {
        const interval = setInterval(() => {
            setCurrentGroupIndex(prev => (prev + 1) % demographicBackgrounds.length);
        }, 6000);
        return () => clearInterval(interval);
    }
  }, [activeTab, isCapturing, isAuthenticated]);

  // When active category changes, reset sub-category to default
  useEffect(() => {
    setSubCategory(categorySubOptions[activeCategory][0]);
  }, [activeCategory]);

  const handleMediaSelected = (image: string) => {
    setAnalysis({ status: 'previewing', image: image, result: null });
    setDisplayedImage(image);
    setActiveTab(AppTab.ANALYSIS);
    setIsCapturing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => { handleMediaSelected(event.target?.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!analysis.image) return;
    setAnalysis(prev => ({ ...prev, status: 'scanning' }));
    try {
      setScanStage('mapping'); await new Promise(r => setTimeout(r, 1500));
      setScanStage('face'); await new Promise(r => setTimeout(r, 2000));
      setScanStage('pigmentation'); await new Promise(r => setTimeout(r, 2000));
      setScanStage('analyzing');
      const result = await analyzeStyle(analysis.image);
      setAnalysis(prev => ({ status: 'completed', image: prev.image, result }));
    } catch (err: any) { setAnalysis(prev => ({ ...prev, status: 'error', error: err.message })); }
  };

  const startTryOn = async (style: Recommendation) => {
    if (!analysis.image) return;
    setActiveTryOnStyle(style);
    setTryOnState('scanning');
    try {
      const categoryLabel = activeCategory === 'hair' ? subCategory : activeCategory;
      const transformed = await transformStyle(analysis.image, style.title, categoryLabel);
      setDisplayedImage(transformed);
      setTryOnState('applied');
    } catch (err) {
      setTryOnState('idle');
      alert("Try On failed. Please try again.");
    }
  };

  const resetTryOn = () => {
    setTryOnState('idle');
    setActiveTryOnStyle(null);
    setDisplayedImage(analysis.image);
    setIsFullView(false);
  };

  const handleBackToSelection = () => {
    // Return to selection mode but don't reset the applied image (as requested)
    setTryOnState('idle');
    setIsFullView(false);
  };

  const handleNativeShare = async () => {
    if (!displayedImage) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My StyloGlo Look',
          text: `Check out my new ${activeTryOnStyle?.title || 'style'} look on StyloGlo!`,
          url: window.location.href
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setIsShareSheetOpen(true);
      }
    } else {
      setIsShareSheetOpen(true);
    }
  };

  function renderSplashScreen() {
    return (
      <div className="h-screen w-full bg-[#0a0f1d] flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-cyan-400/20 rounded-full" />
          <div className="absolute inset-0 w-24 h-24 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <SparklesIcon className="absolute inset-0 m-auto w-12 h-12 text-cyan-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">STYLO<span className="text-cyan-400">GLO</span></h1>
        <p className="text-cyan-400/40 text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">Initializing AI Stylist</p>
      </div>
    );
  }

  function renderLogin() {
    return (
      <div className="h-screen w-full bg-[#0a0f1d] p-8 flex flex-col justify-center animate-in fade-in duration-700">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">STYLO<span className="text-cyan-400">GLO</span></h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Welcome back to the future of style</p>
        </div>
        <div className="space-y-4 mb-6">
          <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-cyan-400/50 transition-colors" />
          <input type="password" placeholder="PASSWORD" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-cyan-400/50 transition-colors" />
        </div>
        <button onClick={() => setIsAuthenticated(true)} className="w-full py-5 bg-gradient-to-r from-rose-500 to-cyan-500 text-white rounded-[35px] font-black uppercase tracking-widest text-sm shadow-[0_15px_30px_rgba(233,30,99,0.3)] mb-10 active:scale-[0.98] transition-all">Sign In</button>
        <div className="text-center">
          <button onClick={() => setAuthStep('signup')} className="text-white/40 text-[10px] font-black uppercase tracking-widest group">Don't have an account? <span className="text-cyan-400 group-hover:underline">Join now</span></button>
        </div>
      </div>
    );
  }

  function renderSignUp() {
    return (
      <div className="h-screen w-full bg-[#0a0f1d] p-8 flex flex-col justify-center animate-in fade-in duration-700">
        <div className="mb-10 text-center"><h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">STYLO<span className="text-cyan-400">GLO</span></h1><p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Start your style journey today</p></div>
        <div className="space-y-4 mb-10">
          <input type="text" placeholder="FULL NAME" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-cyan-400/50 transition-colors" />
          <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-cyan-400/50 transition-colors" />
          <input type="password" placeholder="PASSWORD" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-cyan-400/50 transition-colors" />
        </div>
        <button onClick={() => setIsAuthenticated(true)} className="w-full py-5 bg-gradient-to-r from-rose-500 to-cyan-500 text-white rounded-[35px] font-black uppercase tracking-widest text-sm shadow-[0_15px_30px_rgba(233,30,99,0.3)] mb-8 active:scale-[0.98] transition-all">Create Account</button>
        <div className="text-center"><button onClick={() => setAuthStep('login')} className="text-white/40 text-[10px] font-black uppercase tracking-widest group">Already a member? <span className="text-cyan-400 group-hover:underline">Log In</span></button></div>
      </div>
    );
  }

  function renderHome() {
    return (
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar pt-safe pb-safe bg-[#0a0f1d]">
        <header className="flex justify-between items-center px-6 pt-6 pb-6">
          <div><h1 className="text-[28px] font-black text-white tracking-tighter leading-none uppercase">STYLO<span className="text-cyan-400">GLO</span></h1><p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.25em] mt-1.5">ELEVATE YOUR STYLE</p></div>
          <button onClick={() => setIsAuthenticated(false)} className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 transition-all"><ExitIcon className="w-5 h-5" /></button>
        </header>
        <section className="px-6 mb-10">
          <div className="relative w-full aspect-[4/5] rounded-[50px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            {demographicBackgrounds.map((group, idx) => (<img key={group.id} src={group.url} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ${currentGroupIndex === idx ? 'opacity-100' : 'opacity-0'}`} alt={`${group.label} demographic`} />))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 pb-14 text-center">
              <h2 className="text-[44px] font-black text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl">SCAN YOUR LOOK</h2>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.18em] max-w-[280px] leading-relaxed mb-12 drop-shadow-lg">UNLOCK YOUR PERSONALIZED AI STYLE RECOMMENDATIONS</p>
              <button onClick={() => setIsCapturing(true)} className="w-full max-w-[280px] py-4 bg-gradient-to-r from-rose-500 to-cyan-500 text-white rounded-[35px] font-black uppercase tracking-widest text-sm shadow-[0_15px_30px_rgba(233,30,99,0.3)] active:scale-[0.97] transition-all flex items-center justify-center gap-4 group"><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><CameraIcon className="w-5 h-5" /></div><span className="text-base tracking-widest">Take Selfie</span></button>
              <button onClick={() => fileInputRef.current?.click()} className="mt-8 text-white/50 text-[11px] font-black uppercase tracking-[0.3em] active:text-white transition-colors">Or upload from gallery</button>
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-1.5">{demographicBackgrounds.map((_, i) => (<div key={i} className={`h-1 rounded-full transition-all duration-500 ${currentGroupIndex === i ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20'}`} />))}</div>
          </div>
        </section>
        <section className="px-6 grid grid-cols-2 gap-4 mb-8">
          <button className="h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-white/90 font-black uppercase text-[10px] tracking-widest active:bg-white/10 transition-colors shadow-lg"><UserIcon className="w-5 h-5 text-white/40" /> My Stats</button>
          <button onClick={() => setActiveTab(AppTab.ANALYSIS)} className="h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-white/90 font-black uppercase text-[10px] tracking-widest active:bg-white/10 transition-colors shadow-lg"><SparklesIcon className="w-5 h-5 text-pink-400" /> Recent</button>
        </section>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div className="p-6 pt-safe h-full flex flex-col pb-safe bg-[#0a0f1d]">
         <div className="flex items-center gap-5 mb-10 pt-4"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-rose-500 to-cyan-500 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-pink-500/20 uppercase">UG</div><div><h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">User_Google</h2><p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Premium Member</p></div></div>
         <div className="space-y-3 flex-1">{['Preferences', 'Style Biometrics', 'Subscription Plan', 'Help & Support'].map((item, i) => (<div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl uppercase text-[10px] font-black tracking-[0.2em] text-white/60 active:bg-white/10 transition-colors"><span>{item}</span><ChevronRightIcon /></div>))}</div>
         <button onClick={() => setIsAuthenticated(false)} className="mb-24 w-full py-5 bg-red-500/10 text-red-500 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-red-500/20">Sign Out</button>
      </div>
    );
  }

  function renderStyleDetail() {
    if (!analysis.result || !displayedImage) return null;
    
    // Get recommendations for current active category and sub-category
    const categoryRecs = analysis.result.recommendations[activeCategory] || {};
    const recommendations = categoryRecs[subCategory] || [];

    const navCategories = [
      { id: 'hair', label: 'HAIR', icon: <SparklesIcon className="w-5 h-5" /> },
      { id: 'outfit', label: 'OUTFITS', icon: <BoltIcon className="w-5 h-5" /> },
      { id: 'access', label: 'ACCESS.', icon: <BoltIcon className="w-5 h-5" /> },
      { id: 'tattoo', label: 'TATTOO', icon: <SparklesIcon className="w-5 h-5" /> },
      { id: 'diet', label: 'DIET', icon: <SparklesIcon className="w-5 h-5" /> }
    ];

    const currentSubOptions = categorySubOptions[activeCategory];

    // Category-specific scaling for Full View (Outfit, Access, Tattoo need top-to-bottom body context)
    const isFullBodyCategory = ['outfit', 'access', 'tattoo'].includes(activeCategory);

    // Transformation applied means we only show minimal UI (Back + Share) and remove menu category
    const isApplied = tryOnState === 'applied';

    return (
      <div className="h-full w-full relative bg-[#0a0f1d] flex flex-col pt-safe pb-0 overflow-hidden">
        {/* Background Image Layer */}
        <div className={`absolute inset-0 z-0 transition-all duration-700 ${(isFullView || isApplied) ? 'scale-100' : 'scale-105'}`}>
          <img 
            src={displayedImage} 
            className={`w-full h-full ${((isFullView || isApplied) && isFullBodyCategory) ? 'object-contain' : 'object-cover'} transition-all duration-700`} 
            alt="User Look" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10" />
          {tryOnState === 'scanning' && (
            <div className="absolute inset-0 z-[100] overflow-hidden pointer-events-none">
              <div className="absolute inset-x-0 h-[3px] bg-white shadow-[0_0_50px_10px_white,0_0_30px_5px_#22d3ee] animate-scan-3d" />
            </div>
          )}
        </div>

        {/* Top Header UI - Hidden if Applied or Full View */}
        {(!isApplied && !isFullView) && (
          <header className={`relative z-20 flex justify-between items-center px-6 py-4 transition-all duration-500 ${tryOnState === 'scanning' ? 'opacity-0' : 'opacity-100'}`}>
            <button onClick={() => setActiveTab(AppTab.HOME)} className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 text-white active:scale-90 transition-all">
              <HomeIcon className="w-5 h-5" />
            </button>
            <div className="flex gap-2.5">
              <button onClick={() => setActiveTab(AppTab.ANALYSIS)} className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 text-white active:scale-90 transition-all">
                <InfoIcon className="w-5 h-5" />
              </button>
              <button onClick={() => setIsFullView(true)} className={`w-10 h-10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 text-white transition-all active:scale-90 bg-black/40`}>
                <FullViewIcon className="w-5 h-5" />
              </button>
              <button onClick={resetTryOn} className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 text-white active:scale-90 transition-all">
                <RefreshIcon className="w-5 h-5" />
              </button>
            </div>
          </header>
        )}

        <div className="flex-1" />

        {/* Floating Controls Overlay (Visible in Full View or after application) */}
        {(isApplied || isFullView) && (
          <div className={`relative z-[40] flex justify-center gap-6 mb-8 animate-in slide-in-from-bottom-5 duration-700 ${(isFullView || isApplied) ? 'mb-16' : ''}`}>
             <button 
               onClick={() => (isFullView || isApplied) ? handleBackToSelection() : handleBackToSelection()} 
               className="w-14 h-14 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-2xl"
             >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15 19l-7-7 7-7"/></svg>
             </button>
             <button 
               onClick={handleNativeShare} 
               className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-[0_0_25px_rgba(233,30,99,0.5)]"
             >
               <ShareIcon className="w-7 h-7" />
             </button>
          </div>
        )}

        {/* Recommendation Interface (Hidden in Full View and Post-Transformation) */}
        <div className={`relative z-20 bg-gradient-to-t from-black via-black/95 to-transparent pt-4 transition-all duration-700 ${tryOnState === 'scanning' || isFullView || isApplied ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          {(!isFullView && !isApplied) && (
            <div className="px-5 mb-2 translate-y-3">
              <div className="flex justify-between items-center mb-2 px-1">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Recommended {activeCategory.toUpperCase()}</h3>
                <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">{recommendations.length} Options</span>
              </div>

              {/* Sub-category Slider - Compact Layout */}
              <div className="flex overflow-x-auto gap-1.5 pb-3 no-scrollbar mb-1">
                {currentSubOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSubCategory(opt)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                      subCategory === opt 
                        ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Compact Style Cards Slider */}
              <div className="flex overflow-x-auto gap-3.5 pb-4 no-scrollbar -mx-5 px-5 min-h-[120px]">
                {recommendations.length > 0 ? recommendations.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-shrink-0 w-24">
                    <div onClick={() => startTryOn(item)} className="relative w-24 h-24 mb-2.5 overflow-hidden rounded-full border border-white/10 p-0.5 bg-black/40 active:scale-95 transition-transform cursor-pointer shadow-lg">
                      <img 
                        src={`https://images.unsplash.com/photo-${1500000000000 + (idx * 117)}?auto=format&fit=crop&q=80&w=250`} 
                        className="w-full h-full object-cover rounded-full opacity-70" 
                        alt={item.title} 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-2">
                        <span className="text-[8px] font-black text-white uppercase text-center leading-tight tracking-tight">{item.title}</span>
                      </div>
                      {item.badge && <span className="absolute top-1 right-1 bg-rose-500 text-[6px] font-black text-white px-1 py-0.5 rounded-full uppercase z-10">{item.badge}</span>}
                    </div>
                    <div className="flex gap-1.5 w-full">
                       <button onClick={() => startTryOn(item)} className="flex-1 py-1 bg-cyan-500/10 border border-cyan-400/20 rounded-lg flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-black transition-all" title="Try On"><TryOnIcon /></button>
                       <button className="flex-1 py-1 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/40 active:bg-white/20 transition-all" title="Shop"><ShopIcon /></button>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center w-full h-24 text-white/20 italic text-[10px] tracking-widest uppercase">
                    No results found.
                  </div>
                )}
              </div>
              
              {/* Nearby Buttons (Hidden in Full View and Post-Transformation) */}
              <div className="flex justify-center mb-3">
                <button className="bg-black/60 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95">
                  <LocationIcon className="w-3 h-3" /> Find Nearby Services
                </button>
              </div>
            </div>
          )}

          {/* Bottom Menu Category Nav Bar (Hidden in Full View and Post-Transformation) */}
          {(!isFullView && !isApplied) && (
            <div className="bg-black px-4 pt-3 pb-12 rounded-t-[35px] border-t border-white/5">
              <div className="flex items-center justify-around">
                {navCategories.map((cat) => (
                  <button key={cat.id} onClick={() => { setActiveCategory(cat.id as any); setTryOnState('idle'); }} className={`flex flex-col items-center gap-1.5 transition-all ${activeCategory === cat.id ? 'text-cyan-400' : 'text-white/30'}`}>
                    <div className={`p-2 rounded-xl transition-all ${activeCategory === cat.id ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30' : 'bg-white/5 opacity-50'}`}>{cat.icon}</div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${activeCategory === cat.id ? 'opacity-100' : 'opacity-40'}`}>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Share Sheet Fallback */}
        {isShareSheetOpen && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsShareSheetOpen(false)} />
            <div className="relative w-full max-w-md bg-[#121212] border-t border-white/10 rounded-t-[40px] p-8 shadow-2xl">
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-black text-white uppercase tracking-tight text-center mb-8">Share Your New Look</h3>
              <div className="grid grid-cols-4 gap-4 mb-10">
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check out my look on StyloGlo: ' + window.location.href)}`)} className="flex flex-col items-center gap-3"><div className="w-16 h-16 bg-[#25D366]/20 text-[#25D366] rounded-3xl flex items-center justify-center border border-[#25D366]/30 shadow-xl"><WhatsAppIcon /></div><span className="text-[9px] font-black text-white/50 uppercase tracking-widest">WhatsApp</span></button>
                <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)} className="flex flex-col items-center gap-3"><div className="w-16 h-16 bg-[#1877F2]/20 text-[#1877F2] rounded-3xl flex items-center justify-center border border-[#1877F2]/30 shadow-xl"><FacebookIcon /></div><span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Facebook</span></button>
                <button onClick={() => { const a = document.createElement('a'); a.href = displayedImage || ''; a.download = 'look.jpg'; a.click(); }} className="flex flex-col items-center gap-3"><div className="w-16 h-16 bg-white/5 text-white rounded-3xl flex items-center justify-center border border-white/10 shadow-xl"><RefreshIcon className="w-8 h-8" /></div><span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Download</span></button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); setIsShareSheetOpen(false); }} className="flex flex-col items-center gap-3"><div className="w-16 h-16 bg-white/5 text-white rounded-3xl flex items-center justify-center border border-white/10 shadow-xl"><InfoIcon className="w-8 h-8" /></div><span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Link</span></button>
              </div>
              <button onClick={() => setIsShareSheetOpen(false)} className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[11px]">Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderAnalysis() {
    if (analysis.status === 'idle') return (
      <div className="h-full flex flex-col p-6 pt-safe pb-safe bg-[#0a0f1d] items-center justify-center text-center">
        <div className="w-20 h-20 glass-card text-cyan-400 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/10"><CameraIcon className="w-10 h-10" /></div>
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Scan your style</h2>
        <p className="text-white/40 mb-10 max-w-[280px] text-sm leading-relaxed">AI-powered biometrics and fashion intelligence for your perfect look.</p>
        <div className="w-full space-y-4 px-4 max-w-sm">
          <button onClick={() => setIsCapturing(true)} className="w-full py-5 bg-gradient-to-r from-rose-500 to-cyan-500 text-white rounded-3xl font-black shadow-xl flex items-center justify-center gap-3 uppercase text-sm tracking-widest"><CameraIcon className="w-6 h-6" /> Take Selfie</button>
          <button onClick={() => fileInputRef.current?.click()} className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-3xl font-black flex items-center justify-center gap-3 uppercase text-sm tracking-widest"><GridIcon className="w-6 h-6" /> Gallery</button>
        </div>
      </div>
    );
    if (analysis.status === 'previewing') return (
      <div className="h-full flex flex-col p-6 pt-safe pb-safe bg-[#0a0f1d]">
        <div className="relative w-full aspect-[3/4] mb-8 bg-slate-900 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
          <img src={analysis.image!} className="w-full h-full object-cover" alt="Preview" />
          <div className="absolute top-6 left-6"><button onClick={() => setAnalysis({status: 'idle', image: null, result: null})} className="p-3 bg-black/40 backdrop-blur-md text-white rounded-full transition-all active:scale-90"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15 19l-7-7 7-7"/></svg></button></div>
        </div>
        <button onClick={startAnalysis} className="w-full py-5 bg-gradient-to-r from-rose-500 to-cyan-500 text-white rounded-3xl font-black shadow-xl flex items-center justify-center gap-3 uppercase text-sm tracking-widest"><SparklesIcon className="w-6 h-6" />Start Analysis</button>
        <button onClick={() => setAnalysis({status: 'idle', image: null, result: null})} className="w-full py-4 text-white/40 font-bold text-xs mt-2 uppercase tracking-widest">Retake</button>
      </div>
    );
    if (analysis.status === 'scanning' || analysis.status === 'analyzing') return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-[#0a0f1d]">
        <div className="relative w-full max-w-[280px] aspect-[3/4] mb-8 bg-slate-900 rounded-[40px] overflow-hidden border-2 animate-border-glow shadow-2xl">
          {analysis.image && <img src={analysis.image} className="w-full h-full object-cover opacity-60" alt="Scanning Look" />}
          <ScannerOverlay step={scanStage} />
        </div>
        <h3 className="text-xl font-black text-white uppercase animate-pulse tracking-widest">Biometric Scanning...</h3>
      </div>
    );
    if (analysis.status === 'completed' && analysis.result) return (
      <div className="h-full w-full relative bg-black flex flex-col pt-safe pb-0 overflow-hidden">
        <div className="absolute inset-0 z-0"><img src={displayedImage || analysis.image!} className="w-full h-full object-cover blur-[20px] opacity-70 scale-110" alt="Analysis Background" /><div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" /></div>
        <header className="relative z-20 flex justify-between items-center px-6 py-6">
          <button onClick={() => setActiveTab(AppTab.HOME)} className="w-11 h-11 bg-black/30 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-all"><HomeIcon className="w-6 h-6 text-white" /></button>
          <div className="text-center"><h1 className="text-[28px] font-black text-white tracking-tighter leading-none uppercase">STYLO<span className="text-cyan-400">GLO</span></h1><p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.3em] mt-1.5">ELEVATE YOUR STYLE</p></div>
          <button onClick={() => setActiveTab(AppTab.STYLE_DETAIL)} className="w-11 h-11 bg-black/30 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-all"><BoltIcon className="w-6 h-6 text-white" /></button>
        </header>
        <div className="absolute inset-x-0 top-[20%] bottom-[28%] flex items-center justify-center z-10 pointer-events-none">
           <div className="relative w-[70vw] h-[70vw] max-w-[340px] max-h-[340px]"><img src={displayedImage || analysis.image!} className="w-full h-full object-cover rounded-[60px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/20" alt="Selfie" /></div>
        </div>
        <div className="relative z-20 flex-1 flex flex-col justify-between px-6 pt-4 pb-8">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="bg-black/50 backdrop-blur-2xl border border-white/10 rounded-[30px] p-5 w-[110px] shadow-2xl">
                <div className="flex items-center gap-2 mb-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Health</span></div>
                <div className="flex items-baseline gap-1"><span className="text-[34px] font-black text-white leading-none">{analysis.result.skinHealth.healthScore || 85}</span><span className="text-sm font-bold text-white/30">%</span></div>
              </div>
              <div className="bg-black/50 backdrop-blur-2xl border border-white/10 rounded-[30px] p-5 w-[110px] shadow-2xl">
                <div className="flex items-center gap-2 mb-2"><UserIcon className="w-3.5 h-3.5 text-cyan-400" /><span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Age/H/W</span></div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[20px] font-black text-white leading-none">{analysis.result.physicalAttributes.estimatedAge.split(' ')[0]} YRS</span>
                  <span className="text-[14px] font-black text-white/40 leading-none uppercase">{analysis.result.physicalAttributes.height} • {analysis.result.physicalAttributes.weight}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
              <MetricProgressBar label="Oiliness" value={parseInt(analysis.result.skinHealth.oiliness) || 20} color="#fbbf24" icon={<SparklesIcon className="w-3 h-3" />} />
              <MetricProgressBar label="Spots" value={parseInt(analysis.result.skinHealth.spots) || 15} color="#f87171" icon={<InfoIcon className="w-3 h-3" />} />
              <MetricProgressBar label="Wrinkles" value={parseInt(analysis.result.skinHealth.wrinkles) || 18} color="#c084fc" icon={<GridIcon className="w-3 h-3" />} />
              <MetricProgressBar label="Vibe" value={80} color="#60a5fa" icon={<FullViewIcon className="w-3 h-3" />} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 mt-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ColorBadge label="Skin tone" value={analysis.result.physicalAttributes.skinColor} color="#8d5524" />
            <ColorBadge label="Hair color" value={analysis.result.physicalAttributes.hairColor} color="#1c1c1c" />
            <ColorBadge label="Eye color" value={analysis.result.physicalAttributes.eyeColor} color="#3d2b1f" />
          </div>
        </div>
        <div className="relative z-[50] bg-black/80 backdrop-blur-2xl border-t border-white/10 px-4 py-6 mb-safe">
           <div className="flex items-center justify-between">
            {[{ id: 'hair', label: 'HAIR', icon: <SparklesIcon className="w-6 h-6" /> }, { id: 'outfit', label: 'OUTFITS', icon: <BoltIcon className="w-6 h-6" /> }, { id: 'access', label: 'ACCESS.', icon: <BoltIcon className="w-6 h-6" /> }, { id: 'tattoo', label: 'TATTOO', icon: <SparklesIcon className="w-6 h-6" /> }, { id: 'diet', label: 'DIET', icon: <SparklesIcon className="w-6 h-6" /> }].map((cat) => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.id as any); setActiveTab(AppTab.STYLE_DETAIL); }} className={`flex flex-col items-center gap-2 transition-all ${activeCategory === cat.id ? 'text-cyan-400' : 'text-white/40'}`}>
                <div className={`p-3 rounded-2xl transition-all ${activeCategory === cat.id ? 'bg-cyan-400/20 border border-cyan-400/40' : 'bg-white/5 border border-transparent'}`}>{cat.icon}</div>
                <span className="text-[9px] font-black uppercase tracking-widest">{cat.label}</span>
              </button>
            ))}
           </div>
        </div>
      </div>
    ); 
    return null;
  }

  // --- RENDER LOGIC ---
  if (!isAppReady) return renderSplashScreen();
  if (isCapturing) return <CameraInterface onCapture={handleMediaSelected} onCancel={() => setIsCapturing(false)} />;
  if (!isAuthenticated) return authStep === 'login' ? renderLogin() : renderSignUp();

  return (
    <div className="h-screen w-full flex flex-col bg-[#0a0f1d] relative overflow-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === AppTab.HOME && renderHome()}
        {activeTab === AppTab.ANALYSIS && renderAnalysis()}
        {activeTab === AppTab.STYLE_DETAIL && renderStyleDetail()}
        {activeTab === AppTab.PROFILE && renderProfile()}
      </main>
      {(activeTab !== AppTab.STYLE_DETAIL && (analysis.status === 'idle' || analysis.status === 'previewing' || analysis.status === 'error' || activeTab === AppTab.HOME || activeTab === AppTab.PROFILE)) && (
        <nav className="h-[88px] bg-black border-t border-white/10 flex items-center justify-around px-4 z-[50] mb-safe">
          <button onClick={() => setActiveTab(AppTab.HOME)} className={`flex flex-col items-center gap-2 transition-all ${activeTab === AppTab.HOME ? 'text-cyan-400' : 'text-white/30'}`}><HomeIcon className="w-6 h-6" /><span className="text-[10px] font-black tracking-widest uppercase">Home</span></button>
          <button onClick={() => { setActiveTab(AppTab.ANALYSIS); if(analysis.status === 'completed') setAnalysis({status: 'idle', image: null, result: null}); }} className={`flex flex-col items-center gap-2 transition-all ${activeTab === AppTab.ANALYSIS ? 'text-cyan-400' : 'text-white/30'}`}><CameraIcon className="w-6 h-6" /><span className="text-[10px] font-black tracking-widest uppercase">Analysis</span></button>
          <button onClick={() => setActiveTab(AppTab.PROFILE)} className={`flex flex-col items-center gap-2 transition-all ${activeTab === AppTab.PROFILE ? 'text-cyan-400' : 'text-white/30'}`}><UserIcon className="w-6 h-6" /><span className="text-[10px] font-black tracking-widest uppercase">Profile</span></button>
        </nav>
      )}
      <div className="absolute w-0 h-0 opacity-0 pointer-events-none overflow-hidden"><input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" /></div>
    </div>
  );
};

export default App;