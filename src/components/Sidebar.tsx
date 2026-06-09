import { Home, Search, Library, User, Settings, Music, PlusCircle, LayoutDashboard } from 'lucide-react';
import { ViewState } from '../types';
import { SunooLogo } from './SunooLogo';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  subscriptionPlan: string;
}

export function Sidebar({ currentView, setView, subscriptionPlan }: SidebarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'library', icon: Library, label: 'Your Library' },
  ];

  const creatorItems = [
    { id: 'creator', icon: LayoutDashboard, label: 'Creator Dashboard' },
  ];

  return (
    <div className="w-64 bg-black flex flex-col h-full border-r border-white/5 pb-24">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
          <SunooLogo className="w-8 h-8" />
          SUNOO
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-8">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                currentView === item.id 
                  ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-violet-400' : ''}`} />
              {item.label}
            </button>
          ))}
        </div>

        <div>
          <p className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Creator Tools</p>
          <div className="space-y-1">
             {creatorItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  currentView === item.id 
                    ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20' 
                    : 'text-zinc-400 hover:text-violet-200 hover:bg-violet-500/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 mt-auto">
        {subscriptionPlan === 'Free' ? (
          <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-white/5 p-4 rounded-2xl">
            <p className="text-sm font-semibold text-white mb-1">Upgrade to Premium</p>
            <p className="text-xs text-zinc-400 mb-3">Lossless audio & offline mode</p>
            <button 
              onClick={() => setView('premium')}
              className="w-full bg-white text-black text-sm font-semibold py-2 rounded-full hover:scale-105 transition-transform"
            >
              Try 1 Month Free
            </button>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
            <p className="text-xs text-zinc-400 mb-1">Current Plan</p>
            <p className="text-sm font-bold text-violet-400">{subscriptionPlan}</p>
            <button 
              onClick={() => setView('premium')}
              className="mt-3 w-full bg-white/10 text-white text-xs font-semibold py-2 rounded-full hover:bg-white/20 transition-colors"
            >
              Manage Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
