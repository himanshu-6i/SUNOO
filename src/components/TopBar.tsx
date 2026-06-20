import { Search as SearchIcon, Bell, ChevronLeft, ChevronRight, Check, ChevronDown, Bot } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { currentUser as mockUser } from '../data';
import { Notification } from '../types';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onLogout: () => void;
  onNavigate: (view: 'profile' | 'settings') => void;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onOpenAIChat?: () => void;
}

export function TopBar({ searchQuery, onSearchChange, notifications, onMarkNotificationRead, onLogout, onNavigate, onBack, onForward, canGoBack, canGoForward, onOpenAIChat }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    import('../firebase').then(({ auth }) => {
      auth.onAuthStateChanged((u) => {
        setUser(u);
      });
    });
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-20 flex items-center justify-between px-8 bg-[#0a0a0a]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* We can hide these or keep them for functionality, the design doesn't show them but they are useful */}
        <button 
          onClick={onBack}
          disabled={!canGoBack}
          className={`w-8 h-8 rounded-full bg-[#111] flex items-center justify-center transition-colors hidden md:flex ${canGoBack ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={onForward}
          disabled={!canGoForward}
          className={`w-8 h-8 rounded-full bg-[#111] flex items-center justify-center transition-colors hidden md:flex ${canGoForward ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-6 ml-auto lg:ml-0 lg:flex-1 lg:max-w-2xl">
        <div className="relative group w-full mr-4 hidden sm:block">
           <SearchIcon className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => onSearchChange(e.target.value)}
             placeholder="Search for songs, artists, or AI music..." 
             className="w-full bg-white/5 text-white placeholder-zinc-500 text-[13px] rounded-xl pl-11 pr-12 py-2.5 outline-none focus:bg-white/10 transition-all font-medium border border-transparent"
           />
           <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
             <span className="text-[10px] bg-white/10 border border-white/10 rounded px-1.5 py-0.5 text-zinc-400 font-mono">⌘ K</span>
           </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={onOpenAIChat}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600/20 text-violet-400 hover:bg-violet-600/40 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          title="Ask AI Assistant"
        >
          <Bot className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-zinc-400 hover:text-white transition-colors relative mt-1"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#a22bd8] rounded-full border-2 border-black flex items-center justify-center pointer-events-none">
              </div>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-6 w-80 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-300">{unreadCount} unread</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        notifications.forEach(n => !n.read && onMarkNotificationRead(n.id));
                      }}
                       className="text-[11px] text-[#a22bd8] hover:text-pink-400 flex items-center gap-1 font-medium transition-colors"
                    >
                      <Check className="w-3 h-3" /> All Read
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-sm">No new notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-white/5 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors ${!notif.read ? 'bg-[#a22bd8]/5' : ''}`}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-[#a22bd8] flex-shrink-0" style={{ opacity: notif.read ? 0 : 1 }} />
                      <div className="flex-1">
                        <p className={`text-[13px] tracking-tight ${!notif.read ? 'text-white font-semibold' : 'text-zinc-300'}`}>{notif.title}</p>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{notif.message}</p>
                        <p className="text-[9px] text-zinc-500 mt-2 tracking-wider uppercase">{notif.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 hover:bg-white/5 pr-2 rounded-full transition-colors focus:outline-none py-1"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden border border-white/10 shrink-0">
               <img src={user?.photoURL || mockUser.avatarUrl} alt={user?.displayName || mockUser.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start hidden lg:flex text-left">
               <span className="text-[12px] font-bold text-white transition-colors">{user?.displayName || mockUser.name}</span>
               <span className="text-[10px] text-zinc-500 capitalize">{mockUser.role} Plan</span>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500 ml-1 hidden lg:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-4 w-48 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
               <div className="px-4 py-3 border-b border-white/5 lg:hidden">
                 <p className="text-sm font-semibold text-white truncate">{user?.displayName || mockUser.name}</p>
                 <p className="text-xs text-zinc-500 capitalize">{mockUser.role} Plan</p>
               </div>
               <button onClick={() => { onNavigate('profile'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">Profile</button>
               <button onClick={() => { onNavigate('settings'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">Settings</button>
               <div className="border-t border-white/5 mt-1 pt-1">
                 <button 
                  onClick={() => { onLogout(); setShowProfileMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
                 >
                   Log Out
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
