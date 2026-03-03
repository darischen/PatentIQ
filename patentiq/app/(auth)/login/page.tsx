'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, User, Eye, Check, ArrowLeft, AlertCircle, RefreshCcw, ShieldCheck, X as CloseIcon } from 'lucide-react';

type AuthView = 'login' | 'signup' | 'forgot-password' | 'reset-code' | 'new-password' | 'error-email' | 'error-password' | 'success';

interface Toast {
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<AuthView>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase().includes('fail')) {
      setView('error-email');
      return;
    }
    if (password === 'error') {
      setView('error-password');
      return;
    }

    if (email && password) {
      router.push('/projects');
    }
  };

  const getBorderClass = () => {
    if (confirmPassword === '') return 'border-transparent';
    return password === confirmPassword ? 'border-emerald-500' : 'border-rose-500';
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match. Please try again.", "error");
      return;
    }
    if (username && email && password) {
      setView('success');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast("Mail sent successfully");
      setTimeout(() => setView('reset-code'), 300);
    }
  };

  const handleResendCode = () => {
    showToast("Verification code sent successfully to your registered mail");
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setView('new-password');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match. Please try again.", "error");
      return;
    }
    setView('success');
  };

  const renderFluidBackground = () => (
    <div className="hidden lg:block w-[55%] relative h-full bg-[#000d2b] overflow-hidden">
      {/* Dynamic Animated Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[100px] animate-[drift_15s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[100px] animate-[drift_20s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-indigo-500/20 rounded-full blur-[80px] animate-[pulse-slow_10s_ease-in-out_infinite]"></div>
      </div>

      {/* Fluid SVG Animation */}
      <div className="absolute inset-0 z-10 opacity-60">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#1a3cff', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#8a2bff', stopOpacity:1}} />
            </linearGradient>
          </defs>
          <path
            d="M0,0 Q25,25 50,0 T100,0 V100 Q75,75 50,100 T0,100 Z"
            fill="url(#grad1)"
            className="animate-[fluid-morph_12s_ease-in-out_infinite]"
          />
        </svg>
      </div>

      {/* Textured Overlay */}
      <div className="absolute inset-0 z-20 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-screen animate-[subtle-zoom_20s_linear_infinite]"></div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping [animation-duration:3s]"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping [animation-duration:4s]"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-purple-300 rounded-full animate-ping [animation-duration:5s]"></div>
      </div>

      {/* Glassmorphic Footer Overlay */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[85%] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center text-center z-40 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <div className="w-12 h-1 bg-white/20 rounded-full mb-6"></div>
        <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.4em] mb-4">Intellectual Property Shield</p>
        <p className="text-[13px] font-medium text-white/70 leading-relaxed max-w-sm">
          Securely analyzing and protecting global innovations with state-of-the-art neural intelligence and AES-256 standard encryption.
        </p>
        <div className="mt-8 flex gap-4">
          <div className="h-1.5 w-8 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 w-1/2 animate-[loading_2s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeader = (title: string, sub: string) => (
    <div className="mb-10">
      <h1 className="text-[32px] font-bold text-slate-900 leading-tight mb-2 tracking-tight">{title}</h1>
      <p className="text-slate-400 font-medium">{sub}</p>
    </div>
  );

  const renderErrorView = (type: 'email' | 'password') => (
    <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-rose-100">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-[28px] font-bold text-slate-900 leading-tight mb-4">
        {type === 'email' ? 'Email Not Found' : 'Invalid Password'}
      </h2>
      <p className="text-slate-500 font-medium leading-relaxed mb-10">
        {type === 'email'
          ? "The email address you entered doesn't match any account in our intelligence network. Please verify and try again."
          : "The password you provided is incorrect. For security reasons, multiple failed attempts may lock your account."}
      </p>
      <div className="space-y-4">
        <button
          onClick={() => setView('login')}
          className="w-full bg-[#5c8aff] text-white py-4.5 rounded-[1.25rem] font-bold text-lg hover:bg-[#4a76e0] transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <RefreshCcw size={20} /> Try Again
        </button>
        {type === 'password' && (
          <button
            onClick={() => setView('forgot-password')}
            className="w-full bg-white border border-slate-200 text-slate-600 py-4.5 rounded-[1.25rem] font-bold text-lg hover:bg-slate-50 transition-all"
          >
            Reset Password
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      {/* Toast Notification Pop-up */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500 ease-out">
          <div className="bg-[#1e293b] text-white px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-4 backdrop-blur-xl">
            <div className={`w-8 h-8 ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'} rounded-xl flex items-center justify-center flex-shrink-0`}>
              {toast.type === 'error' ? <AlertCircle size={18} className="text-white" /> : <Check size={18} strokeWidth={3} className="text-white" />}
            </div>
            <p className="text-[13px] font-bold tracking-tight">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white transition-colors">
              <CloseIcon size={16} />
            </button>
          </div>
        </div>
      )}

      <div className={`w-full max-w-[1280px] h-[820px] bg-[#f8f9fb] rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] flex overflow-hidden transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'}`}>

        {/* Left Side: Auth Forms */}
        <div className="w-full lg:w-[45%] bg-white p-12 md:p-16 flex flex-col relative overflow-hidden">

          {/* Logo Section */}
          <div className="flex items-center gap-2 mb-10 relative z-10">
            <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Patent Intel</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full relative z-10">
            {view === 'login' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {renderHeader("Welcome Back Inventor!", "We Are Happy To See You Again")}
                <div className="bg-[#f3f4f6] p-1.5 rounded-full flex mb-10 relative">
                  <div className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#5c8aff] rounded-full transition-all duration-300 ease-out shadow-md translate-x-0" />
                  <button className="flex-1 py-2.5 rounded-full text-sm font-bold relative z-10 text-white">Sign In</button>
                  <button onClick={() => setView('signup')} className="flex-1 py-2.5 rounded-full text-sm font-bold relative z-10 text-slate-400">Sign Up</button>
                </div>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="relative">
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-[#f3f4f6] border-none rounded-2xl py-4 pl-6 pr-14 text-[15px] text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#5c8aff]/20 outline-none" />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={20} /></div>
                  </div>
                  <div className="relative">
                    <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full bg-[#f3f4f6] border-none rounded-2xl py-4 pl-6 pr-14 text-[15px] text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#5c8aff]/20 outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"><Eye size={20} /></button>
                  </div>
                  <div className="flex items-center justify-between px-1 py-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="hidden" />
                      <div className={`w-5 h-5 border-2 border-[#5c8aff] rounded-full flex items-center justify-center transition-all ${rememberMe ? 'bg-[#5c8aff]' : ''}`}>
                        {rememberMe && <Check size={12} className="text-white" strokeWidth={4} />}
                      </div>
                      <span className="text-sm font-medium text-slate-400 group-hover:text-slate-600">Remember me</span>
                    </label>
                    <button type="button" onClick={() => setView('forgot-password')} className="text-sm font-bold text-[#5c8aff] hover:underline">Forgot Password?</button>
                  </div>
                  <button type="submit" className="w-full bg-[#5c8aff] text-white py-4.5 rounded-[1.25rem] font-bold text-lg mt-6 hover:bg-[#4a76e0] transition-all shadow-[0_10px_30px_-5px_rgba(92,138,255,0.4)] active:scale-[0.98]">Login</button>
                </form>
              </div>
            )}
            {view === 'signup' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {renderHeader("Create Your Account", "Start securing your intellectual property")}
                <div className="bg-[#f3f4f6] p-1.5 rounded-full flex mb-10 relative">
                  <div className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#5c8aff] rounded-full transition-all duration-300 ease-out shadow-md translate-x-full" />
                  <button onClick={() => setView('login')} className="flex-1 py-2.5 rounded-full text-sm font-bold relative z-10 text-slate-400">Sign In</button>
                  <button className="flex-1 py-2.5 rounded-full text-sm font-bold relative z-10 text-white">Sign Up</button>
                </div>
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="relative">
                    <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" className="w-full bg-[#f3f4f6] border-none rounded-2xl py-4 pl-6 pr-14 text-[15px] text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#5c8aff]/20 outline-none" />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"><User size={20} /></div>
                  </div>
                  <div className="relative">
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-[#f3f4f6] border-none rounded-2xl py-4 pl-6 pr-14 text-[15px] text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#5c8aff]/20 outline-none" />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={20} /></div>
                  </div>
                  <div className="relative">
                    <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className={`w-full bg-[#f3f4f6] rounded-2xl py-4 pl-6 pr-14 text-[15px] text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#5c8aff]/20 outline-none border-2 transition-all ${getBorderClass()}`} />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={20} /></div>
                  </div>
                  <div className="relative">
                    <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className={`w-full bg-[#f3f4f6] rounded-2xl py-4 pl-6 pr-14 text-[15px] text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#5c8aff]/20 outline-none border-2 transition-all ${getBorderClass()}`} />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"><ShieldCheck size={20} /></div>
                  </div>
                  <button type="submit" className="w-full bg-[#5c8aff] text-white py-4.5 rounded-[1.25rem] font-bold text-lg mt-6 hover:bg-[#4a76e0] transition-all shadow-[0_10px_30px_-5px_rgba(92,138,255,0.4)] active:scale-[0.98]">Sign Up</button>
                </form>
              </div>
            )}
            {view === 'forgot-password' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <button onClick={() => setView('login')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest mb-10 transition-colors">
                  <ArrowLeft size={14} /> Back to Login
                </button>
                {renderHeader("Forgot Password?", "No worries, we'll send you reset instructions.")}
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="relative">
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-[#f3f4f6] border-none rounded-2xl py-4 pl-6 pr-14 text-[15px] text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#5c8aff]/20 outline-none" />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={20} /></div>
                  </div>
                  <button type="submit" className="w-full bg-[#5c8aff] text-white py-4.5 rounded-[1.25rem] font-bold text-lg hover:bg-[#4a76e0] transition-all shadow-lg active:scale-[0.98]">Send Reset Link</button>
                </form>
              </div>
            )}
            {view === 'reset-code' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <button onClick={() => setView('forgot-password')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest mb-10 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>
                {renderHeader("Verify Identity", `We sent a code to ${email}`)}
                <form onSubmit={handleVerifyCode} className="space-y-8">
                  <div className="flex gap-3 justify-between">
                    {[1, 2, 3, 4].map((i) => (
                      <input key={i} type="text" maxLength={1} className="w-16 h-16 bg-[#f3f4f6] border-none rounded-2xl text-center text-2xl font-black text-slate-900 focus:ring-4 focus:ring-[#5c8aff]/10 outline-none" />
                    ))}
                  </div>
                  <button type="submit" className="w-full bg-[#5c8aff] text-white py-4.5 rounded-[1.25rem] font-bold text-lg hover:bg-[#4a76e0] transition-all shadow-lg active:scale-[0.98]">Verify Code</button>
                  <p className="text-center text-sm font-medium text-slate-400">Didn&apos;t receive it? <button type="button" onClick={handleResendCode} className="text-[#5c8aff] font-bold hover:underline">Resend</button></p>
                </form>
              </div>
            )}
            {view === 'new-password' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                {renderHeader("Set New Password", "Must be at least 8 characters long.")}
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="relative">
                    <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className={`w-full bg-[#f3f4f6] rounded-2xl py-4 pl-6 pr-14 text-[15px] text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#5c8aff]/20 outline-none border-2 transition-all ${getBorderClass()}`} />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={20} /></div>
                  </div>
                  <div className="relative">
                    <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className={`w-full bg-[#f3f4f6] rounded-2xl py-4 pl-6 pr-14 text-[15px] text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#5c8aff]/20 outline-none border-2 transition-all ${getBorderClass()}`} />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"><ShieldCheck size={20} /></div>
                  </div>
                  <button type="submit" className="w-full bg-[#5c8aff] text-white py-4.5 rounded-[1.25rem] font-bold text-lg mt-6 hover:bg-[#4a76e0] transition-all shadow-lg active:scale-[0.98]">Reset Password</button>
                </form>
              </div>
            )}
            {view === 'error-email' && renderErrorView('email')}
            {view === 'error-password' && renderErrorView('password')}
            {view === 'success' && (
              <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full animate-in zoom-in-95 duration-500 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-[32px] font-bold text-slate-900 leading-tight mb-4">You&apos;re All Set!</h2>
                <p className="text-slate-500 font-medium leading-relaxed mb-10">Your security profile has been updated. You can now access the full power of Patent Intel.</p>
                <button onClick={() => setView('login')} className="w-full bg-[#5c8aff] text-white py-5 rounded-[1.25rem] font-bold text-lg hover:bg-[#4a76e0] transition-all shadow-lg active:scale-95">Go to Sign In</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visual Content */}
        {renderFluidBackground()}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fluid-morph {
          0%, 100% { d: path("M0,0 Q25,25 50,0 T100,0 V100 Q75,75 50,100 T0,100 Z"); }
          50% { d: path("M0,0 Q20,30 50,10 T100,0 V100 Q80,70 50,90 T0,100 Z"); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10%, 10%) scale(1.1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .py-4\\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
      `}} />
    </div>
  );
}
