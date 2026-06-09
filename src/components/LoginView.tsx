import { Music, ArrowRight, Github, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { SunooLogo } from './SunooLogo';

interface LoginViewProps {
  onLogin: () => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { auth } = await import('../firebase');
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setIsGoogleLoading(false);
    }
  };

  const handleGithubLogin = () => {
    setIsGithubLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center relative overflow-hidden text-white font-sans selection:bg-violet-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px] -translate-y-1/4 -translate-x-1/4" />
        <div className="w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/4 translate-x-1/4" />
      </div>

      <div className="w-full max-w-md p-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-10">
          <SunooLogo className="w-20 h-20 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
          <h1 className="text-4xl font-display font-bold tracking-tighter text-white mb-2">SUNOO</h1>
          <p className="text-zinc-400 text-center">The next generation of music streaming.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
          
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-black font-bold rounded-xl py-3.5 mt-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-r-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative z-10 mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/40 text-zinc-500 backdrop-blur-sm rounded-full">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading || isGithubLoading}
                className="flex justify-center py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-white/50 border-r-transparent rounded-full animate-spin" />
                ) : (
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                )}
              </button>
              <button 
                type="button"
                onClick={handleGithubLogin}
                disabled={isGithubLoading || isLoading || isGoogleLoading}
                className="flex justify-center py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {isGithubLoading ? (
                  <div className="w-5 h-5 border-2 border-white/50 border-r-transparent rounded-full animate-spin" />
                ) : (
                  <Github className="w-5 h-5 text-zinc-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-zinc-500 text-sm">
            Don't have an account? <button className="text-violet-400 hover:text-white transition-colors font-medium">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}
