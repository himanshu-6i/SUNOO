import { Music, ArrowRight, Github, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { SunooLogo } from './SunooLogo';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

interface LoginViewProps {
  onLogin: () => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');

  const [showConfigModal, setShowConfigModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (error: any) {
      console.error('Authentication error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        setShowConfigModal(true);
      } else {
        setAuthError(error.message || 'Failed to authenticate');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Let the onAuthStateChanged in App.tsx handle navigation
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setAuthError(error.message || 'Failed to sign in with Google');
      setIsGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    setAuthError('');
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      // Let the onAuthStateChanged in App.tsx handle navigation
    } catch (error: any) {
      console.error('Error signing in with Github:', error);
      setAuthError(error.message || 'Failed to sign in with Github');
      setIsGithubLoading(false);
    }
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
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            
            {authError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-xl p-3">
                {authError}
              </div>
            )}
            
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
                  {isSignUp ? 'Sign Up' : 'Sign In'}
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

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 font-medium"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-white/50 border-r-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-zinc-500 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError('');
              }}
              className="text-violet-400 hover:text-white transition-colors font-medium"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>

      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#18181b] border border-white/10 p-8 rounded-3xl max-w-lg w-full shadow-2xl relative shadow-violet-500/10">
            <h3 className="text-2xl font-bold text-white mb-2">Configure Firebase</h3>
            <p className="text-zinc-400 mb-6 font-medium text-sm">
              Your Firebase project does not have Email/Password authentication enabled. To fix this login error:
            </p>
            
            <ol className="space-y-4 mb-8 text-sm text-zinc-300">
              <li className="flex gap-4">
                <span className="w-6 h-6 flex items-center justify-center bg-violet-600 rounded-full text-white font-bold shrink-0">1</span>
                <span>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-violet-400 font-medium hover:underline">Firebase Console</a> and open your project.</span>
              </li>
              <li className="flex gap-4">
                <span className="w-6 h-6 flex items-center justify-center bg-violet-600 rounded-full text-white font-bold shrink-0">2</span>
                <span>Click on <strong>Authentication</strong> in the left sidebar, then go to the <strong>Sign-in method</strong> tab.</span>
              </li>
              <li className="flex gap-4">
                <span className="w-6 h-6 flex items-center justify-center bg-violet-600 rounded-full text-white font-bold shrink-0">3</span>
                <span>Click <strong>Add new provider</strong>, select <strong>Email/Password</strong>, and toggle the "Enable" switch. Then click <strong>Save</strong>.</span>
              </li>
              <li className="flex gap-4">
                <span className="w-6 h-6 flex items-center justify-center bg-violet-600 rounded-full text-white font-bold shrink-0">4</span>
                <span>Come back here and try logging in again!</span>
              </li>
            </ol>
            
            <button 
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="w-full bg-white text-black font-bold rounded-xl py-3.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              I've enabled it, let me try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
